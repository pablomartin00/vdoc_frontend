// src/stores/messagesStore.ts
import { writable } from 'svelte/store';

export const messages = writable([]);
export const userMessage = writable('');
export const isFirstMessage = writable(true);
export const selectedPatient = writable('');
export const patientFileContent = writable('');

export function addMessage(role: string, content: string) {
    messages.update((msgs) => [...msgs, { role, content }]);
}
