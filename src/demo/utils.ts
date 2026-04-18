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
