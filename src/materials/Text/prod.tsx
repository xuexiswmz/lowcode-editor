import  { forwardRef } from 'react'
import type { CommonComponentProps } from '../../interface'

const Text = forwardRef<HTMLSpanElement,CommonComponentProps>(
    ({ id,text="文本", styles },ref) => {
  return (
    <span ref={ref} 
        data-component-id={id}
        style={styles}>
      {text}
    </span>
  )
})

export default Text