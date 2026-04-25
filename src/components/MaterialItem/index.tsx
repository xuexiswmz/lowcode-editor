import {
  AppstoreOutlined,
  AlertOutlined,
  NotificationOutlined,
  BorderOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DownSquareOutlined,
  DownOutlined,
  ColumnWidthOutlined,
  IdcardOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  FormOutlined,
  InsertRowBelowOutlined,
  LayoutOutlined,
  LinkOutlined,
  Loading3QuartersOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  PicLeftOutlined,
  PictureOutlined,
  PercentageOutlined,
  RadiusSettingOutlined,
  OrderedListOutlined,
  DeploymentUnitOutlined,
  FolderOpenOutlined,
  TableOutlined,
  TagOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  name: string;
  desc: string;
}

const iconMap = {
  Alert: AlertOutlined,
  Avatar: UserOutlined,
  Badge: NotificationOutlined,
  Breadcrumb: ApartmentOutlined,
  Button: BorderOutlined,
  Checkbox: CheckCircleOutlined,
  Col: ColumnWidthOutlined,
  Container: LayoutOutlined,
  DatePicker: CalendarOutlined,
  Descriptions: IdcardOutlined,
  Divider: InsertRowBelowOutlined,
  Dropdown: DownOutlined,
  Form: FormOutlined,
  FormItem: PicLeftOutlined,
  Icon: AppstoreOutlined,
  Image: PictureOutlined,
  Input: RadiusSettingOutlined,
  Textarea: RadiusSettingOutlined,
  Link: LinkOutlined,
  List: UnorderedListOutlined,
  Table: TableOutlined,
  Modal: FileImageOutlined,
  Menu: MenuOutlined,
  Text: FontSizeOutlined,
  Page: MenuOutlined,
  Progress: PercentageOutlined,
  Radio: CheckCircleOutlined,
  Row: TableOutlined,
  Select: DownSquareOutlined,
  Spin: Loading3QuartersOutlined,
  Steps: OrderedListOutlined,
  Switch: DeploymentUnitOutlined,
  Tabs: FolderOpenOutlined,
  Tag: TagOutlined,
  Tree: ApartmentOutlined,
  Upload: UploadOutlined,
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
