<script lang="ts">
	import PositionInput from './PositionInput.svelte';
	import RetrogradeInput from './RetrogradeInput.svelte';

	let { keyName, data = $bindable(), showRetrograde = false } = $props();
</script>

<!-- Reuse PositionInput for degrees, minutes, and signs -->

{#if 'retrograde' in data && showRetrograde === true}
	<div class="flex flex-col gap-2 md:flex-row">
		<PositionInput {keyName} bind:data />
		<RetrogradeInput {keyName} bind:data />
	</div>
{:else}
	<PositionInput {keyName} bind:data />
{/if}
