import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { DFAInterface } from "../../interfaces";

const Canvas = ({ dfa }: { dfa: DFAInterface }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const nodes_ = dfa.states.map((s, idx) => ({
      id: s,
      data: {
        label: s,
      },
      position: {
        x: idx * 100,
        y: Math.floor(Math.random() * 100),
      },
      style: {
        background: s === dfa.initialState ? "#FF0072" : "hsl(var(--ac))",
        color: s === dfa.initialState ? "#fff" : "#000",
        border: dfa.finalStates.includes(s)
          ? "4px solid #00FF7F"
          : "4px solid transparent",
        borderRadius: "100%",
        width: 50,
        height: 50,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
    const edges_ = [];

    for (const key in dfa.transitions) {
      for (const input in dfa.transitions[key]) {
        const nextState = dfa.transitions[key][input];
        if (nextState) {
          edges_.push({
            id: key + input + nextState,
            source: key,
            target: nextState,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#FF0072",
            },

            style: {
              strokeWidth: 2,
              stroke: "#FF0072",
            },
            label: input,
          });
        }
      }
    }
    setNodes(nodes_);
    setEdges(edges_);
  }, [dfa]);

  return (
    <>
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Canvas;
