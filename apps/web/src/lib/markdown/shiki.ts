import javascript from '@shikijs/langs/javascript';
import js from '@shikijs/langs/js';
import typescript from '@shikijs/langs/typescript';
import ts from '@shikijs/langs/ts';
import svelte from '@shikijs/langs/svelte';
import bash from '@shikijs/langs/bash';
import html from '@shikijs/langs/html';
import json from '@shikijs/langs/json';
import jsonc from '@shikijs/langs/jsonc';
import css from '@shikijs/langs/css';
import githubDarkHighContrast from '@shikijs/themes/github-dark-high-contrast';
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { BundledLanguage } from 'shiki';

let shiki: HighlighterCore;
export const highlightCodeSync = (code: string, lang: string) => {
  if (!shiki) {
    shiki = createHighlighterCoreSync({
      themes: [githubDarkHighContrast],
      langs: [
        js,
        ts,
        svelte,
        bash,
        html,
        json,
        jsonc,
        css,
        javascript,
        typescript
      ],
      engine: createJavaScriptRegexEngine()
    });
  }

  return shiki.codeToHtml(code, {
    lang: (lang || 'bash') as BundledLanguage,
    themes: {light: githubDarkHighContrast, dark: githubDarkHighContrast}
  });
};
