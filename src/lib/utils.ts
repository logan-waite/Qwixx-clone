import type { DieValue, Color } from './types';

export function randomNumber(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDieNumber(): DieValue {
	return randomNumber(1, 6) as DieValue;
}

export function max(...args: Array<number | null>): number {
	return args.reduce(
		(max: number, val: number | null) => (val != null && val > max ? val : max),
		-Infinity
	);
}

export function min(...args: Array<number | null>): number {
	return args.reduce(
		(min: number, val: number | null) => (val != null && val < min ? val : min),
		Infinity
	);
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

export function sum(...args: number[]): number {
	return args.reduce((total, num) => total + num, 0);
}

export function createArray<T>(length = 0, fill: T | undefined = undefined): Array<T> {
	return Array(length).fill(fill);
}

export function objectsAreEqual<T extends object>(a: T | null, b: T | null) {
	// currently a shallow comparison

	// check if both are null if one is
	if (a === null || b === null) {
		if (a !== b) {
			return false;
		}
	}
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	// check same number of props
	if (aKeys.length !== bKeys.length) {
		return false;
	}

	// check has same props
	const aKeysSet = new Set(aKeys);
	for (const v of bKeys) {
		aKeysSet.add(v);
	}

	if (aKeysSet.size !== aKeys.length) {
		return false;
	}

	// check if values are the same
	for (const key in a) {
		if (a[key] !== b[key]) {
			return false;
		}
	}

	return true;
}
