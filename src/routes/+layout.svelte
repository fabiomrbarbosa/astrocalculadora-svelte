<script lang="ts">
	import { astroData } from '$lib/store.svelte';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
