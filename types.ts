export type DifficultyLevel = 1 | 2 | 3;

export interface Time {
  hour: number; // 0-11 (0 represents 12 o'clock on the analog face)
  minute: number; // 0-59
}

export interface Task {
  id: number;
  targetHour: number; // Level 1: 0-11 (0 for 12). Level 2/3: 0-23.
  targetMinute: number; // 0-59
  description: string; // User-facing description, e.g., "3 часа 00 минут" or "15 часов 00 минут"
}
