import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { supabase } from "../supabase-client";
import { VotesButton } from "./VotesButton";
import { CommentSection } from "./CommentSection";
import LoadingScreen from "./LoadingScreen";

interface Props {
  postId: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url: string;
}

const fetchPostsById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

export function PostDetail({ postId }: Props) {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostsById(postId),
  });

  if (isLoading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <Title>{data?.title}</Title>
      <Image src={data?.image_url} alt={data.title} />
      <Content>{data.content}</Content>
      <DateText>
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </DateText>
      <VotesButton postId={postId} />
      <CommentSection postId={postId} />
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: 3.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(to right, #a855f7, #ec4899);
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Image = styled.img`
  margin-top: 1rem;
  width: 100%;
  height: 16rem;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const Content = styled.p`
  color: #9ca3af; /* Tailwind's gray-400 */
`;

const DateText = styled.p`
  color: #6b7280; /* Tailwind's gray-500 */
  font-size: 0.875rem;
`;
