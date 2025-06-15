import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import styled from "styled-components";
interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  return (
    <Wrapper>
      {data && data.length > 0 ? (
        <>
          <Title>{data?.[0]?.communities?.name ?? "انجمن"} پست‌های انجمن</Title>
          <PostsContainer>
            {data.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </PostsContainer>
        </>
      ) : (
        <EmptyMessage>هنوز پستی در این انجمن ارسال نشده است.</EmptyMessage>
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 3.75rem; /* text-6xl */
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(to right, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #9ca3af; /* Tailwind's text-gray-400 */
`;
