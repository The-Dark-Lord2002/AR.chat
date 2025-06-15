import styled from "styled-components";
import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export function PostItem({ post }: Props) {
  return (
    <CardWrapper>
      <Glow className="glow" />
      <StyledLink to={`/post/${post.id}`}>
        <Card className="card">
          <Header>
            {post.user_avatar_url ? (
              <Avatar src={post.user_avatar_url} alt="user_avatar" />
            ) : (
              <FallbackAvatar />
            )}
            <div style={{ flex: 1 }}>
              <Title>{post.title}</Title>
            </div>
          </Header>
          <div style={{ flex: 1 }}>
            <ImageBanner src={post.image_url} alt={post.title} />
          </div>{" "}
          <Container>
            <IconButton>
              ❤️<Count>{post.like_count ?? 0}</Count>
            </IconButton>
            <IconButton>
              💬<Count>{post.comment_count ?? 0}</Count>
            </IconButton>
          </Container>
        </Card>
      </StyledLink>
    </CardWrapper>
  );
}
const CardWrapper = styled.div`
  position: relative;

  &:hover .glow {
    opacity: 0.5;
  }

  &:hover .card {
    background-color: #2d3748; /* Tailwind's gray-800 */
  }
`;

const Glow = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 20px;
  background: linear-gradient(
    to right,
    #db2777,
    #8b5cf6
  ); /* pink-600 to purple-600 */
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
`;

const StyledLink = styled(Link)`
  position: relative;
  z-index: 10;
  display: block;
`;

const Card = styled.div`
  width: 20rem;
  height: 19rem;
  background-color: rgb(24, 27, 32);
  border: 1px solid rgb(84, 90, 106);
  border-radius: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  overflow: hidden;
  transition: background-color 0.3s;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

const FallbackAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(to top left, #8a2be2, #491f70);
`;

const Title = styled.div`
  font-size: 1.25rem;
  line-height: 1.375rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const ImageBanner = styled.img`
  margin-top: 0.5rem;
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 20px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconButton = styled.span`
  cursor: pointer;
  height: 40px;
  width: 50px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  border-radius: 0.5rem;
`;

const Count = styled.span`
  margin-left: 0.5rem;
`;
