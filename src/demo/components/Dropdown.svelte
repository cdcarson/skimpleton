<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tabbable, type FocusableElement } from 'tabbable';

  type Props = {
    id: string;
    children: Snippet;
    placement?:
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'top'
      | 'top-start'
      | 'top-end';
  };

  let { id, children, placement = 'bottom-start' }: Props = $props();

  let popoverEl: HTMLElement | undefined = $state();

  const getFocusableItems = (): FocusableElement[] =>
    popoverEl ? tabbable(popoverEl) : [];

  const dismissIfInteractive = (target: HTMLElement | null) => {
    if (target?.closest('a, button')) {
      popoverEl?.hidePopover();
    }
  };

  const onToggle = (event: ToggleEvent) => {
    if (event.newState === 'open') {
      getFocusableItems()[0]?.focus();
    }
  };

  const onContentClick = (event: MouseEvent) => {
    dismissIfInteractive(event.target as HTMLElement | null);
  };

  const onContentKeydown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      const items = getFocusableItems();
      if (items.length === 0) return;
      const current = items.indexOf(document.activeElement as FocusableElement);
      const next = key === 'ArrowDown' ? current + 1 : current - 1;
      const wrapped = (next + items.length) % items.length;
      items[wrapped]?.focus();
      return;
    }

    if (key === 'Tab') {
      event.preventDefault();
      const items = getFocusableItems();
      if (items.length === 0) return;
      const current = items.indexOf(document.activeElement as FocusableElement);
      const next = event.shiftKey ? current - 1 : current + 1;
      const wrapped = (next + items.length) % items.length;
      items[wrapped]?.focus();
    }
  };
</script>

<div
  {id}
  popover="auto"
  class="dropdown-popover {placement}"
  style="position-anchor: --{id}-anchor"
  bind:this={popoverEl}
  ontoggle={onToggle}
  onclick={onContentClick}
  onkeydown={onContentKeydown}
  role="menu"
  tabindex="-1"
>
  <div class="dropdown-content">
    {@render children()}
  </div>
</div>
