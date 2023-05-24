import { ItemTypes, format, render, defaultRenderOptions, GroupTypes } from '../src';

test('JSON', () => {
  expect(format({
    a: 1,
    b: 2,
    c: ['a', { d: 'a\nb' }],
  }, {
    indent: 0,
    quoteAsNeeded: false,
    quote: '"',
    trailing: false,
    template: false,
  })).toEqual('{"a":1,"b":2,"c":["a",{"d":"a\\nb"}]}');

  expect(render({
    a: 1,
    b: 2,
    c: ['a', { d: 'a\nb' }],
  }, defaultRenderOptions)).toEqual({
    data: [
      {
        type: ItemTypes.BLOCK,
        value: '{',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.KEY,
        value: '"a"',
      },
      {
        type: ItemTypes.COLON,
        value: ':',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.VALUE,
        value: '1',
      },
      {
        type: ItemTypes.COMMA,
        value: ',',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.KEY,
        value: '"b"',
      },
      {
        type: ItemTypes.COLON,
        value: ':',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.VALUE,
        value: '2',
      },
      {
        type: ItemTypes.COMMA,
        value: ',',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.KEY,
        value: '"c"',
      },
      {
        type: ItemTypes.COLON,
        value: ':',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.BLOCK,
        value: '[',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.VALUE,
        value: '"a"',
      },
      {
        type: ItemTypes.COMMA,
        value: ',',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.BLOCK,
        value: '{',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.KEY,
        value: '"d"',
      },
      {
        type: ItemTypes.COLON,
        value: ':',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.VALUE,
        value: '"a\\nb"',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.BLOCK,
        value: '}',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.BLOCK,
        value: ']',
      },
      {
        type: ItemTypes.SPACE,
        value: '',
      },
      {
        type: ItemTypes.BLOCK,
        value: '}',
      },
    ],
    path: [],
    separator: [
      {
        type: ItemTypes.COMMA,
        value: ',',
      },
    ],
    type: GroupTypes.MULTILINE,
  });
});

test('JavaScript', () => {
  expect(format({
    a: 1,
    b: 2,
    c: [1, { d: 2 }],
  }, {
    indent: 2,
    quoteAsNeeded: true,
    quote: '\'',
    trailing: true,
    template: true,
  })).toEqual(`\
{
  a: 1,
  b: 2,
  c: [
    1,
    {
      d: 2,
    },
  ],
}`);
});

test('highlight', () => {
  expect(format({
    a: 1,
    b: 2,
    c: 3,
  }, {
    indent: 0,
    quoteAsNeeded: false,
    quote: '"',
    trailing: false,
    template: false,
    onData(data) {
      if (data.path.join('.') === 'b') {
        if (data.type === GroupTypes.KEY) {
          data.data = [
            { type: ItemTypes.VALUE, value: '<key-b>' },
            ...data.data,
            { type: ItemTypes.VALUE, value: '</key-b>' },
          ];
        } else {
          data.data = [
            { type: ItemTypes.VALUE, value: '<value-b>' },
            ...data.data,
            { type: ItemTypes.VALUE, value: '</value-b>' },
          ];
        }
      }
    },
  })).toEqual('{"a":1,<key-b>"b"</key-b>:<value-b>2</value-b>,"c":3}');
});

test('no sorting', () => {
  expect(format({
    a: 1,
    d: 4,
    b: 2,
    c: 3,
  }, {
    indent: 0,
    quoteAsNeeded: false,
    quote: '"',
    trailing: false,
    template: false,
    entries: obj => Object.entries(obj),
  })).toEqual('{"a":1,"d":4,"b":2,"c":3}');
});
