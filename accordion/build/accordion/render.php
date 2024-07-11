<?php
$p = new WP_HTML_Tag_Processor( $content );

while ( $p->next_tag() ){
    if ( $p->has_class( 'wp-block-wpsp-accordion') ) {
        $p->set_attribute( 'data-wp-interactive', 'wpsp/accordion' );
        $p->set_attribute( 'data-wp-context', '{"isOpen":[]}' );
    }
}


echo $p->get_updated_html();