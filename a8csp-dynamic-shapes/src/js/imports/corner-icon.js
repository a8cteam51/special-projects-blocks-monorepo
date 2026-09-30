// WordPress dependencies.
import { SVG, Path } from '@wordpress/primitives';

export const CornerIcon = ( { corner } ) => {
	// Extract just the corner (tl, tr, bl, br) - ignore axis.
	const position = corner.slice( 1 );

	const path = {
		tl: 'M4.5 16.5H6v-9H4.5ZM7.5 6h9V4.5h-9z',
		tr: 'M7.5 6h9V4.5h-9zM18 7.5v9h1.5v-9z',
		bl: 'M7.5 19.5h9V18h-9zM4.5 16.5H6v-9H4.5Z',
		br: 'M18 7.5v9h1.5v-9zM7.5 19.5h9V18h-9z',
	}[ position ];

	return (
		<SVG
			aria-hidden="true"
			className="spacing-sizes-control__icon dynamic-shapes-corner-icon"
			height="24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M7.5 6h9V4.5h-9zM18 7.5v9h1.5v-9zm-10.5 12h9V18h-9zm-3-3H6v-9H4.5Z"
				style={ { opacity: '.25' } }
			/>
			<Path d={ path } />
		</SVG>
	);
};
