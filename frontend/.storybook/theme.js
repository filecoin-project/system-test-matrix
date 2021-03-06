import { Colors } from '@filecoin/ui'
import { create } from '@storybook/theming'

export default create({
  base: 'light',

  colorPrimary: Colors.purple70,
  colorSecondary: Colors.gray90,

  // UI
  appBg: Colors.background,
  appContentBg: Colors.chartTitleBackground,
  appBorderColor: Colors.borderColor,
  appBorderRadius: 4,

  // Typography
  fontBase: 'sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: Colors.gray90,
  textInverseColor: Colors.gray90,

  // Toolbar default and active colors
  barTextColor: Colors.gray90,
  barSelectedColor: Colors.gray80,
  barBg: Colors.gray30,

  // Form colors
  inputBg: Colors.background,
  inputBorder: Colors.borderColor,
  inputTextColor: Colors.gray90,
  inputBorderRadius: 4,

  brandTitle: 'FILECOIN',
  brandUrl: 'https://filecoin.com',
  brandImage: '/img/storybookLogo.png',
})
