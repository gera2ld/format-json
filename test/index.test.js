import { ItemTypes, format } from '../src';

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
