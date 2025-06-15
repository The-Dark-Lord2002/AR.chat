import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";
import styled from "styled-components";

// Types
interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

// Supabase operations
const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

// Component
export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  // Build comment tree (Map of comments - Organize Replies - Return Tree)
  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <Wrapper>
      <Title>نظرات</Title>

      {user ? (
        <form onSubmit={handleSubmit}>
          <TextArea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="نظر بنویسید..."
            rows={3}
          />
          <SubmitButton type="submit">
            {isPending ? "درحال ارسال..." : "ارسال نظر"}
          </SubmitButton>
          {isError && <ErrorText>خطا در ارسال نظر.</ErrorText>}
        </form>
      ) : (
        <LoginNote>برای ارسال نظر باید وارد شوید.</LoginNote>
      )}

      <CommentList>
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </CommentList>
    </Wrapper>
  );
};
// Styled Components
const Wrapper = styled.div`
  margin-top: 1.5rem; /* mt-6 */
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  padding: 0.5rem;
  border-radius: 0.25rem;
`;

const SubmitButton = styled.button`
  margin-top: 0.5rem;
  background-color: #a855f7; /* purple-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: #f87171; /* red-500 */
  margin-top: 0.5rem;
`;

const LoginNote = styled.p`
  margin-bottom: 1rem;
  color: #4b5563; /* gray-600 */
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
