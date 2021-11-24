import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Loader } from './Loader'
import { Paginator } from './Paginator'
import { Colors } from './styles/colors'

interface ColumnData {
  header: string
  Cell: (data: any) => React.ReactNode
  width?: number
}
const TableVariant = ['default', 'light', 'subtle'] as const

type TableVariant = typeof TableVariant[number]

interface TableProps {
  variant: TableVariant
  data: any[]
  columns: Record<string, ColumnData>
  action?: Function
  currentPage?: number
  pageLimit?: number
  onPagination?: Function
  totalRecords?: number
  header?: JSX.Element
  isLoading?: boolean
  expandable?: boolean
}

const Row = (props: any) => {
  const [isRowExpanded, setIsRowExpanded] = useState(false)
  const [expandedRowData, setExpandedRowData] = useState({})
  const onRowExpand = data => {
    setExpandedRowData({ ...data })
    if (data) {
      setIsRowExpanded(true)
    } else {
      setIsRowExpanded(false)
    }
  }
  const Row = (
    <TableRow>
      {Object.values(props.columns).map(({ Cell }: any, index) => {
        return Cell ? (
          <Column
            variant={props.variant}
            isFirst={index === 0}
            isLast={--Object.keys(props.columns).length === index}
            key={index}
          >
            <Cell
              action={props.action}
              onRowExpand={onRowExpand}
              data={props.rowData}
              index={props.rowIndex}
            />
          </Column>
        ) : null
      })}
    </TableRow>
  )
  if (props.expandable) {
    return (
      <>
        {Row}
        {isRowExpanded && (
          <tr>
            {Object.values(props.columns).map(
              ({ ExpandedCell }: any, index) => {
                return ExpandedCell ? (
                  <ExpandedColumn
                    colSpan={Object.values(props.columns).length}
                    key={index}
                  >
                    <ExpandedCell
                      action={props.action}
                      data={{ ...expandedRowData, ...props.rowData }}
                      index={props.rowIndex}
                    />
                  </ExpandedColumn>
                ) : null
              },
            )}
          </tr>
        )}
      </>
    )
  } else {
    return Row
  }
}

const Sizing = {
  subtle: 99,
  default: 78,
  light: 65,
}

