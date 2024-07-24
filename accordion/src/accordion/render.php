<?php
$p = new WP_HTML_Tag_Processor( $content );
$autoclose = $attributes['autoclose'];

while ( $p->next_tag() ){
    if ( $p->has_class( 'wp-block-wpsp-accordion') ) {
        $p->set_attribute( 'data-wp-interactive', 'wpsp/accordion' );
        $p->set_attribute( 'data-wp-context', '{"isOpen":[],"autoclose":"' . $autoclose . '"}' );
    }
}

echo $p->get_updated_html();