<script lang="ts">
	import { signs } from '$lib/staticData';
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

<div class="astro-position flex w-full flex-col gap-2 md:flex-row">
	<label class="input w-full">
		<span class="label">Graus</span>
		<input
			id="{keyName}Degrees"
			name="{keyName}Degrees"
			type="number"
			bind:value={data.degrees}
			max="29"
			min="0"
			placeholder="Graus"
			inputmode="numeric"
			required
			oninput={(e) => handleInput(e, 'degrees')}
			onblur={() => enforceRange('degrees', 0, 29)}
		/>
	</label>

	<label class="input w-full">
		<span class="label">Minutos</span>
		<input
			id="{keyName}Minutes"
			name="{keyName}Minutes"
			type="number"
			bind:value={data.minutes}
			max="59"
			min="0"
			placeholder="Minutos"
			inputmode="numeric"
			required
			oninput={(e) => handleInput(e, 'minutes')}
			onblur={() => enforceRange('minutes', 0, 59)}
		/></label
	>

	<label class="select w-full">
		<span class="label">Signo</span>
		<select id="{keyName}Sign" name="{keyName}Sign" bind:value={data.sign}>
			{#each Object.entries(signs) as [signKey, sign]}
				<option value={signKey}>{sign.icon} {sign.label}</option>
			{/each}
		</select></label
	>
</div>
