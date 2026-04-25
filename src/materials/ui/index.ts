import { antdMaterialUIAdapter } from "./adapters/antd";

export const materialUI = antdMaterialUIAdapter;

export const {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CheckboxGroup,
  Col,
  DatePicker,
  Descriptions,
  Dropdown,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  List,
  Spin,
  Tree,
  Table,
  Menu,
  TextArea,
  RadioGroup,
  Select,
  Steps,
  Tabs,
  Upload,
  Switch,
  Modal,
  Progress,
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
