<?php
$p = new WP_HTML_Tag_Processor( $content );
$is_open = $attributes['openByDefault'] ? 'true' : 'false';

while ( $p->next_tag() ){
    if ( $p->has_class( 'wp-block-wpsp-accordion-item') ) {
        $p->set_attribute( 'data-wp-interactive', 'wpsp-accordion-item' );
        $p->set_attribute( 'data-wp-context', '{"isOpen":' . $is_open . '}' );
        $p->set_attribute( 'data-wp-class--is-open', 'context.isOpen' );
    }
}

$content = $p->get_updated_html();
$p = new WP_HTML_Tag_Processor( $content );
$unique_id = wp_unique_id( 'p-' );

while ( $p->next_tag() ){
    if ( $p->has_class( 'wpsp-accordion-item__toggle' ) ) {
        $p->set_attribute( 'data-wp-on--click', 'actions.toggle' );
        $p->set_attribute( 'data-wp-bind--aria-expanded', 'context.isOpen' );
        $p->set_attribute( 'aria-controls', $unique_id );
    } 
}

$content = $p->get_updated_html();
$p = new WP_HTML_Tag_Processor( $content );

while ( $p->next_tag() ){
    if ( $p->next_tag( array( 'tag_name' => 'div', 'class_name' => 'wpsp-accordion-item__content' ) ) ) {
        $p->set_attribute( 'id', $unique_id );
        $p->set_attribute( 'data-wp-bind--hidden', '!context.isOpen' );
    }
}

echo $p->get_updated_html();