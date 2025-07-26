<script lang="ts">
	import { onMount, tick } from 'svelte';

	let id = 'astro-chart';
	let width = 600;
	let height = 600;

	// data should contain:
	// - points: [{ name: 'Sun', angle: 90 }, ...]
	// - cusps:  [{ angle: 0 }, { angle: 30 }, ..., { angle: 330 }]
	// - ascendant, midheaven
	let data = {
		points: [
			{ name: 'Sun', angle: 10 },
			{ name: 'Moon', angle: 130 },
			{ name: 'Mercury', angle: 85 },
			{ name: 'Venus', angle: 60 },
			{ name: 'Mars', angle: 250 },
			{ name: 'Jupiter', angle: 195 },
			{ name: 'Saturn', angle: 300 }
		],
		cusps: [
			{ angle: 300 },
			{ angle: 340 },
			{ angle: 30 },
			{ angle: 60 },
			{ angle: 75 },
			{ angle: 90 },
			{ angle: 116 },
			{ angle: 172 },
			{ angle: 210 },
			{ angle: 236 },
			{ angle: 250 },
			{ angle: 274 }
		]
	};

	onMount(() => {
		const script = document.createElement('script');
		script.src = '/astrochart2.js';
		script.async = true;

		script.onload = async () => {
			if (!window.astrology) {
				console.error('Astrology library failed to load.');
				return;
			}

			await tick(); // ensure all reactive values are resolved

			try {
				const universe = new window.astrology.Universe(id);
				universe.radix().setData(data);
			} catch (e) {
				console.error('Chart rendering failed:', e);
			}
		};

		document.body.appendChild(script);
	});

	let city = '';
	let country = '';

	let day = '';
	let month = '';
	let year = '';
	let hour = '';
	let minute = '';
	let second = '';

	async function submitChart() {
		const date = `${safeYear(year)}-${safePad(month, 1, 12)}-${safePad(day, 1, 31)}`;
		const time = `${safePad(hour, 0, 23)}:${safePad(minute, 0, 59)}:${safePad(second, 0, 59)}`;

		try {
			const res = await fetch('/api/ephemeris', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date, time, city, country })
			});
			if (!res.ok) throw new Error(await res.text());

			const result = await res.json();
			console.log('Chart result:', result);
		} catch (err) {
			console.error('Error fetching chart:', err);
		}
	}

	function safePad(value: string, min: number, max: number, fallback = '00') {
		const num = Number(value);
		if (Number.isNaN(num) || num < min || num > max) return fallback;
		return String(num).padStart(2, '0');
	}

	function safeYear(value: string) {
		const num = Number(value);
		return Number.isNaN(num) || num < 0 ? '0000' : String(num).padStart(4, '0');
	}
</script>

<form
	class="bg-base-200 mx-auto max-w-md space-y-4 rounded-xl p-4 shadow"
	on:submit|preventDefault={submitChart}
>
	<h2 class="text-xl font-bold">Birth Data</h2>

	<div class="space-y-2">
		<input type="text" placeholder="City" bind:value={city} class="input input-bordered w-full" />
		<input
			type="text"
			placeholder="Country"
			bind:value={country}
			class="input input-bordered w-full"
		/>
	</div>

	<div class="flex space-x-2">
		<input
			type="number"
			min="1"
			max="31"
			placeholder="Day"
			bind:value={day}
			class="input input-bordered w-full"
		/>
		<input
			type="number"
			min="1"
			max="12"
			placeholder="Month"
			bind:value={month}
			class="input input-bordered w-full"
		/>
		<input
			type="number"
			min="0"
			max="9999"
			placeholder="Year"
			bind:value={year}
			class="input input-bordered w-full"
		/>
	</div>

	<div class="flex space-x-2">
		<input
			type="number"
			min="0"
			max="23"
			placeholder="Hour"
			bind:value={hour}
			class="input input-bordered w-full"
		/>
		<input
			type="number"
			min="0"
			max="59"
			placeholder="Minute"
			bind:value={minute}
			class="input input-bordered w-full"
		/>
		<input
			type="number"
			min="0"
			max="59"
			placeholder="Second"
			bind:value={second}
			class="input input-bordered w-full"
		/>
	</div>

	<button type="submit" class="btn btn-primary w-full">Generate Chart</button>
</form>

<div id="astro-chart"></div>
