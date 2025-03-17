<script>
	import { chartData } from '$lib/store.svelte';

	export let keyName; // e.g., "sun", "house2Cusp"
	export let data; // The object (planet, point, cusp)

	// Function to handle input (allows typing freely)
	function handleInput(event, type) {
		let value = event.target.value.replace(/^0+(?=\d)/, ''); // Remove leading zeros
		if (value === '' || /^\d+$/.test(value)) {
			data[type] = value;
		}
	}

	// Function to enforce valid range when user leaves the input
	function enforceRange(type, min, max) {
		let value = parseInt(data[type], 10);
		if (isNaN(value) || value < min) {
			data[type] = min;
		} else if (value > max) {
			data[type] = max;
		} else {
			data[type] = value;
		}
	}
</script>

<div class="astro-position">
	<label class="fieldset-label" for="{keyName}Degrees">Graus</label>
	<input
		id="{keyName}Degrees"
		name="{keyName}Degrees"
		type="number"
		bind:value={data.degrees}
		max="29"
		min="0"
		placeholder="Graus"
		class="input"
		inputmode="numeric"
		required
		on:input={(e) => handleInput(e, 'degrees')}
		on:blur={() => enforceRange('degrees', 0, 29)}
	/>

	<label class="fieldset-label" for="{keyName}Minutes">Minutos</label>
	<input
		id="{keyName}Minutes"
		name="{keyName}Minutes"
		type="number"
		bind:value={data.minutes}
		max="59"
		min="0"
		placeholder="Minutos"
		class="input"
		inputmode="numeric"
		required
		on:input={(e) => handleInput(e, 'minutes')}
		on:blur={() => enforceRange('minutes', 0, 59)}
	/>

	<label class="fieldset-label" for="{keyName}Sign">Signo</label>
	<select id="{keyName}Sign" name="{keyName}Sign" bind:value={data.sign} class="select">
		{#each Object.entries(chartData.signs) as [signKey, sign]}
			<option value={signKey}>{sign.icon} {sign.label}</option>
		{/each}
	</select>
</div>
