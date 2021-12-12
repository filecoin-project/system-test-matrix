import React from 'react'
import { Treemap as Chart } from 'recharts'
import { Test, TestStatus } from '@filecoin/types'

interface TestData extends Partial<Test> {
  value?: number
  color?: string
}

interface Props {
  data: TestData[]
  onClick: (test: Partial<Test>) => void
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

export const MatrixMap: React.FC<Props> = ({ data, onClick }) => {
  data = data.length
    ? data.map(node => ({
        ...node,
        value: 1,
        color: getStatusColor(node.status),
      }))
    : [
        {
          value: 1,
          functionName: 'missing',
          status: 'null' as TestStatus,
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
    const {
      color,
      index,
      id,
      functionName,
      path,
      repository,
      linkedBehaviors,
      status,
    } = props
    const rowNumber = Math.floor(Math.max(index / NUMBER_OF_ROWS, 0))
    const columnIndex = index % NUMBER_OF_COLUMNS

    if (!functionName) {
      return null
    }

    return (
      <g>
        <rect
          data-tip={JSON.stringify({
            functionName,
            path,
            repository,
            linkedBehaviors,
          })}
          x={NODE_SIZE * columnIndex}
          y={NODE_SIZE * rowNumber}
          width={NODE_SIZE}
          height={NODE_SIZE}
          style={{
            cursor: 'pointer',
            fill: color,
            stroke: '#fff',
            strokeWidth: NODE_SIZE * 0.0625,
            strokeOpacity: 1,
            pointerEvents: status === 'null' ? 'none' : null,
          }}
          onClick={() =>
            onClick({
              id,
              functionName,
              path,
              repository,
              linkedBehaviors,
            })
          }
        />
      </g>
    )
  }

  return (
    <>
      <Chart
        width={NODE_SIZE * NUMBER_OF_COLUMNS}
        height={NODE_SIZE * NUMBER_OF_ROWS}
        data={[...data, ...missingData]}
        nameKey="functionName"
        isAnimationActive={false}
        content={<CustomizedContent />}
      />
    </>
  )
}
