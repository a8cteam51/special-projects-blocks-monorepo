/**
 * Registers the Photo Carousel block and the caption box on its images.
 * Dynamic: render.php renders the front end. Credits load separately, from
 * src/credits, only while Newspack is active.
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import '../editor/image-caption-panel';
import metadata from './block.json';
import Edit from './edit';
import transforms from './transforms';
import './style.scss';
import './editor.scss';

registerBlockType( metadata, {
	edit: Edit,
	save: () => <InnerBlocks.Content />,
	transforms,
} );
