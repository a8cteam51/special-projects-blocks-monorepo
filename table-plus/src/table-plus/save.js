import { InnerBlocks } from '@wordpress/block-editor';

// Dynamic block — render.php produces the final <table> with grouped
// thead/tbody/tfoot. Persist inner blocks so they remain editable.
export default function save() {
	return <InnerBlocks.Content />;
}
