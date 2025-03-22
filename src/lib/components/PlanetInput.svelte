<script lang="ts">
	import PositionInput from './PositionInput.svelte';
	import RetrogradeInput from './RetrogradeInput.svelte';

	const { keyName, data, showRetrograde = false } = $props();
</script>

<!-- Reuse PositionInput for degrees, minutes, and signs -->

{#if 'retrograde' in data && showRetrograde === true}
	<div class="flex flex-col gap-2 md:flex-row">
		<PositionInput {keyName} {data} />
		<RetrogradeInput {keyName} {data} />
	</div>
{:else}
	<PositionInput {keyName} {data} />
{/if}
