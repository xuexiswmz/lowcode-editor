import { forwardRef } from 'react'
import type { CommonComponentProps } from '../../interface'
import { Divider as AntdDivider } from 'antd'

const Divider = forwardRef<HTMLDivElement, CommonComponentProps> (
    ({ id, styles, dashed, plain, orientation, titlePlacement, text="分割线" },ref) => {
  return (
    <div ref={ref} data-component-id={id}>
      <AntdDivider 
        style={styles} 
        dashed={dashed} 
        plain={plain} 
        orientation={orientation}
        titlePlacement={titlePlacement}
      >
        {text}
      </AntdDivider>
    </div>
  )
})
export default Divider