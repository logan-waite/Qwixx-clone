import type { Color, DieValue } from '$lib/types';
import { randomNumber } from '$lib/utils/base';

export function randomDieNumber(): DieValue {
	return randomNumber(1, 6) as DieValue;
}

export function getValueByColor(color: Color) {
	return function getValue<T extends { color: Color; value: number }>(container: T | T[] | null) {
		if (Array.isArray(container)) {
			const colorObj = container.find((v) => v.color === color);
			return colorObj?.value ?? null;
		} else if (container?.color && container.color === color) {
			return container.value;
		} else {
			return null;
		}
	};
}
