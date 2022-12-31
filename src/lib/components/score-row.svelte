<script lang='ts'>
    export let order: 'asc' | 'desc' = 'asc';
    export let color = "yellow";

    const boxes = Array(11).fill(0).map((_, i) => i + 2)
</script>

<div class="score-row">
{#each boxes as box}
    {box}
{/each}
Lock
</div>

<style>
    .score-row {
        border: 1px solid blue;
    }
</style>