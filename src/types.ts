export interface FormatJSONOptions {
  /**
   * 0 for compact display, otherwise number of spaces for each indent
   */
  indent: number;
  /**
   * whether to omit quotes if possible
   */
  quoteAsNeeded: boolean;
  /**
   * preferred quote character, `'` by default
   */
  quote: '\'' | '"';
  /**
   * whether to add trailing commas
   */
  trailing: boolean;
  /**
   * whether to quote multiline strings as template literals
   */
  template: boolean;
}

export interface FormatJSONRenderItem {
  type?: string;
  value?: string;
  data?: FormatJSONRenderItem[];
  separator?: FormatJSONRenderItem[];
}
