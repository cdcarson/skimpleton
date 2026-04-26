import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import hljs, { type HighlightOptions } from 'highlight.js';
import { Marked, Renderer } from 'marked';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uniqueId = (prefix?: string): string => {
  prefix = prefix || 'ui';
  return `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
};

export const getPageTitleTag = (title: string) => {
  return `${title} - Skimpleton Forms`;
};

export const highlightCode = (
  code: string,
  language: HighlightOptions['language']
): string => {
  return hljs.highlight(code, { language }).value;
};

export const stripIgnored = (
  code: string,
  ignored: (number | [number, number])[]
) => {
  const ignoredLines: number[] = [];
  for (const entry of ignored) {
    if (Array.isArray(entry)) {
      for (let n = entry[0] - 1; n < entry[1]; n++) {
        ignoredLines.push(n);
      }
    } else {
      ignoredLines.push(entry - 1);
    }
  }
  const origLines = code.split(/\n/);
  const curatedLines: string[] = [];
  for (let n = 0; n < origLines.length; n++) {
    if (!ignoredLines.includes(n)) {
      curatedLines.push(origLines[n]);
    }
  }
  return curatedLines.join('\n');
};

export const markdownToHtml = (markdown: string): string => {
  const renderer = new Renderer();
  renderer.code = ({ text, lang }) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    const highlighted = hljs.highlight(text, { language }).value;
    return `<div class="not-prose mb-4"><pre class="border border-gray-200 text-xs"><code class="hljs language-${language}">${highlighted}</code></pre></div>`;
  };
  const marked = new Marked({ renderer });
  return marked.parse(markdown).toString();
};
