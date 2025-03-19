import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<progress value={ 0.5 }></progress>
		</div>
	);
}
