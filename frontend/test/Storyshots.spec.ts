import initStoryshots, {
  multiSnapshotWithOptions,
} from '@storybook/addon-storyshots'

initStoryshots({
  //separate snapshot file for each stories file
  test: multiSnapshotWithOptions(),
})
