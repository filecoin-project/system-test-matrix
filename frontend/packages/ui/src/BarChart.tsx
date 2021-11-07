//THIS IS NOT WORKABLE YET [WIP]
import React from 'react'
import {
  BarChart as Chart,
  ResponsiveContainer,
  XAxis,
  Bar,
  Label,
  YAxis,
  LabelList,
  Tooltip,
} from 'recharts'
interface Props {
  data: [{ name: string; value: number }]
}

const renderCustomizedLabel = props => {
  const { content, ...rest } = props

  return <Label {...rest} fontSize="12" fill="#FFFFFF" fontWeight="Bold" />
}

export const BarChart = data => {
  return (
    <ResponsiveContainer width={'100%'}>
      <Chart
        layout="vertical"
        data={data}
        margin={{ left: 50, right: 50 }}
        stackOffset="expand"
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="description" />
        <Tooltip />
        <Bar dataKey="value">
          <LabelList
            dataKey="value"
            position="center"
            content={renderCustomizedLabel}
          />
        </Bar>
      </Chart>
    </ResponsiveContainer>
  )
}
