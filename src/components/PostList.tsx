import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "../components/PostItem";
import LoadingScreen from "../components/LoadingScreen";
import styled from "styled-components";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  user_avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}
//get_posts_with_counts
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);
  return data as Post[];
};

export function PostList() {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
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
  console.log(data);

  return (
    <PostsContainer>
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </PostsContainer>
  );
}

// Styled Component for the container
const PostsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;
