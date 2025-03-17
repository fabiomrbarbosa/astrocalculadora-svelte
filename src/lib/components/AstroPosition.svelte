<script lang="ts">
	import { chartData } from '$lib/store.svelte';
	const { keyName, data } = $props();

	// Function to handle input (allows typing freely)
	function handleInput(event: Event, type: keyof typeof data) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/^0+(?=\d)/, ''); // Remove leading zeros

		if (value === '' || /^\d+$/.test(value)) {
			data[type] = parseInt(value, 10) || 0; // Ensure it's a number
		}
	}

	// Function to enforce valid range when user leaves the input
	function enforceRange(type: keyof typeof data, min: number, max: number) {
		let value = parseInt(data[type] as unknown as string, 10);

		if (isNaN(value) || value < min) {
			data[type] = min;
		} else if (value > max) {
			data[type] = max;
		} else {
			data[type] = value; // Ensure it remains a number
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
		oninput={(e) => handleInput(e, 'degrees')}
		onblur={() => enforceRange('degrees', 0, 29)}
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
		oninput={(e) => handleInput(e, 'minutes')}
		onblur={() => enforceRange('minutes', 0, 59)}
	/>

	<label class="fieldset-label" for="{keyName}Sign">Signo</label>
	<select id="{keyName}Sign" name="{keyName}Sign" bind:value={data.sign} class="select">
		{#each Object.entries(chartData.signs) as [signKey, sign]}
			<option value={signKey}>{sign.icon} {sign.label}</option>
		{/each}
	</select>
</div>
