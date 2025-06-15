import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

interface Props {
  postId: number;
}
interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);
  if (error) throw new Error(error.message);
  return data as Vote[];
};

export function VotesButton({ postId }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote.");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) return <div>Loading votes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <VoteContainer>
      <VoteButton onClick={() => mutate(1)} active={userVote === 1} type="like">
        👍 {likes}
      </VoteButton>
      <VoteButton
        onClick={() => mutate(-1)}
        active={userVote === -1}
        type="dislike"
      >
        👎 {dislikes}
      </VoteButton>
    </VoteContainer>
  );
}
// Styled Components
const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const VoteButton = styled.button<{ active: boolean; type: "like" | "dislike" }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  background-color: ${({ active, type }) =>
    active
      ? type === "like"
        ? "#22c55e" // Tailwind green-500
        : "#ef4444" // Tailwind red-500
      : "#e5e7eb"}; // Tailwind gray-200

  color: ${({ active }) => (active ? "#fff" : "#000")};
`;
