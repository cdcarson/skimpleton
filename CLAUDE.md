# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Turborepo monorepo for open source Svelte 2.x and Svelte 5.x libraries. The monorepo uses pnpm workspaces and is configured with TypeScript, ESLint, Prettier, and Tailwind CSS (v4).

## Commands

### Root-level commands (run from monorepo root)

- `pnpm dev` - Start all development servers concurrently
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all code with Prettier
- `pnpm check` - Run type checking across all packages

### Monorepo Structure

- **apps/web**: SvelteKit website with documentation and examples of the open source packages
- **packages/[PACKAGE_NAME]**: The individual packages

### Key Technologies

- **Svelte 5**: Using new runes API (`$props`, `$state`, etc.)
- **SvelteKit 2.22+**: Full-stack framework for Svelte
- **Tailwind CSS v4**: Configured in apps/web with Vite integration
- **TypeScript**: All packages use TypeScript with strict checking
- **Turborepo**: Build system orchestration with dependency tracking

### Package Development

When creating libraries in `packages/`:

- Use `svelte-package` for building distributable packages
- Include both client and server exports when needed
- Configure peer dependencies for Svelte and SvelteKit
- Use Vitest for testing with appropriate environment configuration

## Code Style Preferences

- Prefer type declarations over interface declarations
- Prefer constant arrow functions over function declarations
