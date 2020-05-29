import {desaturate, mix, shade, tint} from 'polished'

export const SPACING_LENGTHS = {
  xs: '6px',
  s: '12px',
  m: '24px',
  L: '48px',
  XL: '96px',
}

export type SpacingSize = 'xs' | 's' | 'm' | 'L' | 'XL'

const primary = '#3a51ce'
const secondary = '#143d84'

const grey = {
  darkest: mix(0.04, primary, '#0c0c0c'),
  darker: mix(0.08, primary, '#171717'),
  dark: '#4b4b4b'
}

const interval = [
  '#8ad252',
  '#927e2c',
  '#dea754',
  '#2e4fc4',
  '#5fa8ea',
  '#b7c717',
  '#bb7946',
  '#45842b',
  '#7f8b54',
  '#42318d',
  '#bb3535',
  '#e87070'
]

const states = {
  active: '#64953e',
  error: '#5f2626'
}

export const Colors = {
  primary,
  secondary,
  primaryDark: mix(0.70, '#000000', primary) ,
  grey,
  states,
  interval
}

export const FadedColors = {
  primary: tint(0.1, desaturate(0.2, Colors.primary)),
  secondary: shade(0.1, desaturate(0.2, Colors.secondary)),
  states: {
    active: tint(0.1, desaturate(0.15, Colors.states.active))
  }
}
