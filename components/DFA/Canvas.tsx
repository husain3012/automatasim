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
import CustomEdge from "../CustomEdge";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
const edgeTypes = {
  custom: CustomEdge,
  smart: SmartBezierEdge,
};

const Canvas = ({
  dfa,
  activeEdge,
}: {
  dfa: DFAInterface;
  activeEdge?: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  useEffect(() => {
    const nodes_ = dfa.states.map((s, idx) => ({
      id: s,
      data: {
        label: s,
      },
      position: {
        x: nodes.find((n) => n.id === s)?.position?.x || idx * 100,
        y: nodes.find((n) => n.id === s)?.position?.y || Math.random() * 100,
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
            type: "smart",
            data: { text: input },
            animated: activeEdge === key + input + nextState,

            style: {
              strokeWidth: 2,
              stroke: ( activeEdge === key + input + nextState)?"#00FF7F":"#FF0072",
            },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: {
              fill: "#FFCC00",
              color: "#fff",
              fillOpacity: 0.7,
            },
            label: input,
          });
        }
      }
    }
    // merge the edges with same source and target and add the labels for multiple inputs
    const mergedEdges = [];
    for (const edge of edges_) {
      const existingEdge = mergedEdges.find(
        (e) => e.source === edge.source && e.target === edge.target
      );
      if (existingEdge) {
        existingEdge.label += `, ${edge.data.text}`;
      } else {
        mergedEdges.push(edge);
      }
    }

    setNodes(nodes_);
    setEdges(mergedEdges);
  }, [dfa]);

  return (
    <>
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        connectOnClick={false}
      >
        <Background />
      </ReactFlow>
    </>
  );
};

export default Canvas;
