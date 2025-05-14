import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		backgroundColor,
		backgroundColorHover,
		borderColor,
		borderRadius,
		borderWidth,
		iconUpload,
		useCustomIcon,
		iconColor,
		buttonPosition,
		buttonFloatingRight,
		buttonFloatingBottom,
	} = attributes;

	return (
		<div { ...useBlockProps.save() } className="scroll-to-top-container">
			<button
				className="scroll-to-top-button"
				style={ {
					borderColor,
					borderRadius: `${ borderRadius }px`,
					borderWidth: `${ borderWidth }px`,
					position: buttonPosition === 'fixed' ? 'fixed' : 'relative',
					right:
						buttonPosition === 'fixed'
							? `${ buttonFloatingRight }px`
							: 'auto',
					bottom:
						buttonPosition === 'fixed'
							? `${ buttonFloatingBottom }px`
							: 'auto',
				} }
				data-position={ buttonPosition }
			>
				{ ! iconUpload && ! useCustomIcon ? ( // Render SVG icon if no image is uploaded
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="17"
						viewBox="0 0 16 17"
						fill="none"
					>
						<path
							transform="rotate(180 8 8.5)"
							d="M7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L8 14.5858L2.34315 8.92893C1.95262 8.53841 1.31946 8.53841 0.928932 8.92893C0.538408 9.31946 0.538408 9.95262 0.928932 10.3431L7.29289 16.7071ZM7 0L7 16H9V0L7 0Z"
							fill={ iconColor }
						/>
					</svg>
				) : (
					<img
						src={ iconUpload ? iconUpload.url : '' }
						alt={ iconUpload ? iconUpload.alt : '' }
						style={ { maxWidth: '20px' } }
					/>
				) }
			</button>
			<style>
				{ `
                    .scroll-to-top-button {
						background-color: ${ backgroundColor };
					}
                    .scroll-to-top-button:hover {
                        background-color: ${ backgroundColorHover };
                    }
                ` }
			</style>
		</div>
	);
}
