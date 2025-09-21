<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    title: string;
    breadcrumbs: {
      label: string;
      href: string;
    }[];
  };

  let { children, title, breadcrumbs }: Props = $props();
</script>

<svelte:head>
  <title>{title} | Skimpleton</title>
</svelte:head>

{#if breadcrumbs.length > 0}
  <nav class="bg-gray-100 pt-4">
    <div class="container mx-auto overflow-x-scroll px-4">
      <ul class="flex items-center text-sm">
        {#each breadcrumbs as breadcrumb}
          <li class="after:content-['/'] after:mx-2 after:text-gray-400 last:after:hidden">
            <a class=" text-blue-700 hover:underline" href={breadcrumb.href}
              >{breadcrumb.label}</a
            >
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{/if}

<main id="page-main">
  <header class="bg-gray-100 py-4">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-medium">{title}</h1>
    </div>
  </header>
  <div class="container mx-auto px-4 py-4">
    {@render children()}
  </div>
</main>
