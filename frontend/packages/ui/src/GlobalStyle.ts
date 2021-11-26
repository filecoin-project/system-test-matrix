import { createGlobalStyle } from 'styled-components'
import { Colors } from './styles/colors'
import { Fonts } from './styles/fonts'

export const GlobalStyle = createGlobalStyle<{ theme: any; customCss: string }>`
  * {
    box-sizing: border-box;
    scrollbar-color: #D0D0D0 #DDDDDD59;
    scrollbar-width: thin;
  }
  *::before, *::after {
    box-sizing: inherit;
  }

  html, body {
    margin: 0;
    padding: 0;
    background-color: ${Colors.background};
    overflow-x: hidden;
    font-family: ${Fonts.SegoeUI};
    font-size: 16px;
    color: ${Colors.textColor};
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;  
  }

  body {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }
  footer {
    font-family: ${Fonts.Roboto};
  }
  a {
    text-decoration: none;
    color: ${Colors.primary};
  }
  
  input, textarea {
    font-family: 'Segoe UI Regular', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  table.table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid ${Colors.borderColor};

    th,
    td {
      margin: 0;
      padding: 0;
      border-bottom: 1px solid ${Colors.borderColor};
    }

    input,
    [data-element='dropdown'] {
      width: 100%;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
    [data-element='dropdown'] {
      border-left: 1px solid ${Colors.borderColor};
    }
  }
  
  .table thead {
    background: ${Colors.chartTitleBackground};
    th {
      padding: 1rem;
      font-size: 14px;
      font-weight: normal;
      text-transform: uppercase;
      text-align: left;
      :last-child {
        width: 100px;
      }
    }
  }

  .table tbody {
    td:last-child {
      width: 100px;
      padding-right: 1rem;
      text-align: right;

      [data-element='icon'] {
        height: 20px;
        width: 20px;
        display: inline-flex;
        color: ${Colors.textColorLight};
        background: ${Colors.backgroundShadow};
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
        &:last-child {
          margin-left: 0.5rem;
        }
      }
    }
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #DDDDDD59;
  }
 
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #D0D0D0;
  }
  
  table {
    div {
      cursor: default;
    }
  }
  ${props => `${props.customCss}`}
`
