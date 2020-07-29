import test from 'tape';
import { format } from '#';

test('format', t => {
  t.test('JSON', q => {
    q.equal(format(`{a:1,b:2,c:['a',{d:'a\\nb'}]}`, {
      indent: 0,
      quoteAsNeeded: false,
      quote: '"',
      trailing: false,
      template: false,
    }), '{"a":1,"b":2,"c":["a",{"d":"a\\nb"}]}');
    q.end();
  });

  t.test('JavaScript', q => {
    q.equal(format(`{a:1,b:2,c:[1,{d:2}]}`, {
      indent: 2,
      quoteAsNeeded: true,
      quote: '\'',
      trailing: true,
      template: true,
    }), `\
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
    q.end();
  });
});
