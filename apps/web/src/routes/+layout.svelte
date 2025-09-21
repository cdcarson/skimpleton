<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Toast from '$lib/ui/toast/Toast.svelte';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<form method="post" action="/auth">
  <button class="button" type="submit">Login</button>
</form>
{@render children?.()}

<Toast />
