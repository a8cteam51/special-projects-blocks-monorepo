import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { registerBlockVariation } from '@wordpress/blocks';
import { useEntityProp } from '@wordpress/core-data';

const NewsLink = withSelect( ( select ) => {
	return {
		postType: select('core/editor').getCurrentPostType(),
		postId:  select("core/editor").getCurrentPostId(),
	};
} ) ( ( props ) => {
	
	const { postType, postId } = props;

	const supportedPostTypes = override_post_links_post_types || [];

	if ( ! supportedPostTypes.includes( postType ) ) {
		return null;
	}

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const setData = ( key, value ) => {
		const metaData = {
			source: '',
			url: '',
			...meta?.wpcomsp_news_data,
		};

		metaData[ key ] = value;

		setMeta( { wpcomsp_news_data: metaData } );
	}

	return (
		<PluginDocumentSettingPanel
			name="override-post-links-news-links"
			title={ __( 'News Link', 'override-post-links' ) }
			className="override-post-links-news-links"
		>
			<TextControl
				label={ __( 'Source', 'override-post-links' ) }
				value={ meta?.wpcomsp_news_data?.source }
				onChange={ ( value ) => setData( 'source', value ) }
			/>
			<TextControl
				label={ __( 'URL', 'override-post-links' ) }
				value={ meta?.wpcomsp_news_data?.url }
				onChange={ ( value ) => setData( 'url', value ) }
				type='url'
			/>
		</PluginDocumentSettingPanel>
	);
} );


const wpcomspNewsLinkSettingsPanel = () => (
	<NewsLink />
);

registerPlugin( 'wpcomsp-newslink', {
	render: wpcomspNewsLinkSettingsPanel,
} );

registerBlockVariation( 'core/paragraph', {
	name: 'wpcomsp/news-link-source',
	title: __( 'News Link Source', 'override-post-links' ),
	icon: 'tag',
	attributes: {
		metadata: {
			bindings: {
				content: { source: 'wpcomsp/news-link-source' },
			},
		},
		content: __( 'Article external news source', 'override-post-links' ),
	},
} );
