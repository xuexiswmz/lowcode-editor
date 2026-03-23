import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";

export default function Text({ id, name, text="文本", styles }: CommonComponentProps) {
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    }
  })  
  return (
    <span ref={drag} 
        data-component-id={id}
        style={styles}>
      {text}
    </span>
  )
}
