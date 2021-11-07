const uuid = jest.createMockFromModule('uuid')

uuid.v4 = function () {
  return 1
}

module.exports = uuid
