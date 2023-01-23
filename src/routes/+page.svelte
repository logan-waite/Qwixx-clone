<script lang="ts">
	import DefaultButton from '$lib/components/default-button.svelte';
	import { setupGameStore } from '$lib/stores';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	let gameCode: string;

	/** 
    On Create Game:
    - Check Server for available codes
    - If no codes, show error
    - If available codes:
        - Navigate to lobby page
    */

	/**
	 * On Join Game:
	 * - Check server if code is active
	 * - If not active, show error
	 * - If active:
	 *   - Join Lobby for code
	 */
</script>

<main class="entry-wrapper">
	<DefaultButton on:click={() => setupGameStore()}>Create Game</DefaultButton>
	<div class="form-group">
		<input type="text" placeholder="Join Game Code" bind:value={gameCode} />
		<DefaultButton on:click={() => setupGameStore(gameCode)}>
			<FontAwesomeIcon icon="chevron-right" />
		</DefaultButton>
	</div>
</main>

<style>
	.entry-wrapper {
		display: flex;
		flex-direction: column;
	}
	.form-group {
		display: flex;
	}
	.form-group input {
		border-radius: 10px;
		font-size: 16pt;
	}
</style>
