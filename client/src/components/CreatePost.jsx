import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function CreatePost({ user }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What is happening?",
        showOnlyWhenEditable: true,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
  });

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      editor?.commands.clearContent();
      setImage(null);
      setImagePreview(null);
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("post created successfully");
    },
    onError: (err) => {
      console.log(err.response?.data?.message || "Failed to create post");
    },
  });

  const handlePostCreation = async () => {
    try {
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (!editor) return null;

  return (
    <div className="flex flex-1 items-start gap-3 p-4">
      <img
        src={user?.profilePicture || "/avatar.png"}
        alt={user?.username}
        className="size-12 rounded-full object-cover"
      />
      <div className="flex flex-1 flex-col">
        <EditorContent
          editor={editor}
          className="max-h-[10rem] flex-wrap overflow-x-auto overflow-y-auto border-none outline-none placeholder:text-red-400"
        />

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Selected"
              className="h-auto w-full rounded-lg"
            />
            k
          </div>
        )}

        <div className="mt-10 flex flex-1 items-end justify-between">
          <div className="flex space-x-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Image className="text-blue-500" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <button
            disabled={!editor.getText().trim() || isPending}
            onClick={handlePostCreation}
            className="flex h-10 w-20 items-center justify-center rounded-full bg-blue-500 font-semibold text-white disabled:bg-[#1E417B]"
          >
            <h1>Post</h1>
            {isPending && <Loader2 size={15} className="ml-1 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
