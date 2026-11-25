import { fileURLToPath } from 'node:url';

/**
 * Loads the built addon (dist/) into this demo Storybook.
 */
export function previewAnnotations(entry = []) {
  return [...entry, fileURLToPath(import.meta.resolve('../dist/preview.js'))];
}

export function managerEntries(entry = []) {
  return [...entry, fileURLToPath(import.meta.resolve('../dist/manager.js'))];
}
