/**
 * Generate a unique ID.
 */
export const createUid = ( length = 32 ) => {
	// Inspired by https://developer.wordpress.org/reference/functions/wp_generate_password
	const chars =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let uid = '';

	for ( let i = 0; i < length; i++ ) {
		uid += chars.charAt( Math.floor( Math.random() * chars.length ) );
	}

	return uid;
};
