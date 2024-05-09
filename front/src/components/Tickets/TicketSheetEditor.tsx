"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChangeEvent, useEffect, useState } from "react";
import Editor from "@/components/Editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "../ui/use-toast";
import { useEditorSheetStore } from "@/stores/SheetEditorStore";
import { Input } from "../ui/input";
import { useShallow } from "zustand/react/shallow";
import { useFlowMapStore } from "@/stores/FlowMapStore";

interface TicketSheetEditorProps {}

export default function TicketEditorSheet({}: TicketSheetEditorProps) {
  const { open, setOpen } = useEditorSheetStore();
  const { currentNode, setCurrentNode } = useFlowMapStore(
    useShallow((state) => ({
      currentNode: state.currentNode,
      setCurrentNode: state.setCurrentNode,
    }))
  );
  const [title, setTitle] = useState(currentNode?.data.title || "New Node");

  useEffect(() => {
    if (!open) {
      setCurrentNode(null);
    }
  }, [open]);

  useEffect(() => {
    setTitle(currentNode?.data.title || "New Node");
  }, [currentNode]);

  const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-1/2 sm:max-w-none" side="right">
        {currentNode ? (
          <>
            <SheetHeader className="pt-6">
              <SheetTitle className="my-2">
                <Input
                  onChange={changeTitleHandler}
                  value={title}
                  className="text-2xl"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4 w-full">
              <Editor
                content={currentNode.data.description || ""}
                title={title}
              />
            </div>
          </>
        ) : (
          <div className="pr-6 pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-72 md:h-80 lg:h-96 w-full" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
