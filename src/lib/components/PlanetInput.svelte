<script>
	import AstroPosition from './AstroPosition.svelte';

	export let keyName;
	export let data; // Planet object
</script>

<fieldset class="fieldset rounded border p-2">
	<legend>{data.label}</legend>

	<!-- Reuse AstroPosition for degrees, minutes, and signs -->
	<AstroPosition {keyName} {data} />

	{#if 'retrograde' in data}
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
</fieldset>
