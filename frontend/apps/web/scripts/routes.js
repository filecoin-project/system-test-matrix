/* eslint no-console: 0 */
/* eslint @typescript-eslint/no-var-requires: 0 */
const glob = require('glob')
const { writeFile } = require('fs')

function createRoute(filename = '') {
  let [path] = filename.split('.')
  // build path

  // replace _ with : as react-router-dom requires
  path = path.replace(/_/, ':')
  path = `/${path}` // makes regex more accurate/easier

  // replace index with /
  path = path.replace(/\/index/, '/')

  return { path, filename }
}

glob(`**/*.tsx`, { cwd: `${__dirname}/../src/pages` }, (err, files) => {
  if (err) {
    return 0
  }

  let routes = []

  files.forEach(file => {
    routes.push(createRoute(file))
  })

  // sort routes
  routes = routes
    .sort((a, b) => {
      if (a.path < b.path) {
        return -1
      } else if (a.path > b.path) {
        return 1
      } else {
        return 0
      }
    })
    .reverse()

  writeFile(
    `${__dirname}/../src/routes.json`,
    JSON.stringify(routes),
    'utf-8',
    () => {
      console.log('Wrote routes in src/routes.json')
    },
  )
})
