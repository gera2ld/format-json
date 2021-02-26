import { format } from '../src';

it('should format as JSON', () => {
  expect(format(`{a:1,b:2,c:['a',{d:'a\\nb'}]}`, {
    indent: 0,
    quoteAsNeeded: false,
    quote: '"',
    trailing: false,
    template: false,
  })).toEqual('{"a":1,"b":2,"c":["a",{"d":"a\\nb"}]}');
});

it('should format as JavaScript', () => {
  expect(format(`{a:1,b:2,c:[1,{d:2}]}`, {
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
