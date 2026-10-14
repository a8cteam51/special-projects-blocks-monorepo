/**
 * Pause and play glyphs for the pause button, shared by the front-end script
 * and the editor preview so both draw the same icon.
 *
 * Each is a filled circle in `currentColor` with the bars or triangle cut out
 * (Material "pause_circle_filled" / "play_circle_filled"), so the button's
 * background shows through the cut-out.
 */
export const PAUSE_ICON_PATH =
	'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z';

export const PLAY_ICON_PATH =
	'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z';
