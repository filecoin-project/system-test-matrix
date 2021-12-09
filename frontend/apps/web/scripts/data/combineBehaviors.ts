import fs from 'node:fs'
import path from 'node:path'

import yaml from 'yaml'

const SYSTEMS_PATH = path.resolve(__dirname, 'systems')
const OUTPUT_PATH = path.resolve(__dirname, '../../src/behaviors.json')

function combineBehaviors() {
  const systemsDirectoryContents = fs.readdirSync(SYSTEMS_PATH)
  const systemPaths = systemsDirectoryContents.map(s =>
    path.resolve(SYSTEMS_PATH, s),
  )

  const output: any = {
    systems: {},
  }

  for (const systemPath of systemPaths) {
    const subsystems = fs.readdirSync(systemPath)

    const subsystemPaths = subsystems.map(s => path.resolve(systemPath, s))

    for (const subsystemPath of subsystemPaths) {
      const yamlContents = fs.readFileSync(subsystemPath)

      try {
        const parsed = yaml.parse(yamlContents.toString())

        const { system, subsystem, features } = parsed
        const systemName = system.toString().toLowerCase()
        const subsystemName = subsystem.toString().toLowerCase()

        if (systemName in output.systems) {
          output.systems[systemName].subsystems[subsystemName] = {
            features,
          }
        } else {
          const subsystems: any = {}
          subsystems[subsystemName] = {
            features,
          }
          const sysSubsystems = (output.systems[systemName] = {
            subsystems,
          })
        }
      } catch (err) {
        console.error(`YAML SYNTAX ERROR: ${subsystemPath}`)
        throw err
      }
    }
  }

  const outputJson = JSON.stringify(output, null, 2)
  fs.writeFileSync(OUTPUT_PATH, outputJson)
}

combineBehaviors()
