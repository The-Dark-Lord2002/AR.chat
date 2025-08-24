// App.tsx
import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import styled from "styled-components";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";

function App() {
  return (
    <AppWrapper>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </Container>
    </AppWrapper>
  );
}
export default App;

// Styled Components
const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: black;
  color: #f3f4f6; /* tailwind's text-gray-100 */
  transition: opacity 0.7s ease;
  padding-top: 5rem;
`;

const Container = styled.div`
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem 1rem;
`;
