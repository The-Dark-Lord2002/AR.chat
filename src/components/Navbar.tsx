// Navbar.jsx
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <Nav>
      <Container>
        <Inner>
          <Logo to="/">
            تصویر<span>کده</span>
          </Logo>
          <DesktopLinks>
            <Link to="/">خانه</Link>
            <Link to="/create">ایجاد پست</Link>
            <Link to="/communities">جوامع</Link>
            <Link to="/community/create">ایجاد انجمن</Link>
          </DesktopLinks>
          <AuthSection>
            {user ? (
              <div className="user-info">
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="User Avatar" />
                )}
                <span>{displayName}</span>
                <button onClick={signOut}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button className="github-login" onClick={signInWithGitHub}>
                <svg
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFFFFF"
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  ></path>
                </svg>
                Github
              </button>
            )}
          </AuthSection>
          <MobileButton
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </MobileButton>
        </Inner>
      </Container>

      {menuOpen && (
        <MobileMenu>
          <Link to="/">خانه</Link>
          <Link to="/create">ایجاد پست</Link>
          <Link to="/communities">جوامع</Link>
          <Link to="/community/create">ایجاد انجمن</Link>
        </MobileMenu>
      )}
    </Nav>
  );
}
const Nav = styled.nav`
  direction: ltr;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 40;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const Logo = styled(Link)`
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  span {
    color: #a855f7;
  }
`;

const DesktopLinks = styled.div`
  direction: rtl;
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }

  a {
    color: #d1d5db;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
`;

const AuthSection = styled.div`
  display: none;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
      object-fit: cover;
    }

    span {
      color: #d1d5db;
    }

    button {
      background: #ef4444;
      color: white;
      border-radius: 9999px;
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      svg {
        width: 1.25rem;
        height: 1.25rem;
        transition: transform 0.3s;

        &:hover {
          transform: rotate(90deg);
        }
      }
    }
  }

  .github-login {
    display: flex;
    gap: 0.75rem;
    cursor: pointer;
    background: linear-gradient(to right, #1f2937, #000);
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.75rem;
    border-radius: 9999px;
    border: 1px solid #4b5563;
    transition: all 0.2s;

    &:hover {
      scale: 1.05;
      color: #6b7280;
      border-color: #1f2937;
      background: linear-gradient(to right, #000, #374151);
    }
  }
`;

const MobileButton = styled.button`
  display: block;
  color: #d1d5db;
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const MobileMenu = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  direction: rtl;
  background: rgba(10, 10, 10, 0.9);
  padding: 0.5rem 0;

  a {
    display: block;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      background-color: #374151;
      color: white;
    }
  }
`;
