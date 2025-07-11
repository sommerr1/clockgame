export const CLOCK_SIZE = 500; // SVG canvas size - increased from 400
export const CENTER = CLOCK_SIZE / 2;
export const CLOCK_RADIUS = CLOCK_SIZE / 2 - 15; // Main clock face radius, adjusted for new size

export const HOUR_HAND_LENGTH = CLOCK_RADIUS * 0.5;
export const MINUTE_HAND_LENGTH = CLOCK_RADIUS * 0.75;

// NUMBER_RADIUS defines how far from the center the numbers (1-12) are placed.
// CLOCK_RADIUS - 35 was chosen to provide some padding from the edge.
// With CLOCK_RADIUS = 235 (for CLOCK_SIZE=500), NUMBER_RADIUS = 200.
// Font size is NUMBER_RADIUS * 0.22, so 200 * 0.22 = 44px. This should scale well.
export const NUMBER_RADIUS = CLOCK_RADIUS - 35; // Radius for placing numbers 1-12. Adjusted for padding and new size.