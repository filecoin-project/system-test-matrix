import ProgressBarWrapper, {
  ProgressBarWrapperProps,
} from '../ProgressBarWrapper'
import { itRendersChildren } from './../../../tests/index'

const defaultProps: ProgressBarWrapperProps = {
  shadow: false,
  children: 'test-bar',
}
describe('Progress bar wrapper suite', () => {
  itRendersChildren(ProgressBarWrapper, defaultProps)
})
