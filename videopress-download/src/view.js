import { store, getContext, getElement } from '@wordpress/interactivity';

function waitForVideoData( post_id, guid, maxRounds = 15, intervalMs = 250 ) {
    return new Promise( ( resolve ) => {
		let rounds = 0;

		const intervalId = setInterval( () => {
			let localStorageData;
			
			try {
				localStorageData = localStorage.getItem(`vpc-playback-${post_id}-${guid}`);
			} catch ( error ) {
				clearInterval( intervalId );
				resolve( false );
				return;
			}

			if ( localStorageData ) {
				clearInterval( intervalId );
				resolve( localStorageData );
			}

			if ( rounds === maxRounds ) {
				clearInterval( intervalId );
				resolve(false);
			}
		}, intervalMs );
    } );
}

const { callbacks } = store( 'wpcomsp/video-download-link', {
	callbacks: {
		setVideoLink( href ) {
			const { ref } = getElement();
			const context = getContext();

						// Validate URL format
			try {
				new URL( href );
			} catch ( error ) {
				callbacks.setVideoError();
				return;
			}

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
		asyncGetVideoLink: function* () {
			const context = getContext();
			const { post_id, guid, src } = context;

			let videoData;

			yield waitForVideoData( post_id, guid ).then( ( result ) => {
				videoData = result;
			} );

			// check if valid json.
			let token;
			try {
				const parsedData = JSON.parse( videoData );
				token = parsedData?.data?.token;
			} catch ( error ) {
				callbacks.setVideoError();
				return;
			}
			
			if ( ! token || ! src ) {
				callbacks.setVideoError();
				return;
			}

			const href = `${src}?metadata_token=${token}`;

			callbacks.setVideoLink( href );
		},
	}
} );