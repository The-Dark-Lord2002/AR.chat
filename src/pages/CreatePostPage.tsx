import styled from "styled-components";
import { CreatePost } from "../components/CreatePost";

// Styled Components
const Wrapper = styled.div`
  padding-top: 5rem;
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
  ); /* purple-500 to pink-500 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export function CreatePostPage() {
  return (
    <Wrapper>
      <Title>ایجاد پست جدید</Title>
      <CreatePost />
    </Wrapper>
  );
}
