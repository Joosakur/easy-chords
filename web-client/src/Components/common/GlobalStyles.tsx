import styled from 'styled-components'
import { Colors } from './style-constants'

const GlobalStyles = styled.div`
  // notice color for missing classname
  color: #ff0000;

  a {
    color: inherit;
    text-decoration: inherit;
    &.link {
      color: ${Colors.link};
      text-decoration: underline;
    }
  }

  .text-high {
    color: #ffffff;
    opacity: 0.87;
  }

  .text-medium {
    color: #ffffff;
    opacity: 0.6;
  }

  .text-disabled {
    color: #ffffff;
    opacity: 0.4;
  }

  h1,
  h2,
  h3,
  h4 {
    color: #ffffff;
    opacity: 0.87;
    margin-top: 0;
  }

  label {
    color: #ffffff;
    font-weight: bold;
    opacity: 0.6;
  }

  .ui.checkbox label {
    color: #ffffff !important;
    font-weight: normal;
    opacity: 0.87;
  }
`

export default GlobalStyles
