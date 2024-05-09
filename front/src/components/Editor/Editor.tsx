"use client";

import Link from "@tiptap/extension-link";
import { Save } from "lucide-react";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import EditorControls from "./EditorControls";
import { useFlowMapStore } from "@/stores/FlowMapStore";
import "./styles.css";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/navigation";

interface EditorProps {
  title: string;
  content?: Content;
}

export default function Editor({ title, content }: EditorProps) {
  const { toast } = useToast();
  const { currentNode, updateNodeMapData } = useFlowMapStore(
    useShallow((state) => ({
      currentNode: state.currentNode,
      updateNodeMapData: state.updateNodeMapData,
    }))
  );
  const editor = useEditor({
    extensions: [
      Link.configure({
        protocols: ["mailto"],
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert min-w-full prose-sm hover:prose-a:cursor-pointer h-72 md:h-80 lg:h-96 overflow-auto p-1",
      },
    },
    content: content,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
      <EditorControls editor={editor} />
      <Button
        className="flex items-center gap-x-2"
        onClick={() => {
          updateNodeMapData(currentNode?.id!, {
            title: title,
            description: editor.getHTML(),
            type: "normal",
          });
        }}
      >
        <Save className="w-4 h-4" /> Save
      </Button>
    </>
  );
}
