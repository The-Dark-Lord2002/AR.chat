import styled, { keyframes } from "styled-components";

export default function LoadingScreen() {
  return (
    <ScreenContainer>
      <Content>
        <Title>
          AR<span>.chat</span>
        </Title>
        <Spinner
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            opacity="0.75"
          />
        </Spinner>
      </Content>
    </ScreenContainer>
  );
}
const ScreenContainer = styled.div`
  display: flex;
  height: 50%;
  width: auto;
  align-items: center;
  justify-content: center;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: black;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800;
  letter-spacing: 0.05em;
  color: black;

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  span {
    color: #ec4899; /* Tailwind's pink-500 */
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  animation: ${spin} 1s linear infinite;
  color: #ec4899;
`;
