import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { PDAInterface } from "../../interfaces/pda-hook";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import Stack from "./Stack";
import { INITIAL_STACK_SYMBOL } from "../../hooks/usePDA";
const edgeTypes = {
  smart: SmartBezierEdge,
};

const Canvas = ({
  pda,
  activeEdge,
  stackState,
}: {
  pda: PDAInterface;
  activeEdge?: string;
  stackState?: string[];
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modal, setModal] = useState({
    to: null,
    from: null,
    show: false,
    input: "",
    topOfStack: "",
    stackOperation: "",
  });

  useEffect(() => {
    const nodes_ = pda.states.map((s, idx) => ({
      id: s,
      data: {
        label: s,
      },
      position: {
        x: nodes.find((n) => n.id === s)?.position?.x || idx * 100,
        y: nodes.find((n) => n.id === s)?.position?.y || Math.random() * 100,
      },
      style: {
        background: s === pda.initialState ? "#FF0072" : "hsl(var(--ac))",
        color: s === pda.initialState ? "#fff" : "#000",
        border: pda.finalStates.includes(s)
          ? "4px solid #00FF7F"
          : "4px solid transparent",
        borderRadius: "100%",
        width: 50,
        height: 50,
        // add a shadow to the node if it is the active node
        boxShadow: activeEdge?.includes(">" + s) ? "0 0 10px 5px #00FF7F" : "none",
        transition: "box-shadow 0.2s ease",

      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
    const edges_ = [];

    for (const state in pda.transitions) {
      for (const input in pda.transitions[state]) {
        for (const stackSymbol in pda.transitions[state][input]) {
          const { next: nextState, stack: stackOperation } =
            pda.transitions[state][input][stackSymbol];

          edges_.push({
            id: state + input + nextState,
            source: state,
            target: nextState,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#FF0072",
            },
            type: "smart",
            data: { text: input },
            // animated: activeEdge === currentEdge,

            style: {
              strokeWidth: 2,
              stroke: "#FF0072",
            },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: {
              fill: "#FFCC00",
              color: "#fff",
              fillOpacity: 0.7,
            },

            label: `δ(${state}, ${input}, ${stackSymbol} ) = { ( ${nextState}, ${
              stackOperation || "POP"
            } ) }`,
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
      const currentEdge = `${edge.source}>${edge.target}`;
      if (activeEdge === currentEdge) {
        edge.animated = activeEdge === currentEdge;
        edge.style.stroke = "#00FF7F";
        edge.markerEnd.color = "#00FF7F";
      }
      if (existingEdge) {
        if (existingEdge.label.length <= 30)
          existingEdge.label += `; ${edge.label}`;
        else if (
          existingEdge.label.length > 30 &&
          !existingEdge.label.includes("...")
        )
          existingEdge.label += `...`;
      } else {
        mergedEdges.push(edge);
      }
    }

    setNodes(nodes_);
    setEdges(mergedEdges);
  }, [pda]);

  const onConnect = useCallback((params) => {
    setModal({
      to: params.target,
      from: params.source,
      show: true,
      input: "",
      stackOperation: "",
      topOfStack: "",
    });
  }, []);

  const addTransitionHandler = () => {
    if (modal.input === "") {
      setModal({
        to: null,
        from: null,
        show: false,
        input: "",
        stackOperation: "",
        topOfStack: "",
      });
      return;
    }
    const uniqueInputs = new Set<string>();
    modal.input.split(",").forEach((inp) => uniqueInputs.add(inp));

    for (const inp of Array.from(uniqueInputs)) {
      pda.addTransition(
        modal.from,
        modal.to,
        inp,
        modal.topOfStack,
        modal.stackOperation
      );
    }

    setModal({
      to: null,
      from: null,
      show: false,
      input: "",
      stackOperation: "",
      topOfStack: "",
    });
  };

  return (
    <div className="h-full flex flex-col relative">
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        connectOnClick={false}
        onConnect={onConnect}
      >
        <Background />
       
      </ReactFlow>
      <div className="h-full mt-auto bottom-0  rounded z-10 flex flex-col justify-end items-center px-8 py-2 absolute  border-r-2 border-base-300">
          <Stack className="absolute z-20 bottom-12 " stack={stackState} />
          <h3 className="text-lg text-base-content tracking-wider">STACK</h3>
        </div>
      {modal.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-md mb-2">Enter input</h3>
            <input
              type="text"
              className="input input-bordered"
              placeholder="a,b,c"
              value={modal.input}
              minLength={1}
              onChange={(e) => setModal({ ...modal, input: e.target.value })}
            />
            <p className="py-4 text-sm text-gray-500">
              Enter input separated by commas, for the transition from{" "}
              <span className="font-bold">{modal.from}</span> to{" "}
              <span className="font-bold">{modal.to}</span>
            </p>
            <div className="flex flex-row justify-between gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Top Of Stack:</span>
                </label>
                <input
                  type="text"
                  placeholder={`Use ${INITIAL_STACK_SYMBOL} for initial stack symbol`}
                  className="input input-bordered w-full "
                  value={modal.topOfStack}
                  onChange={(e) =>
                    setModal({ ...modal, topOfStack: e.target.value })
                  }
                />
              </div>
              <div className="form-control w-full ">
                <label className="label">
                  <span className="label-text">Push:</span>
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for epsilon"
                  className="input input-bordered w-full max-w-xs"
                  value={modal.stackOperation}
                  onChange={(e) =>
                    setModal({ ...modal, stackOperation: e.target.value })
                  }
                />
              </div>
            </div>
            {/* <div className="divider "></div> */}
            <p className="text-xs text-gray-500 mt-2">
              {/* <h4 className="font-bold">Working of PDA</h4>
              <ul className="list-disc list-inside">
                <li>
                  To push a value, enter the new value followed by the current
                  value on the stack.
                </li>
                <li>To pop a value, leave empty (epsilon)</li>
                <li>For no change, just enter the current stack value</li>
              </ul> */}
              <h4 className="font-bold my-2">Usage:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <span className="kbd">
                    {`δ(${"q0"}, ${"a"}, ${INITIAL_STACK_SYMBOL} ) = { ( ${"q0"}, a${INITIAL_STACK_SYMBOL} ) }`}{" "}
                  </span>{" "}
                  is done by entering
                  <span className="kbd"> a{INITIAL_STACK_SYMBOL} </span> in the{" "}
                  <span className="font-bold">Push</span> field
                </li>
                <li>
                  <span className="kbd">
                    {`δ(${"q0"}, ${"b"}, ${"a"} ) = { ( ${"q1"}, ${"a"} ) }`}{" "}
                  </span>{" "}
                  is done by entering
                  <span className="kbd"> a </span> in the{" "}
                  <span className="font-bold">Push</span> field
                </li>
                <li>
                  <span className="kbd">
                    {`δ(${"q0"}, ${"b"}, ${"a"} ) = { ( ${"q1"}, ${"∈"} ) }`}{" "}
                  </span>{" "}
                  is done by leaving the
                  <span className="font-bold">Push</span> field{" "}
                  <span className="kbd">empty</span>
                </li>
              </ul>
            </p>

            <div className="modal-action">
              <button
                disabled={modal.input.length === 0}
                onClick={addTransitionHandler}
                className="btn btn-active"
              >
                Add
              </button>
              <button
                onClick={() =>
                  setModal({
                    to: null,
                    from: null,
                    show: false,
                    input: "",
                    stackOperation: "",
                    topOfStack: "",
                  })
                }
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
         
        </div>
      )}
    </div>
  );
};

export default Canvas;
