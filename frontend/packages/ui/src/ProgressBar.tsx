import React from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styled from 'styled-components'
import { Colors } from './styles/colors'

interface Props {
  data: {
    name: string
    percentage: number
  }[]
  onClick: () => void
  legend?: boolean
}

const HEIGHT = 24

export const ProgressBar = ({ legend = false, ...props }: Props) => {
  const data = props.data.reduce((acc, value) => {
    acc[value.name] = value.percentage
    return acc
  }, {})

  const renderBars = () => {
    const isLastBar = Object.keys(data).length - 1
    return Object.keys(data).map((bar, i) => (
      <Bar
        isAnimationActive={false}
        onClick={props.onClick}
        key={bar}
        fill={Colors.progressBarColors[i % 10]}
        dataKey={bar}
        stackId={'a'}
        radius={
          (i === 0 && [20, 0, 0, 20]) ||
          (i === isLastBar && [0, 20, 20, 0]) ||
          0
        }
      />
    ))
  }

  const renderLegend = () => {
    return Object.keys(data).map((bar, i) => {
      return (
        <LegendPiece key={i}>
          <LegendCircle color={Colors.progressBarColors[i % 10]} />
          {bar}: <LegendValue>{parseFloat(data[bar].toFixed(2))}%</LegendValue>
        </LegendPiece>
      )
    })
  }

  if (!data) {
    return null
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={HEIGHT}>
        <BarChart layout="vertical" height={HEIGHT} data={[data]}>
          <XAxis hide type="number" />
          <YAxis hide dataKey="name" type="category" />
          {!legend && (
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              position={{ y: 30, x: 0 }}
              cursor={false}
              wrapperStyle={{ zIndex: 50, width: '100%' }}
              contentStyle={{ backgroundColor: Colors.logoBackground }}
              itemStyle={{ color: 'white', fontSize: 12 }}
            />
          )}
          {renderBars()}
        </BarChart>
      </ResponsiveContainer>
      {legend && <Legend>{renderLegend()}</Legend>}
    </>
  )
}

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding: 0 1rem;
`

const LegendPiece = styled.li`
  display: flex;
  align-items: center;
  flex-basis: calc(33% - 0.7rem);
  margin-right: 0.7rem;
  margin-bottom: 0.7rem;
  font-size: 0.75rem;
  color: ${Colors.textColor};
`

const LegendCircle = styled.span<{ color: string }>`
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`

const LegendValue = styled.span`
  margin-left: 0.25rem;
  color: ${Colors.logoBackground};
`
