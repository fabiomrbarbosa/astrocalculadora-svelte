<script lang="ts">
	import PositionInput from './PositionInput.svelte';

	const { keyName, data, showRetrograde = false } = $props();
</script>

<fieldset class="fieldset rounded border p-2">
	<legend>{data.label}</legend>

	<!-- Reuse PositionInput for degrees, minutes, and signs -->
	<PositionInput {keyName} {data} />
</fieldset>
