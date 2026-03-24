import { useDrag } from 'react-dnd'
import type { CommonComponentProps } from '../../interface'
import { Divider as AntdDivider } from 'antd'

export default function Divider({ id, name, styles, dashed, plain, orientation, titlePlacement, text="分割线" }: CommonComponentProps) {
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      id,
    }
  })  
  return (
    <div 
      ref={drag}
      data-component-id={id}
    >
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
}
