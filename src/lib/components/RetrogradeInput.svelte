<script lang="ts">
	const { keyName, data } = $props();
</script>

<label class="select w-full md:w-1/3">
	<span class="label">Direção</span>
	<select
		id="{keyName}Retrograde"
		name="{keyName}Retrograde"
		class="select"
		bind:value={data.retrograde}
	>
		<option value={false}>Directo</option>
		<option value={true}>Retrógrado</option>
	</select></label
>
