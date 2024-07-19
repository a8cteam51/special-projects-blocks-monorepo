<?php
$p = new WP_HTML_Tag_Processor( $content );
$unique_id = wp_unique_id( 'wpsp-accordion-item-' );

while ( $p->next_tag() ){
    if ( $p->has_class( 'wp-block-wpsp-accordion-item') ) {
        $p->set_attribute( 'id', $unique_id );
        $p->set_attribute( 'data-wp-class--is-open', 'state.isOpen' );
        if ( $attributes['openByDefault'] ) {
            $p->set_attribute( 'data-wp-init', 'callbacks.open' );
        }
    }
}

$content = $p->get_updated_html();
$p = new WP_HTML_Tag_Processor( $content );

while ( $p->next_tag() ){
    if ( $p->has_class( 'wpsp-accordion-item__toggle' ) ) {
        $p->set_attribute( 'data-wp-on--click', 'actions.toggle' );
        $p->set_attribute( 'aria-controls', $unique_id );
        $p->set_attribute( 'data-wp-bind--aria-expanded', 'state.isOpen' );
    } 
}

$content = $p->get_updated_html();
$p = new WP_HTML_Tag_Processor( $content );

while ( $p->next_tag() ){
    if ( $p->has_class( 'wp-block-wpsp-accordion-content' ) ) {
        $p->set_attribute( 'aria-labelledby', $unique_id );
        $p->set_attribute( 'data-wp-bind--aria-hidden', '!state.isOpen' );
    }
}

echo $p->get_updated_html();