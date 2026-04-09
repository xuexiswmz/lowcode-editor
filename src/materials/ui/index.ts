import { antdMaterialUIAdapter } from "./adapters/antd";

export const materialUI = antdMaterialUIAdapter;

export const {
  Avatar,
  Button,
  Card,
  CheckboxGroup,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  TextArea,
  RadioGroup,
  Select,
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
