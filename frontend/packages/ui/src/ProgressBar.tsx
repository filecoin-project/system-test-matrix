import { sortBy } from 'lodash'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'

import { Colors } from './styles/colors'

const ColorChart = {
  api: '#CFA0E6',
  unit: '#FFB347',
  benchmark: '#80CEE1',
  e2e: '#FDB9C8',
  integration: '#7D7BD3',
  pass: '#77DF79',
  fail: '#FF837F',
  untested: '#FFABA8',
  missing: '#B2BAC7',
  unknown: '#D0D7DE',
  tested: '#00ADD8',
}

interface Props {
  data: {
    name: string
    percentage: number
    numberOfTests: number
  }[]
  onClick?: () => void
  legend?: boolean
}

const HEIGHT = 14

export const ProgressBar = ({
  legend = false,
  onClick = () => null,
  ...props
}: Props) => {
  const prepData = props.data.map(({ name, ...rest }) => ({
    name: name ? name : 'unknown',
    ...rest,
  }))
  const dataWithTotal = sortBy(prepData, 'name').reduce(
    (acc, value, index) => {
      acc[value.name] = value.percentage

      acc.total += value.percentage
      if (index === prepData.length - 1 && acc.total < 100) {
        acc[value.name] += 100 - acc.total
      }
      if (index === prepData.length - 1 && acc.total > 100) {
        acc[value.name] += 100 - acc.total
      }
      return acc
    },
    { total: 0 },
  )
  const { total, ...data } = dataWithTotal

  const getBarShape = (x, y, width, radius) => {
    const height = HEIGHT
    const [tl, tr, bl, br] = radius
    const d = `M${x},${-2}
		a${tl},${tl} 0 0 1 ${tl},${-tl}
		h${width - tl - tr}
		a${tr},${tr} 0 0 0 ${tr},${tr}
		v${height - tr - br + 2}
		a${br},${br} 0 0 1 ${-br},${br}
		h${bl + (br - width)}
		a${bl},${bl} 0 0 1 ${-bl},${-bl}
		z`
    return ({ fill, fillOpacity, stroke = null }) => (
      <path d={d} fill={fill} fillOpacity={fillOpacity} stroke={stroke} />
    )
  }

  const renderBars = () => {
    return Object.keys(data).map((bar, i) => (
      <Bar
        isAnimationActive={false}
        onClick={onClick}
        key={bar}
        fill={
          ColorChart[bar] ||
          Colors.progressBarColors[i % Colors.progressBarColors.length]
        }
        dataKey={bar}
        stackId={'stackId'}
        shape={({ x, y, width, ...props }) => {
          const Bar = getBarShape(x, y, width, [0, 0, 0, 0])
          return (
            <g>
              <Bar fillOpacity={1} fill={props.fill} />
            </g>
          )
        }}
      />
    ))
  }

  const renderLegend = () => {
    return sortBy(prepData, 'name').map(stats => {
      return (
        <LegendPiece key={stats.name}>
          <LegendCircle color={ColorChart[stats.name || 'unknown']} />
          {stats.name}:{' '}
          <LegendValue>
            {parseFloat(stats.percentage.toFixed(2))}% ({stats.numberOfTests})
          </LegendValue>
        </LegendPiece>
      )
    })
  }

  if (!data || !props.data.length) {
    return null
  }

  return (
    <Wrapper data-tip={legend ? null : JSON.stringify(props)}>
      <ReactTooltip
        effect={'solid'}
        getContent={tooltip => {
          const content = JSON.parse(tooltip) || {}

          return (
            <>
              {sortBy(
                content?.data?.map(({ name, ...rest }) => ({
                  name: name ? name : 'unknown',
                  ...rest,
                })),
                'name',
              ).map(value => {
                return (
                  <div key={value?.name}>
                    <b>{value?.name}</b>:{' '}
                    <span>
                      {Number(value?.percentage).toFixed(2)}% (
                      {value?.numberOfTests})
                    </span>
                  </div>
                )
              })}
            </>
          )
        }}
      />
      <ResponsiveContainer width="100%" height={HEIGHT}>
        <BarChart
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          layout="vertical"
          data={[data]}
        >
          <XAxis hide type="number" interval={'preserveStartEnd'} />
          <YAxis hide type={'category'} />
          {renderBars()}
        </BarChart>
      </ResponsiveContainer>
      {legend && <Legend>{renderLegend()}</Legend>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  svg {
    border-radius: ${HEIGHT / 2}px;
  }
`

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding: 0;
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
