import React from 'react'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Colors } from './styles/colors'

interface Props {
  data: { name: string; size: number; color: string }[]
  onClick: () => void
}

const HEIGHT = 20

export const ProgressBar = (props: Props) => {

  const [barData, setBarData] = useState(null)
  const [barColors, setBarColors] = useState(null)

  const prepareBarChartValues = () => {
    const data = {}
    const colors = {}
    props.data.map(value => {
      data[value.name] = value.size
      colors[value.name] = value.color
    })
    setBarData(data)
    setBarColors(colors)
  }

  useEffect(prepareBarChartValues, [])

  
  const renderBars = () => {
    const totalBars = Object.keys(barColors).length
    return Object.keys(barColors).map((b, i) =>
      <Bar 
        isAnimationActive={false}
        onClick={() => props.onClick()}
        key={i}
        fill={barColors[b]}
        dataKey={b}
        stackId={'a'}
        radius={i === 0 && [20, 0, 0, 20] || i === totalBars -1 && [0, 20, 20, 0]}
      />
    )
  }

  return (
    barData &&
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
  )
}
