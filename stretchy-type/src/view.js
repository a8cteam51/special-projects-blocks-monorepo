import {
	store,
	useState,
	useEffect,
	getElement,
} from '@wordpress/interactivity';
import { adjustFontSize } from './utils';

const useInView = () => {
	const [ inView, setInView ] = useState( false );
	useEffect( () => {
		const { ref } = getElement();
		const observer = new IntersectionObserver( ( [ entry ] ) => {
			setInView( entry.isIntersecting );
		} );
		observer.observe( ref );
		return () => ref && observer.unobserve( ref );
	}, [] );
	return inView;
};

store( 'wpsp-stretchy-type', {
	callbacks: {
		handleResize: () => {
			const { ref } = getElement();
			adjustFontSize( ref, ref.innerHTML );
		},
		logInView: () => {
			const isInView = useInView();
			useEffect( () => {
				if ( isInView ) {
					const { ref } = getElement();
					adjustFontSize(
						getElement().ref,
						getElement().ref.innerHTML
					);
				}
			} );
		},
	},
} );
