<script lang="ts">
	import Die from '$lib/components/die.svelte';
	import ScoreRow from '$lib/components/score-row.svelte';
</script>

<h1 class="title">Qwix!</h1>
<div class="dice-tray">
	<Die value={1} />
	<Die value={2} />
	<Die value={3} color="red" pipColor="white" />
	<Die value={4} color="yellow" />
	<Die value={5} color="green" pipColor="white" />
	<Die value={6} color="blue" pipColor="white" />
</div>
<!-- <div class="actions">
    <button>Roll</button>
</div> -->
<div class="scorecard">
	<ScoreRow color="red" ascOrder={true} />
	<ScoreRow color="yellow" ascOrder={true} />
	<ScoreRow color="green" ascOrder={false} />
	<ScoreRow color="blue" ascOrder={false} />
</div>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: lightgray;
	}
	.dice-tray {
		box-sizing: border-box;
		border: 1px solid gray;
		width: 512px;
		max-width: 100%;
		height: fit-content;
		min-height: 192px;
		border-radius: 25px;
		box-shadow: 5px 5px 8px gray inset;
		background-color: darkgray;
		padding: 15px;
		display: flex;
		flex-wrap: wrap;
	}
	.scorecard {
		/* width: 512px; */
		padding: 10px;
		margin-top: 10px;
	}
</style>
