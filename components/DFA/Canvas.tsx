import React, { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
  addEdge
} from 'reactflow'
import 'reactflow/dist/style.css'
import { DFAInterface } from '../../interfaces/dfa'
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'
const edgeTypes = {
  smart: SmartBezierEdge
}

const Canvas = ({
  dfa,
  activeEdge
}: {
  dfa: DFAInterface
  activeEdge?: string
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [modal, setModal] = useState({
    to: null,
    from: null,
    show: false,
    input: ''
  })

  useEffect(() => {
    const nodes_ = dfa.states.map((s, idx) => ({
      id: s,
      data: {
        label: s
      },
      position: {
        x: nodes.find((n) => n.id === s)?.position?.x || idx * 100,
        y: nodes.find((n) => n.id === s)?.position?.y || Math.random() * 100
      },
      style: {
        background: s === dfa.initialState ? '#FF0072' : 'hsl(var(--ac))',
        color: s === dfa.initialState ? '#fff' : '#000',
        border: dfa.finalStates.includes(s)
          ? '4px solid #00FF7F'
          : '4px solid transparent',
        borderRadius: '100%',
        width: 50,
        height: 50,
        // add a shadow to the node if it is the active node
        boxShadow: activeEdge?.includes('>' + s) ? '0 0 15px #00FF7F' : 'none'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    }))
    const edges_ = []

    for (const key in dfa.transitions) {
      for (const input in dfa.transitions[key]) {
        const nextState = dfa.transitions[key][input]
        if (nextState) {
          const currentEdge = key + '@' + input + '>' + nextState
          edges_.push({
            id: key + input + nextState,
            source: key,
            target: nextState,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#FF0072'
            },
            type: 'smart',
            data: { text: input },
            animated: activeEdge === currentEdge,

            style: {
              strokeWidth: 2,
              stroke: activeEdge === currentEdge ? '#00FF7F' : '#FF0072'
            },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: {
              fill: activeEdge === currentEdge ? '#00FF7F' : '#FFCC00',
              color: '#fff',
              fillOpacity: 0.7
            },
            label: input
          })
        }
      }
    }
    // merge the edges with same source and target and add the labels for multiple inputs
    const mergedEdges = []
    for (const edge of edges_) {
      const existingEdge = mergedEdges.find(
        (e) => e.source === edge.source && e.target === edge.target
      )
      if (existingEdge) {
        existingEdge.label += `, ${edge.data.text}`
      } else {
        mergedEdges.push(edge)
      }
    }

    setNodes(nodes_)
    setEdges(mergedEdges)
  }, [dfa])

  const onConnect = useCallback((params) => {
    setModal({
      to: params.target,
      from: params.source,
      show: true,
      input: ''
    })
  }, [])

  const addTransitionHandler = () => {
    if (modal.input === '') {
      setModal({
        to: null,
        from: null,
        show: false,
        input: ''
      })
      return
    }
    console.log(modal.input.split(','))
    const uniqueInputs = new Set<string>()
    modal.input.split(',').forEach((inp) => uniqueInputs.add(inp))

    console.log(uniqueInputs)
    for (const inp of Array.from(uniqueInputs)) {
      dfa.addTransition(modal.from, modal.to, inp)
    }

    setModal({
      to: null,
      from: null,
      show: false,
      input: ''
    })
  }

  return (
    <React.Fragment>
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
      {modal.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Enter input</h3>
            <p className="py-4">
              <input
                type="text"
                className="input input-bordered"
                placeholder="a,b,c"
                value={modal.input}
                minLength={1}
                onChange={(e) => setModal({ ...modal, input: e.target.value })}
              />
              <br />
              <br />
              Enter input separated by commas, for the transition from{' '}
              <span className="font-bold">{modal.from}</span> to{' '}
              <span className="font-bold">{modal.to}</span>
            </p>
            <div className="flex justify-end gap-2">
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
                    input: ''
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
    </React.Fragment>
  )
}

export default Canvas
