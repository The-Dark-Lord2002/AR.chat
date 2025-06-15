import { CommunityList } from "../components/CommunityList";
import styled from "styled-components";
export const CommunitiesPage = () => {
  return (
    <PageWrapper>
      <Title>جوامع</Title>
      <CommunityList />
    </PageWrapper>
  );
};
const PageWrapper = styled.div`
  padding-top: 5rem; /* pt-20 */
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
