<script>
	import { calculatePartFriends } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Friends Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartFriends} use:usePreventDefault>
		<AstroInput keyName="moon" bind:data={chartData.planets.moon} />
		<AstroInput keyName="mercury" bind:data={chartData.planets.mercury} />
		<AstroInput keyName="ascendant" bind:data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte dos Amigos</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partFriends}
		<div id="partFriendsResults" class="result">{chartData.results.partFriends}</div>
	{/if}
</div>
