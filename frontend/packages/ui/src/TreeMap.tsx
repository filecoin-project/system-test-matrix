import React from 'react'
import { Tooltip, Treemap as Chart } from 'recharts'

interface Props {
  data: { name: string; value: number; color: string }[]
  onClick: () => void
}

export const TreeMap = (props: Props) => {
  const CustomizedContent = (props: any) => {
    const { x, width, color } = props

    return (
      <g>
        <rect
          x={x}
          y={0}
          width={width}
          height={30}
          style={{
            cursor: 'pointer',
            fill: color,
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 1,
          }}
        />
      </g>
    )
  }

  return (
    <Chart
      width={200}
      height={30}
      {...props}
      dataKey="size"
      nameKey="name"
      isAnimationActive={false}
      content={<CustomizedContent />}
    >
      <Tooltip
        allowEscapeViewBox={{ x: true, y: true }}
        position={{ y: 30 }}
        cursor={false}
      />
    </Chart>
  )
}
