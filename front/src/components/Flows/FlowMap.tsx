"use client";
import { DragEventHandler, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactFlow, {
  Node,
  Controls,
  Background,
  NodeTypes,
  useReactFlow,
  Panel,
  ReactFlowProvider,
  Edge,
} from "reactflow";
import TicketNode, { DataTicketNode } from "@/components/Nodes/TicketNode";
import FlowControls from "./Controls/FlowControls";
import TicketEditorSheet from "../Tickets/TicketSheetEditor";
import { useShallow } from "zustand/react/shallow";
import { useFlowMapStore } from "@/stores/FlowMapStore";
import { toast } from "../ui/use-toast";
import "reactflow/dist/style.css";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes: NodeTypes = { ticket: TicketNode };
const getId = () => uuidv4();

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useFlowMapStore(
      useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        addNode: state.addNode,
      }))
    );
  const [saveStatus, setStatusSaved] = useState<
    "initial" | "loading" | "success" | "error"
  >("initial");
  const { screenToFlowPosition, setViewport } = useReactFlow();

  const startTransform = useCallback(
    (x: number, y: number) => {
      setViewport({ x: x, y: y, zoom: 1 }, { duration: 800 });
    },
    [setViewport]
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (event.dataTransfer) {
        const type = event.dataTransfer.getData("application/reactflow");
        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }
        const id = getId();
        const newNode: Node<DataTicketNode> = {
          id,
          type: "ticket",
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {
            title: "New node",
            type: "normal",
            description: "",
          },
        };
        addNode(newNode);
      }
    },
    [screenToFlowPosition]
  );

  return (
    <ReactFlow
      className="border-2"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      deleteKeyCode={null}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
      nodeOrigin={[0.5, 0]}
    >
      <Background size={2} />
      <Controls />
      <Panel position="top-right">
        <FlowControls startTransform={startTransform} />
      </Panel>
      <Panel position="top-left">Roadmap Title</Panel>
    </ReactFlow>
  );
}

interface FlowMapProps {}

export default function FlowMap({}: FlowMapProps) {
  return (
    <>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
      <TicketEditorSheet />
    </>
  );
}
