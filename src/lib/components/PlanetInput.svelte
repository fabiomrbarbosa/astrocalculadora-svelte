<script lang="ts">
	import AstroPosition from './AstroPosition.svelte';

	const { keyName, data, showRetrograde = false } = $props();
</script>

<fieldset class="fieldset rounded border p-2">
	<legend>{data.label}</legend>

	<!-- Reuse AstroPosition for degrees, minutes, and signs -->
	<AstroPosition {keyName} {data} />
</fieldset>
