import moment from 'moment'

export const filterItems = (items, filter, filterBy) => {
  if (filter.trim().length === 0) {
    return items
  }
  return items.filter(
    filterItem =>
      filterItem[filterBy].toLowerCase().search(filter.toLowerCase()) !== -1,
  )
}

/**
 * Formatting date. Detects if date is UTC string
 */
export const formatDate = (date: number | string, format = 'LLL'): string => {
  if (typeof date === 'string') {
    return moment(date).format(format)
  }
  return moment(date * 1000).format(format)
}
