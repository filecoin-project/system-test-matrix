const moduleRules = require('./module')
const resolveRules = require('./resolve')
const pluginsRules = require('./plugins')
const optimizationRules = require('./optimization')
const CompressionPlugin = require('./compression')

exports.moduleRules = moduleRules
exports.resolveRules = resolveRules
exports.pluginsRules = pluginsRules
exports.optimizationRules = optimizationRules
exports.CompressionPlugin = CompressionPlugin
