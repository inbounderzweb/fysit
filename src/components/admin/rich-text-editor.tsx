"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { MediaPickerModal } from "@/components/admin/media-picker";

export function RichTextEditor({
  name,
  initialContent = "",
  placeholder = "Write your post…",
}: {
  name: string;
  initialContent?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(initialContent);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[300px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={html} />
      <div className="rounded-xl border border-neutral-200">
        {editor && <Toolbar editor={editor} onInsertImage={() => setIsImagePickerOpen(true)} />}
        <div className="px-4 py-3">
          <EditorContent editor={editor} />
        </div>
      </div>

      {isImagePickerOpen && editor && (
        <MediaPickerModal
          folder="blog"
          onClose={() => setIsImagePickerOpen(false)}
          onSelect={(media) => {
            editor.chain().focus().setImage({ src: media.secureUrl, alt: media.altText ?? "" }).run();
            setIsImagePickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 p-2">
      <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        }}
      >
        Link
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        Quote
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        Left
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        Center
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        Right
      </ToolbarButton>
      <ToolbarButton active={false} onClick={onInsertImage}>
        Image
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1.5 text-sm ${active ? "bg-indigo-100 text-indigo-700" : "text-neutral-600 hover:bg-neutral-100"}`}
    >
      {children}
    </button>
  );
}
