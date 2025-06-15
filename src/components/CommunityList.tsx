import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import styled from "styled-components";
export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export function CommunityList() {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return <div className="text-center py-4">بارگیری انجمن‌ها...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <Wrapper>
      {data?.map((community) => (
        <CommunityCard key={community.id}>
          <CommunityLink to={`/community/${community.id}`}>
            {community.name}
          </CommunityLink>
          <Description>{community.description}</Description>
        </CommunityCard>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 64rem; /* max-w-5xl */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommunityCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-0.25rem);
  }
`;

const CommunityLink = styled(Link)`
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  color: #a855f7; /* text-purple-500 */
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  margin-top: 0.5rem;
  color: #9ca3af; /* text-gray-400 */
`;
