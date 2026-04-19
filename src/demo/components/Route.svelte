<script lang="ts">
  import { cn } from '$demo/utils.js';
  import type { Snippet } from 'svelte';

  type Props = {
    pageTitle: string;
    breadcrumbs: { label: string; href: string }[];
    fullWidth?: boolean;
    children: Snippet;
  };

  let { pageTitle, breadcrumbs, children, fullWidth = false }: Props = $props();
</script>

<svelte:head>
  <title>{pageTitle} - Skimpleton</title>
</svelte:head>
<nav class="bg-gray-100 py-1">
  <div class={cn(['mx-auto px-4', !fullWidth && 'lg:container'])}>
    <ol class="flex max-w-full overflow-x-scroll text-sm">
      {#each breadcrumbs as crumb (crumb)}
        <li
          class="flex gap-1 pr-1 after:text-gray-300 after:content-['/'] last:pr-0 last:after:hidden"
        >
          <!-- eslint-disable svelte/no-navigation-without-resolve -->
          <a class="text-blue-600 hover:underline" href={crumb.href}
            >{crumb.label}</a
          >
          <!-- eslint-enable svelte/no-navigation-without-resolve -->
        </li>
      {/each}
    </ol>
  </div>
</nav>
<main id="main">
  <header class="bg-gray-100 pt-3 pb-4">
    <div class={cn(['mx-auto px-4', !fullWidth && 'lg:container'])}>
      <h1 class="text-4xl leading-tight font-light">
        {pageTitle}
      </h1>
    </div>
  </header>
  <div class={cn(['mx-auto px-4 py-4', !fullWidth && 'lg:container'])}>
    {@render children()}
  </div>
</main>
