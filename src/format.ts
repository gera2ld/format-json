import { FormatJSONOptions, FormatJSONRenderItem } from './types';

export enum ItemTypes {
  MULTILINE = 'MULTILINE',
  SINGLELINE = 'SINGLELINE',
  KEY = 'KEY',
  COMMA = 'COMMA',
  BR = 'BR',
}

const COMMA = { type: ItemTypes.COMMA, value: ',' };
const BR = { type: ItemTypes.BR, value: '\n' };

const charMapBase = {
  '\\': '\\\\',
  '\r': '\\r',
  '\t': '\\t',
};
const charMapQuote = {
  ...charMapBase,
  '\'': '\\\'',
  '\n': '\\n',
} as any;
const charMapTemplate = {
  ...charMapBase,
  '`': '\\`',
} as any;

function quoteString(str: string, {
  quote,
  quoteAsNeeded,
  template,
}: FormatJSONOptions): string {
  if (template && /\n/.test(str)) {
    const quoted = str.replace(/[\\`\r\t]/g, m => charMapTemplate[m]);
    return `\`${quoted}\``;
  }
  if (!quoteAsNeeded || /\W/.test(str)) {
    const re = new RegExp(`[\\\\\\r\\n\\t${quote}]`, 'g');
    const quoted = str.replace(re, m => charMapQuote[m]);
    return quote + quoted + quote;
  }
  return str;
}

function getSpace(level: number, indent: number): FormatJSONRenderItem {
  return { type: 'space', value: ' '.repeat(indent * level) };
}

function renderArray(data: any[], options: FormatJSONOptions, path = []): FormatJSONRenderItem {
  const level = path.length;
  const arr: FormatJSONRenderItem[] = [];
  const ret = {
    type: ItemTypes.MULTILINE,
    separator: [COMMA],
    data: arr,
    path,
  };
  arr.push({ value: '[' });
  if (data.length) {
    const rendered = data.map((item, i) => render(item, options, [...path, i]));
    arr.push(
      ...options.indent ? [BR] : [],
      getSpace(level + 1, options.indent),
      ...join(rendered, options, level + 1),
      ...options.indent ? [BR] : [],
      getSpace(level, options.indent),
    );
  } else {
    ret.type = ItemTypes.SINGLELINE;
  }
  arr.push({ value: ']' });
  return ret;
}

function renderObject(data: any, options: FormatJSONOptions, path = []): FormatJSONRenderItem {
  const level = path.length;
  const arr: FormatJSONRenderItem[] = [];
  const ret = {
    type: ItemTypes.MULTILINE,
    separator: [COMMA],
    data: arr,
    path,
  };
  arr.push({ value: '{' });
  const entries = typeof options.entries === 'function'
    ? options.entries(data)
    : Object.entries(data).sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  const rendered = entries
    .map(([key, value, displayKey]) => {
      const subpath = [...path, key];
      const keyItem = {
        type: ItemTypes.KEY,
        data: [{ value: quoteString(displayKey ?? key, options), type: 'key' }],
        separator: [{ value: ':' }],
        path: subpath,
      };
      options.onData?.(keyItem);
      return [
        keyItem,
        render(value, options, subpath),
      ];
    })
    .reduce((res, cur) => [...res, ...cur], []);
  if (rendered.length) {
    arr.push(
      ...options.indent ? [BR] : [],
      getSpace(level + 1, options.indent),
      ...join(rendered, options, level + 1),
      ...options.indent ? [BR] : [],
      getSpace(level, options.indent),
    );
  } else {
    ret.type = ItemTypes.SINGLELINE;
  }
  arr.push({ value: '}' });
  return ret;
}

export function render(data: any, options: FormatJSONOptions, path = []): FormatJSONRenderItem {
  let result: FormatJSONRenderItem;
  if (Array.isArray(data)) {
    result = renderArray(data, options, path);
  } else if (data === null) {
    result = {
      type: ItemTypes.SINGLELINE,
      separator: [COMMA],
      data: [{ value: data, type: 'null' }],
      path,
    };
  } else if (typeof data === 'object') {
    result = renderObject(data, options, path);
  } else {
    result = {
      type: ItemTypes.SINGLELINE,
      separator: [COMMA],
      data: [{ value: typeof data === 'string' ? quoteString(data, { ...options, quoteAsNeeded: false }) : data }],
      path,
    };
  }
  options.onData?.(result);
  return result;
}

function join(
  rendered: FormatJSONRenderItem[],
  options: FormatJSONOptions,
  level: number,
): FormatJSONRenderItem[] {
  const arr: FormatJSONRenderItem[] = [];
  for (let i = 0; i < rendered.length; i += 1) {
    const item = rendered[i];
    const next = rendered[i + 1];
    if (item.data) arr.push(...item.data);
    // trailing separators
    if (item.separator && (next || options.trailing)) {
      arr.push(...item.separator);
    }
    if (next) {
      if (item.type === ItemTypes.KEY) {
        if (options.indent) arr.push({ value: ' ' });
      } else {
        arr.push(
          ...options.indent ? [BR] : [],
          getSpace(level, options.indent),
        );
      }
    }
  }
  return arr;
}

export function format(data: any, options: Partial<FormatJSONOptions>): string {
  const renderOptions: FormatJSONOptions = {
    indent: 0,
    quoteAsNeeded: false,
    quote: '"',
    trailing: false,
    template: false,
    ...options,
  };
  const rendered = render(data, renderOptions);
  return (rendered.data || []).map(({ value }) => `${value}`).join('');
}
