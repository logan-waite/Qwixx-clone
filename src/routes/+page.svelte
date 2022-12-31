<script lang='ts'>
import Die from '$lib/components/die.svelte';
import ScoreRow from '$lib/components/score-row.svelte';
</script>

<h1 class="title">Qwix!</h1>
<div class="dice-tray">
    <Die></Die>
    <Die value={2}></Die>
    <Die value={3} color='red' pipColor="white"></Die>
    <Die value={4} color='yellow'></Die>
    <Die value={5} color='green' pipColor="white"></Die>
    <Die value={6} color='blue' pipColor="white"></Die>
</div>
<!-- <div class="actions">
    <button>Roll</button>
</div> -->
<div class="scorecard">
    <ScoreRow></ScoreRow>
    <ScoreRow></ScoreRow>
    <ScoreRow></ScoreRow>
    <ScoreRow></ScoreRow>
</div>

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .dice-tray {
        box-sizing: border-box;
        border: 1px solid gray;
        width: 512;
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

    }
</style>

