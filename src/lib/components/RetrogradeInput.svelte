<script lang="ts">
	const { keyName, data, showRetrograde = false } = $props();
</script>

{#if 'retrograde' in data && showRetrograde === true}
	<label class="fieldset-label" for="{keyName}Retrograde">Movimento</label>
	<select
		id="{keyName}Retrograde"
		name="{keyName}Retrograde"
		class="select"
		bind:value={data.retrograde}
	>
		<option value={false}>Directo</option>
		<option value={true}>Retrógrado</option>
	</select>
{/if}
