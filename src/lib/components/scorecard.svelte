<script lang="ts">
	import ScoreRow from '$lib/components/score-row.svelte';
</script>

<div class="scorecard">
	<ScoreRow color="red" ascOrder={true} />
	<ScoreRow color="yellow" ascOrder={true} />
	<ScoreRow color="green" ascOrder={false} />
	<ScoreRow color="blue" ascOrder={false} />
</div>
