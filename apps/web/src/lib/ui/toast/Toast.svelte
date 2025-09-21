<script lang="ts">
  import { ToastService, type ToastMessageData } from '@skimpleton/forms';
  import { cn } from '../cn.js';

  type Props = {
    flashMessage?: ToastMessageData;
  };

  let { flashMessage }: Props = $props();

  const messageService = ToastService.get();

  let flashMessageShown = $state(false);

  $effect(() => {
    if (flashMessage && !flashMessageShown) {
      messageService.setMessage(flashMessage);
      flashMessageShown = true;
    }
  });

  // Add IDs to messages for keyed each block
  let messagesWithIds = $derived(
    messageService.mostRecent.map((message) => ({
      ...message,
      _id: `toast-${Math.random().toString(36).substring(2, 8)}`
    }))
  );

  let currentMessage = $derived(messageService.current);

  const getAriaLabel = (message: ToastMessageData): string => {
    switch (message.type) {
      case 'success':
        return `Success: ${message.message}`;
      case 'error':
        return `Error: ${message.message}`;
      case 'wait':
        return `Status: ${message.message}`;
      default:
        return message.message;
    }
  };

  const dismissMessage = () => {
    messageService.clear();
  };

  const slide = (_node: HTMLElement, opts?: { duration: number }) => {
    const mergedOpts = { duration: 250, ...opts };
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const calculatedDuration =
      mediaQuery && mediaQuery.matches ? 0 : mergedOpts.duration;

    return {
      delay: 0,
      duration: calculatedDuration,
      css: (t: number) => {
        const translateY = `${100 - t * 100}%`;
        return `transform: translateY(${translateY})`;
      }
    };
  };
</script>

<!-- Current message display -->
{#if currentMessage}
  <div
    class="fixed right-4 bottom-4 z-[30000] w-80 max-w-[calc(100vw-2rem)]"
    role="status"
    aria-live="polite"
    aria-label={getAriaLabel(currentMessage)}
    in:slide
    out:slide
  >
    <div
      class={cn(
        'flex items-center gap-2 rounded p-3 text-white shadow-lg',
        currentMessage.type === 'wait' && 'bg-gray-100 text-gray-900',
        currentMessage.type === 'success' && 'bg-green-700',
        currentMessage.type === 'error' && 'bg-red-700',
        !currentMessage.type && 'bg-black'
      )}
    >
      <span
        class={cn(
          'size-4 shrink-0',
          currentMessage.type === 'success' && 'icon-[bi--check-circle]',
          currentMessage.type === 'error' && 'icon-[bi--exclamation-circle]',
          currentMessage.type === 'wait' && 'icon-[bi--hourglass] animate-spin'
        )}
      ></span>
      <div class="flex-1 text-sm font-medium">
        {currentMessage.message}
      </div>
      {#if currentMessage.type === 'success' || currentMessage.type === 'error'}
        <button
          class={cn(
            'ml-auto shrink-0 opacity-70 transition-opacity hover:opacity-100',
            'focus:outline-2 focus:outline-offset-2 focus:outline-current'
          )}
          onclick={dismissMessage}
          aria-label="Dismiss message"
          type="button"
        >
          <span class="icon-[bi--x] size-5"></span>
        </button>
      {/if}
    </div>
  </div>
{/if}

<!-- Visually hidden recent messages list for accessibility -->
<div
  class="sr-only"
  aria-live="polite"
  aria-label="Recent application messages"
  role="log"
>
  {#each messagesWithIds as message (message._id)}
    <div aria-label={getAriaLabel(message)}>
      {message.message}
    </div>
  {/each}
</div>
