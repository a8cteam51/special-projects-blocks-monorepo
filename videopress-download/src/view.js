import { store, getContext, getElement } from '@wordpress/interactivity';

function waitVideoData( post_id, guid ) {
    return new Promise( ( resolve ) => {
		let rounds = 0;

		const intervalId = setInterval( () => {
			const localStorageData = localStorage.getItem(`vpc-playback-${post_id}-${guid}`);

			if ( localStorageData ) {
				clearInterval( intervalId );
				resolve( localStorageData );
			}

			if ( ++rounds === 15 ) {
				clearInterval( intervalId );
				resolve(false);
			}
		}, 250 );
    } );
}

const { callbacks } = store( 'wpcomsp/video-download-link', {
	callbacks: {
		setVideoLink( href ) {
			const { ref } = getElement();
			const context = getContext();

			context.isReady = true;

			ref.setAttribute('href', href);
			ref.setAttribute('download', '');
			ref.setAttribute('target', '_blank');
		},
		setVideoError() {
			const { ref } = getElement();
			const context = getContext();

			context.isError = true;
			context.text = context.isErrorText;
			ref.removeAttribute('href');
		},
		getVideoLink() {
			const context = getContext();
			const { src } = context;

			if ( src ) {
				callbacks.setVideoLink( src );
			} else {
				callbacks.setVideoError();
			}
		},
		asycGetVideoLink: function* () {
			const context = getContext();
			const { post_id, guid, src } = context;

			let videoData;

			yield waitVideoData( post_id, guid ).then( ( result ) => {
				videoData = result;
			} );
			
			const token = JSON.parse(videoData)?.data?.token;

			if ( ! token || ! src ) {
				callbacks.setVideoError();
				return;
			}

			const href = `${src}?metadata_token=${token}`;

			callbacks.setVideoLink( href );
		},
	}
} );