import { GroupTypes, ItemTypes } from "./constants";

export type FormatJSONPath = (string | number)[];

export interface FormatJSONRenderGroup {
  type: GroupTypes;
  data: FormatJSONRenderItem[];
  separator: FormatJSONRenderItem[];
  path?: FormatJSONPath;
}

export interface FormatJSONRenderItem {
  type: ItemTypes;
  value?: string;
}

export type FormatJSONEntry<T = any> = [key: string, value: T];

export interface FormatJSONOptions {
  /**
   * 0 for compact display, otherwise number of spaces for each indent
   */
  indent: number;
  /**
   * Whether to omit quotes if possible.
   */
  quoteAsNeeded: boolean;
  /**
   * Preferred quote character, `'` by default.
   */
  quote: '\'' | '"';
  /**
   * Whether to add trailing commas.
   */
  trailing: boolean;
  /**
   * Whether to quote multiline strings as template literals.
   */
  template: boolean;
  /**
   * Extract entries from an object, `Object.entries` with sorted keys by default.
   */
  entries?: (data: any) => FormatJSONEntry[];
  /**
   * Callback when an object is emitted.
   */
  onData?: (data: FormatJSONRenderGroup) => void;
}
