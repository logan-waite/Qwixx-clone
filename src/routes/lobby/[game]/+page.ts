import type { PageLoad } from './$types';

export const load = (({ params }) => {
	return {
		gameCode: params.game
	};
}) satisfies PageLoad;
