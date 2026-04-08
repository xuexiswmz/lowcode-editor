import { antdMaterialUIAdapter } from "./adapters/antd";

export const materialUI = antdMaterialUIAdapter;

export const {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  TextArea,
  RadioGroup,
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
