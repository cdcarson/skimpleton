import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import hljs, { type HighlightOptions } from 'highlight.js';

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
