export type FlatCollectionFieldType =
  | "input"
  | "textarea"
  | "switch"
  | "inputNumber"
  | "select";

export interface FlatCollectionField<TItem> {
  key: keyof TItem & string;
  type: FlatCollectionFieldType;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  normalize?: (value: unknown, item: TItem) => unknown;
  props?: Record<string, unknown>;
}

export interface FlatCollectionDefinition<TItem> {
  normalize: (value: unknown) => TItem[];
  createItem: (items: TItem[]) => TItem;
  getItemTitle: (item: TItem, index: number) => string;
  fields: FlatCollectionField<TItem>[];
  addLabel: string;
  layout: "row" | "card";
}
