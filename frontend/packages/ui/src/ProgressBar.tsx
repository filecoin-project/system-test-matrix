import React from 'react'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Colors } from './styles/colors'
import styled from 'styled-components'

interface Props {
  data: { 
    name?: string;
    size?: number; 
    color?: string;
    percentage?: number;
    kind?: string;
    status?: string; }[]
  onClick: () => void
  legend?: boolean
}

const HEIGHT = 20

export const ProgressBar = ({
    legend = false,
    ...props
  }: Props) => {

  const [barData, setBarData] = useState(null)
  const [barColors, setBarColors] = useState(null)

  const preparePercentageChartValues = (name: 'kind' | 'status') => {
    const data = {}
    const colors = {}
    props.data.map((value, i) => {
      data[value[name]] = value.percentage
      colors[value[name]] = Colors.progressBarColors[i%10]
    })
    setBarData(data)
    setBarColors(colors)
  }

  const prepareNonPercentageChartValues = () => {
    const data = {}
    const colors = {}
    props.data.map(value => {
      data[value.name] = value.size
      colors[value.name] = value.color
    })
    setBarData(data)
    setBarColors(colors)
  }

  const prepareBarChartValues = () => 
    props.data[0].percentage
    ? preparePercentageChartValues(props.data[0].kind ? 'kind' : 'status')
    : prepareNonPercentageChartValues()

  useEffect(prepareBarChartValues, [props.data])

  
  const renderBars = () => {
    const isLastBar = Object.keys(barColors).length -1
    return Object.keys(barColors).map((bar, i) =>
      <Bar 
        isAnimationActive={false}
        onClick={props.onClick}
        key={bar}
        fill={barColors[bar]}
        dataKey={bar}
        stackId={'a'}
        radius={i === 0 && [20, 0, 0, 20] || i === isLastBar && [0, 20, 20, 0] || 0}
      />
    )
  }

  const renderLegend = () => {
    console.log(barColors)
    return Object.keys(barData).map(bar => {
      return (
        <LegendPiece>
          <LegendCircle color={barColors[bar]}/>
          { bar }: <LegendValue>{parseFloat(barData[bar].toFixed(2))}%</LegendValue>
        </LegendPiece>
      )
    })
  }

  const renderBarChart = () => {
    if (!barData) return null
    return (
      <>
        <ResponsiveContainer width="100%" height={HEIGHT}>
          <BarChart 
            layout="vertical"
            height={HEIGHT}
            data={[barData]}>
            <XAxis hide type="number"/>
            <YAxis hide dataKey="name" type="category"/>
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              position={{ y: 30, x: 0 }}
              cursor={false}
              wrapperStyle={{ zIndex: 50, width: '100%' }}
              contentStyle={{ backgroundColor: Colors.logoBackground }}
              itemStyle={{ color: 'white', fontSize: 12 }}
            />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
        { legend && <Legend>{ renderLegend() }</Legend> }
      </>
    )
  }

  return renderBarChart()
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
  background-color: ${({color}) => color};
  border-radius: 50%;
`

const LegendValue = styled.span`
  margin-left: 0.25rem;
  color: ${Colors.logoBackground}
`
