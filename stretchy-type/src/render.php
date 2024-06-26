<?php

$p = new WP_HTML_Tag_Processor( $content );

while ( $p->next_tag() ) {
    if ( 'PRE' === $p->get_tag() ) {
        $p->set_attribute( 'data-wp-interactive', 'wpsp-stretchy-type' );
        $p->set_attribute( 'data-wp-on-window--resize', 'callbacks.handleResize');
        $p->set_attribute( 'data-wp-run', 'callbacks.logInView' );
    }
}

echo $p->get_updated_html();