import type { DieValue } from './types';

export function randomNumber(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDieNumber(): DieValue {
	return randomNumber(1, 6) as DieValue;
}

export function sum(...args: number[]): number {
	return args.reduce((total, num) => total + num, 0);
}

export function createArray<T>(length = 0, fill: T | undefined = undefined): Array<T> {
	return Array(length).fill(fill);
}
