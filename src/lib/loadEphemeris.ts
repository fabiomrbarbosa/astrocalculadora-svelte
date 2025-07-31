// FILE: src/lib/loadEphemeris.ts
import { syncEphToChartData } from '$lib/syncEphToChartData';
import { chartData } from '$lib/chartData.svelte';
import { calculateAll } from '$lib/calcs';

/**
 * Fetches the full ephemeris (including prenatal syzygy) and syncs into chartData
 */
export async function loadEphemeris(date: string, time: string, city: string, country: string) {
	// 1) fetch the combined birth-chart + syzygy
	const res = await fetch('/api/ephemeris', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ date, time, city, country })
	});
	if (!res.ok) throw new Error(await res.text());
	const eph = await res.json();

	// 2) sync the main chart into your store
	chartData.meta.city = city;
	chartData.meta.country = country;
	syncEphToChartData(eph);
	chartData.rawEphemeris = eph;

	// 3) final recalculation (includes syzygy in aspects, tables, etc.)
	calculateAll();
}
