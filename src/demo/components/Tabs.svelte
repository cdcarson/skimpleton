<script lang="ts">
  import { uniqueId, cn } from '$demo/utils.js';
  import type { Snippet } from 'svelte';

  type Tab = {
    label: string;
    snippet: Snippet;
  };
  type IdedTab = Tab & {
    id: string;
  };
  type Props = {
    tabs: Tab[];
  };
  let { tabs: rawTabs }: Props = $props();
  const id = uniqueId();
  let tabs: IdedTab[] = $derived(
    rawTabs.map((t, i) => {
      return {
        ...t,
        id: id + `-tab-${i}`
      };
    })
  );
  let index = $state(0);
</script>

<div class="mb-4 flex h-8 items-stretch justify-start border-b border-gray-300">
  {#each tabs as tab, i (tab.id)}
    <label
      class={cn([
        'relative top-px flex cursor-pointer items-center border-b border-transparent px-4 text-xs text-gray-600 transition-all  hover:text-gray-800',
        i === index && 'border-black text-black'
      ])}
      for={tab.id}
    >
      {tab.label}
    </label>
  {/each}
</div>

{#each tabs as tab, i (tab.id)}
  <div>
    <input
      id={tab.id}
      value={i}
      type="radio"
      name="tabs"
      class={cn(['hidden', 'peer'])}
      bind:group={index}
    />
    <div class="hidden peer-checked:block">
      {@render tab.snippet()}
    </div>
  </div>
{/each}
