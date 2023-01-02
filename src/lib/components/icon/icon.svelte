<script lang="ts">
	import './library';
	import type { IconName } from '@fortawesome/fontawesome-svg-core';
	import {
		findIconDefinition as faFindIconDefinition,
		icon as faIcon
	} from '@fortawesome/fontawesome-svg-core';

	export let icon: IconName;

	const iconDef = faFindIconDefinition({ prefix: 'fas', iconName: icon });
</script>

{@html faIcon(iconDef).html}
