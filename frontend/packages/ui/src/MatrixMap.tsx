import React from 'react'
import { Tooltip, Treemap as Chart } from 'recharts'

const NUMBER_OF_ROWS = 10
const NUMBER_OF_COLUMNS = 10
const NODES_LIMIT = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS
const NODE_SIZE = 16

interface Props {
  data: { functionName: string; status: string }[]
  onClick: () => void
}

export const MatrixMap = (props: Props) => {
  const data = props.data
    .filter((_, index) => index < NODES_LIMIT)
    .map(node => ({
      ...node,
      value: 1,
      color: node.status === 'pass' ? '#77DF79' : '#FF837F',
    }))
  const countMissingNodes = Math.max(NODES_LIMIT - data.length, 0)
  const missingData = Array(countMissingNodes).fill({
    value: 1,
    name: 'missing',
    color: '#F5F5F5',
  })

  const CustomizedContent = (props: any) => {
    const { color, index, functionName } = props
    const rowNumber = Math.floor(Math.max(index / NUMBER_OF_ROWS, 0))
    const columnIndex = index % NUMBER_OF_COLUMNS

    if (!functionName) {
      return null
    }

    return (
      <g>
        <rect
          x={NODE_SIZE * columnIndex}
          y={NODE_SIZE * rowNumber}
          width={NODE_SIZE}
          height={NODE_SIZE}
          style={{
            cursor: 'pointer',
            pointerEvents: functionName === 'missing' ? 'none' : null,
            fill: color,
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 1,
          }}
        />
      </g>
    )
  }
  // const numberOfRows = Math.floor(props.data.length / 10)
  // const isWrapped = props.data.length > 100
  // const exceededNodes = props.data.length - 100
  // const numberOfWrappedNodes = Math.floor(exceededNodes / 10)
  // const rowHeight = 15
  // console.log({ numberOfRows, isWrapped, exceededNodes, rowHeight })

  return (
    <Chart
      width={NODE_SIZE * NUMBER_OF_COLUMNS}
      height={NODE_SIZE * NUMBER_OF_ROWS}
      {...props}
      data={[...data, ...missingData]}
      nameKey="functionName"
      animationDuration={500}
      content={<CustomizedContent />}
    >
      <Tooltip allowEscapeViewBox={{ x: true, y: true }} cursor={false} />
    </Chart>
  )
}
