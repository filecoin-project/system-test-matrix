import React from 'react'
import { Treemap as Chart } from 'recharts'
import { Test, TestStatus } from '@filecoin/types'

interface Props {
  data: { functionName: string; status: string }[]
  onClick: () => void
}

const getStatusColor = (status?: Test['status']) => {
  switch (status) {
    case TestStatus.pass:
      return '#77DF79'
    case TestStatus.fail:
      return '#FF837F'
    case TestStatus.missing:
      return '#B2BAC7'
    default:
      return '#F5F5F5'
  }
}

export const MatrixMap = (props: Props) => {
  const data = props.data.length
    ? props.data.map(node => ({
        ...node,
        value: 1,
        color: getStatusColor(node.status as TestStatus),
      }))
    : [
        {
          value: 1,
          functionName: 'missing',
          status: 'null',
          color: getStatusColor('null' as TestStatus),
        },
      ]
  const NUMBER_OF_ROWS = Math.ceil(160 / Math.sqrt((160 * 160) / data.length))
  const NUMBER_OF_COLUMNS = NUMBER_OF_ROWS
  const NODES_LIMIT = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS
  const NODE_SIZE = 160 / NUMBER_OF_ROWS

  const countMissingNodes = Math.max(NODES_LIMIT - data.length, 0)
  const missingData = Array(countMissingNodes).fill({
    value: 1,
    functionName: 'missing',
    status: 'null',
    color: getStatusColor('null' as TestStatus),
  })

  const CustomizedContent = (props: any) => {
    const { color, index, functionName, path, repository } = props
    const rowNumber = Math.floor(Math.max(index / NUMBER_OF_ROWS, 0))
    const columnIndex = index % NUMBER_OF_COLUMNS

    if (!functionName) {
      return null
    }

    return (
      <g>
        <rect
          data-tip={JSON.stringify({ functionName, path, repository })}
          x={NODE_SIZE * columnIndex}
          y={NODE_SIZE * rowNumber}
          width={NODE_SIZE}
          height={NODE_SIZE}
          style={{
            cursor: 'pointer',
            pointerEvents: functionName === 'missing' ? 'none' : null,
            fill: color,
            stroke: '#fff',
            strokeWidth: NODE_SIZE * 0.0625,
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
    <>
      <Chart
        width={NODE_SIZE * NUMBER_OF_COLUMNS}
        height={NODE_SIZE * NUMBER_OF_ROWS}
        {...props}
        data={[...data, ...missingData]}
        nameKey="functionName"
        isAnimationActive={false}
        content={<CustomizedContent />}
      />
    </>
  )
}
