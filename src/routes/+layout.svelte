<script lang="ts">
	import { store } from '$lib/store.svelte';
	import '../app.css';
	let { children } = $props();
	$inspect(store);
</script>

{@render children()}
