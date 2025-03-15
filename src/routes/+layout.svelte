<script lang="ts">
	import { chartData } from '$lib/store.svelte';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
