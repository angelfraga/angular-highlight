import { HighlightPipe } from './highlight.pipe';

fdescribe('HighlightPipe', () => {
  it('highlights a char', () => {
    expect(HighlightPipe.applyHighlight('abc', 'c')).toBe('ab<span class="highlightText">c</span>');
  });

  it('highlights more than a char', () => {
    expect(HighlightPipe.applyHighlight('abcd', 'bc')).toBe('ab<span class="highlightText">cd</span>efg');
  });

  it('highlights escaping html', () => {
    const expected = '&lt;html&gt;<span class="highlightText">hello</span>&lt;/html&gt;';
    expect(HighlightPipe.applyHighlight('<html>hello</html>', 'hello')).toBe(expected);
  });

  it('highlights matches escaped content', () => {
    const expected = '<span class="highlightText">&amp;lt;</span>html&gt;hello<span class="highlightText">&amp;lt;</span>/html&gt;';
    expect(HighlightPipe.applyHighlight('<html>hello</html>', '<')).toBe(expected);
  });

  it('highlights matches escaped content & query', () => {
    const expected = '<span class="highlightText">\</span>&lt;html&gt;hello&lt;/html&gt;';
    expect(HighlightPipe.applyHighlight('\\<html>hello</html>', '\\')).toBe(expected);
  });

  it('highlights escapes value if the query is not defined or empty', () => {
    const expected = '&lt;html&gt;';
    expect(HighlightPipe.applyHighlight('<html>', '')).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', null)).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', undefined)).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', NaN as any)).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', 0 as any)).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', -1 as any)).toBe(expected);
    expect(HighlightPipe.applyHighlight('<html>', false as any)).toBe(expected);
  });
});