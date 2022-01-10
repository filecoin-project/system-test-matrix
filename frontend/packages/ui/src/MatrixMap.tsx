import React from 'react'
import { Treemap as Chart } from 'recharts'
import { Behavior, BehaviorStatus } from '@filecoin/types'

interface BehaviorData extends Partial<Behavior> {
  value?: number
  color?: string
  statusForKind?: BehaviorStatus
}

interface Props {
  data: BehaviorData[]
  onClick: (behavior: Partial<Behavior>) => void
}

const getStatusColor = (status?: Behavior['status']) => {
  switch (status) {
    case BehaviorStatus.pass:
      return '#77DF79'
    case BehaviorStatus.fail:
      return '#FF837F'
    case BehaviorStatus.untested:
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
        color: getStatusColor(node.statusForKind),
      }))
    : [
        {
          value: 1,
          status: 'null' as BehaviorStatus,
          color: getStatusColor('null' as BehaviorStatus),
        },
      ]

  const NUMBER_OF_ROWS = Math.ceil(160 / Math.sqrt((160 * 160) / data.length))
  const NUMBER_OF_COLUMNS = NUMBER_OF_ROWS
  const NODES_LIMIT = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS
  const NODE_SIZE = 160 / NUMBER_OF_ROWS

  const countMissingNodes = Math.max(NODES_LIMIT - data.length, 0)
  const missingData = Array(countMissingNodes).fill({
    value: 1,
    status: 'null',
    color: getStatusColor('null' as BehaviorStatus),
  })

  const CustomizedContent = (props: any) => {
    const {
      color,
      index,
      id,
      status,
      feature,
      description,
      subsystem,
      tested,
      tests,
    } = props
    const rowNumber = Math.floor(Math.max(index / NUMBER_OF_ROWS, 0))
    const columnIndex = index % NUMBER_OF_COLUMNS

    return (
      <g>
        <rect
          data-tip={JSON.stringify({
            id,
            feature,
            description,
            tested,
            subsystem,
            tests,
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
              feature,
              description,
              tested,
              tests,
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
