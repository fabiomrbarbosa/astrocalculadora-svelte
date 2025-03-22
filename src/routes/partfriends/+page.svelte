<script>
	import { calculatePartFriends } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Friends Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartFriends} use:usePreventDefault>
		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="mercury" data={chartData.planets.mercury} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte dos Amigos</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partFriends}
		<div id="partFriendsResults" class="result">{chartData.results.partFriends}</div>
	{/if}
</div>
