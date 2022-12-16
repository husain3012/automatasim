import React from 'react'
import { getBezierPath, Position } from 'reactflow'

export default function CustomEdge ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd
}: {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition?: Position
  targetPosition?: Position
  style?: React.CSSProperties
  data?: { text: string}
  markerEnd?: string
}): React.ReactNode {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  return (
    <React.Fragment>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '18px' }}
          startOffset="30%"
          textAnchor="middle"

        >
          {data.text}
        </textPath>
      </text>
    </React.Fragment>
  )
}
