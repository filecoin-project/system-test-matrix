import Fuse from 'fuse.js'
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

//TODO @Vojo i should make types for arguments here
export const searchWithFuse = (array, option, query) => {
  const fuse = new Fuse(array, option)
  const searchResult = fuse.search(query)

  return searchResult.map(result => {
    return result.item
  })
}
export const getResultsWithFuseSearch = (
  array,
  options1,
  options2,
  searchTerm,
  selectedFilter,
) => {
  if (selectedFilter) {
    const filterResult: any = searchWithFuse(array, options2, selectedFilter)
    if (searchTerm) {
      return searchWithFuse(filterResult, options1, searchTerm)
    } else {
      return filterResult
    }
  }
  if (searchTerm) {
    return searchWithFuse(array, options1, searchTerm)
  } else {
    return array
  }
}
