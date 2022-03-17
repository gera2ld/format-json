import { ItemTypes, format, render, defaultRenderOptions } from '../src';

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
        value: '{',
      },
      {
        type: 'space',
        value: '',
      },
      {
        type: 'key',
        value: '"a"',
      },
      {
        value: ':',
      },
      {
        value: '1',
      },
      {
        type: 'COMMA',
        value: ',',
      },
      {
        type: 'space',
        value: '',
      },
      {
        type: 'key',
        value: '"b"',
      },
      {
        value: ':',
      },
      {
        value: '2',
      },
      {
        type: 'COMMA',
        value: ',',
      },
      {
        type: 'space',
        value: '',
      },
      {
        type: 'key',
        value: '"c"',
      },
      {
        value: ':',
      },
      {
        value: '[',
      },
      {
        type: 'space',
        value: '',
      },
      {
        value: '"a"',
      },
      {
        type: 'COMMA',
        value: ',',
      },
      {
        type: 'space',
        value: '',
      },
      {
        value: '{',
      },
      {
        type: 'space',
        value: '',
      },
      {
        type: 'key',
        value: '"d"',
      },
      {
        value: ':',
      },
      {
        value: '"a\\nb"',
      },
      {
        type: 'space',
        value: '',
      },
      {
        value: '}',
      },
      {
        type: 'space',
        value: '',
      },
      {
        value: ']',
      },
      {
        type: 'space',
        value: '',
      },
      {
        value: '}',
      },
    ],
    path: [],
    separator: [
      {
        type: 'COMMA',
        value: ',',
      },
    ],
    type: 'MULTILINE',
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
        if (data.type === ItemTypes.KEY) {
          data.data = [
            { value: '<key-b>'},
            ...data.data,
            { value: '</key-b>'},
          ];
        } else {
          data.data = [
            { value: '<value-b>'},
            ...data.data,
            { value: '</value-b>'},
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
