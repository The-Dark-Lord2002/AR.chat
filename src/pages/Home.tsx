import styled from "styled-components";
import { PostList } from "../components/PostList";

// Styled Components
const Wrapper = styled.div`
  padding-top: 2.5rem; /* pt-10 */
`;

const Title = styled.h2`
  font-size: 3.75rem; /* text-6xl */
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(
    to right,
    #a855f7,
    #ec4899
  ); /* from-purple-500 to-pink-500 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Content = styled.div``;

export function Home() {
  return (
    <Wrapper>
      <Title>پست‌های اخیر</Title>
      <Content>
        <PostList />
      </Content>
    </Wrapper>
  );
}
