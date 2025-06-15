import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import type { Community } from "./CommunityList";
import { fetchCommunities } from "./CommunityList";
import slugify from "slugify";
import styled from "styled-components";
interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const safeTitle = slugify(post.title, { lower: true, strict: true });
  const safeFileName = slugify(imageFile.name, { lower: true, strict: true });
  const filePath = `${safeTitle}-${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">عنوان</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">محتوا</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="community">انتخاب انجمن</Label>
        <Select id="community" onChange={handleCommunityChange}>
          <option value={""}>-- Choose a Community --</option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="image">آپلود تصویر</Label>
        <Input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <Button type="submit">
        {isPending ? "درحال ساخت..." : "ایجاد پست "}
      </Button>

      {isError && <ErrorMessage>خطا در ایجاد پست.</ErrorMessage>}
    </Form>
  );
};
const Form = styled.form`
  max-width: 42rem; /* max-w-2xl */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: white;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: white;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: white;
`;

const Button = styled.button`
  background-color: #a855f7; /* bg-purple-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #ef4444; /* text-red-500 */
`;