export const TableDefault = ({
  data,
  columns,
  action,
  totalRecords,
  pageLimit,
  currentPage = 1,
  onPagination,
  header,
  expandable,
  isLoading,
  ...props
}: TableProps) => {
  const { t } = useTranslation()
  return (
    <Wrapper data-element="tableWrapper" {...props}>
      {header && (
        <table data-element="tableFilter">
          <tbody>
            <tr>
              <Column width="100%" isFirst isLast>
                {header}
              </Column>
            </tr>
          </tbody>
        </table>
      )}
      <TableWrapper data-element="table">
        <THead>
          <TableHeaderRow>
            {columns &&
              Object.values(columns).map(({ header, width }, index) => {
                return header && !isLoading ? (
                  <Column
                    width={index === 0 && isLoading ? '100%' : width}
                    isFirst={index === 0}
                    isLast={Object.keys(columns).length - 1 === index}
                    key={index}
                  >
                    <TableHeaderText>
                      {typeof header === 'object' ? header : `${t(header)}`}
                    </TableHeaderText>
                  </Column>
                ) : index === 0 && isLoading ? (
                  <Column width="100%" isFirst isLast key={index}>
                    <TableHeaderText> </TableHeaderText>
                  </Column>
                ) : null
              })}
          </TableHeaderRow>
        </THead>
        <tbody>
          {data &&
            !isLoading &&
            data.map((rowData, rowIndex) => (
              <Row
                variant={props.variant}
                key={rowIndex}
                expandable={expandable}
                columns={columns}
                rowIndex={rowIndex}
                action={action}
                rowData={rowData}
              />
            ))}
          {isLoading && (
            <tr>
              <LoadingColumn>
                <Loader />
              </LoadingColumn>
            </tr>
          )}
        </tbody>
      </TableWrapper>

      {/* Pagination */}
      <Paginator
        onPagination={onPagination}
        currentPage={currentPage}
        isFetching={isLoading}
        pageLimit={pageLimit}
        totalRecords={totalRecords}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;

  > table {
    border: 1px solid ${Colors.borderColor};
    border-radius: 5px;
    border-spacing: 0;
    width: 100%;

    tr {
      &:last-child {
        td {
          border-bottom: none;
        }
      }
    }

    > tbody tr div {
      color: ${Colors.grey};
    }

    > tbody {
      tr {
        &:first-child {
          td {
            border-top: 1px solid ${Colors.borderColor};
          }
        }
      }
    }
  }
`
const TableHeaderRow = styled.tr`
  td {
    &:first-child {
      border-top-left-radius: 5px;
    }

    &:last-child {
      border-top-right-radius: 5px;
    }
  }
`

const TableWrapper = styled.table`
  table-layout: fixed;
`

export const TruncatedText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  max-width: 100%;
`

const TableHeaderText = styled(TruncatedText)`
  color: ${Colors.tableHeaderText};
  font-weight: 600;
  vertical-align: middle;
`

export const Column = styled.td<{
  width?: number | string
  isFirst?: boolean
  isLast?: boolean
  variant?: TableVariant
}>`
  ${({ width, isFirst, isLast, variant }: any) => {
    return `
    border-bottom: 1px solid ${Colors.borderColor};
    ${variant && `height: ${Sizing[variant]}px;`}
    padding: 1rem 0;
    
      ${
        typeof width === 'number'
          ? `width: ${width}px;`
          : `width: ${width || ''};`
      }
      ${isFirst && 'padding-left: 1.4rem;'}
      ${isLast && 'padding-right: 1.4rem;'}
    `
  }}
`

const ExpandedColumn = styled.td`
  padding: 0;
`

export const LoadingColumn = styled(Column)`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  margin: auto;
`

const TableLight = styled(TableDefault)`
  table {
    border: none;

    tr {
      border: none;
    }

    ${TableHeaderText} {
      color: ${Colors.logoBackground};
    }

    ${TableHeaderRow} {
      background-color: ${Colors.white};

      td {
        border: none;
      }
    }
  }

  tbody {
    tr {
      td {
        &:first-child {
          border-left: 1px solid ${Colors.borderColor};
        }

        &:last-child {
          border-right: 1px solid ${Colors.borderColor};
        }
      }

      &:first-child {
        td {
          &:first-child {
            border-top-left-radius: 5px;
          }

          &:last-child {
            border-top-right-radius: 5px;
          }
        }
      }

      &:last-child {
        td {
          border-bottom: 1px solid ${Colors.borderColor};

          &:first-child {
            border-bottom-left-radius: 5px;
          }

          &:last-child {
            border-bottom-right-radius: 5px;
          }
        }
      }
    }
  }
`
const TableSubtle = styled(TableLight)`
  tbody {
    tr {
      td {
        &:first-child {
          border-left: none;
        }

        &:last-child {
          border-right: none;
        }
      }

      &:first-child {
        td {
          &:first-child {
            border-top-left-radius: 0;
          }

          &:last-child {
            border-top-right-radius: 0;
          }
        }
      }

      &:last-child {
        td {
          border-bottom: 1px solid ${Colors.borderColor};

          &:first-child {
            border-bottom-left-radius: 0;
          }

          &:last-child {
            border-bottom-right-radius: 0;
          }
        }
      }
    }
  }
`
const TableRow = styled.tr`
  border-bottom: 1px solid ${Colors.borderColor};
`
const THead = styled.thead`
  height: 72px;
  background-color: ${Colors.headerBackground};
`

const getActiveComponent = variant => {
  switch (variant) {
    case 'default':
      return TableDefault
    case 'light':
      return TableLight
    case 'subtle':
      return TableSubtle
    default:
      return TableDefault
  }
}

export const Table = ({
  variant,

  ...props
}: TableProps) => {
  const ActiveComponent = getActiveComponent(variant)
  return <ActiveComponent variant={variant} {...props}></ActiveComponent>
}
