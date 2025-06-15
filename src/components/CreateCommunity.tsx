import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "../supabase-client";
import styled from "styled-components";
import { useNavigate } from "react-router";
interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Title>ایجاد انجمن جدید</Title>

      <div>
        <Label htmlFor="name">نام انجمن</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "درحال ساخت انجمن..." : "ایجاد انجمن"}
      </Button>

      {isError && <ErrorMessage>Error creating community.</ErrorMessage>}
    </Form>
  );
};
const Form = styled.form`
  max-width: 42rem; /* same as max-w-2xl */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: white;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: white;
`;

const Button = styled.button`
  background-color: #a855f7;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #f87171; /* red-500 */
`;
