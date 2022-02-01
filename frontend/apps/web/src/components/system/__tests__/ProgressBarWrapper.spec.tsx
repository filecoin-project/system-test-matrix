import { itRendersChildren } from '@filecoin/ui/src/general-purpose-tests/it-renders-children'
import ProgressBarWrapper, {
  ProgressBarWrapperProps,
} from '../ProgressBarWrapper'

const defaultProps: ProgressBarWrapperProps = {
  shadow: false,
  children: 'test-bar',
}
describe('Progress bar wrapper suite', () => {
  itRendersChildren(ProgressBarWrapper, defaultProps)
})
