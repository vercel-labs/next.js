import { style } from '@vanilla-extract/css'
// component layer, same specificity -> must win by coming LATER in the CSS output
export const emphasis = style({
  background: 'rgb(0, 128, 0)',
  padding: '40px',
  fontSize: '32px',
})
