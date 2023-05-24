import { GroupTypes, ItemTypes } from './constants';
import { FormatJSONOptions, FormatJSONRenderGroup, FormatJSONRenderItem } from './types';

const COMMA: FormatJSONRenderItem = { type: ItemTypes.COMMA, value: ',' };
const BR: FormatJSONRenderItem = { type: ItemTypes.BR, value: '\n' };

const charMapBase: Record<string, string> = {
  '\\': '\\\\',
  '\r': '\\r',
  '\t': '\\t',
};
const charMapQuote: Record<string, string> = {
  ...charMapBase,
  '\'': '\\\'',
  '\n': '\\n',
};
const charMapTemplate: Record<string, string> = {
  ...charMapBase,
  '`': '\\`',
};

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
  return { type: ItemTypes.SPACE, value: ' '.repeat(indent * level) };
}

function renderArray(data: any[], options: FormatJSONOptions, path = []): FormatJSONRenderGroup {
  const level = path.length;
  const arr: FormatJSONRenderItem[] = [];
  const ret: FormatJSONRenderGroup = {
    type: GroupTypes.MULTILINE,
    separator: [COMMA],
    data: arr,
    path,
  };
  arr.push({ type: ItemTypes.BLOCK, value: '[' });
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
    ret.type = GroupTypes.SINGLELINE;
  }
  arr.push({ type: ItemTypes.BLOCK, value: ']' });
  return ret;
}

function renderObject(data: any, options: FormatJSONOptions, path = []): FormatJSONRenderGroup {
  const level = path.length;
  const arr: FormatJSONRenderItem[] = [];
  const ret: FormatJSONRenderGroup = {
    type: GroupTypes.MULTILINE,
    separator: [COMMA],
    data: arr,
    path,
  };
  arr.push({ type: ItemTypes.BLOCK, value: '{' });
  const entries = typeof options.entries === 'function'
    ? options.entries(data)
    : Object.entries(data).sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  const rendered = entries
    .map(([key, value]) => {
      const subpath = [...path, key];
      const keyItem: FormatJSONRenderGroup = {
        type: GroupTypes.KEY,
        data: [{ type: ItemTypes.KEY, value: quoteString(key, options) }],
        separator: [
          { type: ItemTypes.COLON, value: ':' },
          getSpace(1, options.indent ? 1 : 0),
        ],
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
    ret.type = GroupTypes.SINGLELINE;
  }
  arr.push({ type: ItemTypes.BLOCK, value: '}' });
  return ret;
}

export function render(data: any, options: FormatJSONOptions, path = []): FormatJSONRenderGroup {
  let result: FormatJSONRenderGroup;
  if (Array.isArray(data)) {
    result = renderArray(data, options, path);
  } else if (data === null) {
    result = {
      type: GroupTypes.SINGLELINE,
      separator: [COMMA],
      data: [{ type: ItemTypes.VALUE, value: `${data}` }],
      path,
    };
  } else if (typeof data === 'object') {
    result = renderObject(data, options, path);
  } else {
    result = {
      type: GroupTypes.SINGLELINE,
      separator: [COMMA],
      data: [{ type: ItemTypes.VALUE, value: typeof data === 'string' ? quoteString(data, { ...options, quoteAsNeeded: false }) : `${data}` }],
      path,
    };
  }
  options.onData?.(result);
  return result;
}

function join(
  rendered: FormatJSONRenderGroup[],
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
    if (next && item.type !== GroupTypes.KEY) {
      arr.push(
        ...options.indent ? [BR] : [],
        getSpace(level, options.indent),
      );
    }
  }
  return arr;
}

export const defaultRenderOptions: FormatJSONOptions = {
  indent: 0,
  quoteAsNeeded: false,
  quote: '"',
  trailing: false,
  template: false,
};

export function format(data: any, options: Partial<FormatJSONOptions>): string {
  const renderOptions: FormatJSONOptions = {
    ...defaultRenderOptions,
    ...options,
  };
  const rendered = render(data, renderOptions);
  return (rendered.data || []).map(({ value }) => `${value}`).join('');
}
