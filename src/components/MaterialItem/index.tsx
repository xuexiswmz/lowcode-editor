import {
  AppstoreOutlined,
  BorderOutlined,
  CheckCircleOutlined,
  ColumnWidthOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  FormOutlined,
  InsertRowBelowOutlined,
  LayoutOutlined,
  LinkOutlined,
  MenuOutlined,
  PicLeftOutlined,
  PictureOutlined,
  RadiusSettingOutlined,
  TableOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  name: string;
  desc: string;
}

const iconMap = {
  Avatar: UserOutlined,
  Button: BorderOutlined,
  Checkbox: CheckCircleOutlined,
  Col: ColumnWidthOutlined,
  Container: LayoutOutlined,
  Divider: InsertRowBelowOutlined,
  Form: FormOutlined,
  FormItem: PicLeftOutlined,
  Icon: AppstoreOutlined,
  Image: PictureOutlined,
  Input: RadiusSettingOutlined,
  Textarea: RadiusSettingOutlined,
  Link: LinkOutlined,
  Modal: FileImageOutlined,
  Text: FontSizeOutlined,
  Page: MenuOutlined,
  Radio: CheckCircleOutlined,
  Row: TableOutlined,
  Tag: TagOutlined,
} as const;

export default function MaterialItem(props: MaterialItemProps) {
  const { name, desc } = props;
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
    },
  });

  const Icon = iconMap[name as keyof typeof iconMap] ?? AppstoreOutlined;

  return (
    <div ref={drag} className="lce-material-item" title={name}>
      <span className="lce-material-item-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="lce-material-item-text">{desc}</span>
    </div>
  );
}
