import { antdMaterialUIAdapter } from "./adapters/antd";

export const materialUI = antdMaterialUIAdapter;

export const {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tag,
  materials,
} = materialUI;

export type { MaterialUIAdapter, MaterialInputRef } from "./types";
