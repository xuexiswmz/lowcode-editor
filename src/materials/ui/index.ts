import { antdMaterialUIAdapter } from "./adapters/antd";

export const materialUI = antdMaterialUIAdapter;

export const {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  CheckboxGroup,
  Col,
  DatePicker,
  Dropdown,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Menu,
  TextArea,
  RadioGroup,
  Select,
  Steps,
  Tabs,
  Upload,
  Switch,
  Modal,
  Row,
  Space,
  Tag,
  materials,
} = materialUI;

export type {
  MaterialUIAdapter,
  MaterialInputRef,
  MaterialTextAreaRef,
} from "./types";
