import { highlightCodeSync } from './shiki';
import markdownit from 'markdown-it'


export const processMarkdown = (markdown: string): string => {
  const md = markdownit({
    highlight: (code, lang) => {
      return `<div class="not-prose">${highlightCodeSync(code, lang)}</div>`
    }
  });
  return md.render(markdown);
};
