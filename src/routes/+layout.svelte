<script lang="ts">
  import AppMessage from '$demo/components/AppMessage.svelte';
  import '../demo/css/layout.css';

  const { children } = $props();
</script>

{@render children()}

<AppMessage />
