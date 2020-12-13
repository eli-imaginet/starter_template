<?php
add_action('init', function () {
    register_post_type('examples', array(
        'labels' => array(
            'name' => __('Example'),
            'singular_name' => __('example')
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'example'),
        'supports' => array('thumbnail', 'editor', 'title')
    ));
    register_taxonomy(
        'exmaple-tax',
        array('examples'),        //post type name
        array(
            'hierarchical' => true,
            'label' => 'example tax',  //Display name
            'public' => true,
            'rewrite' => array('slug' => 'test-slug'),
            'show_ui' => true
        )
    );
});
