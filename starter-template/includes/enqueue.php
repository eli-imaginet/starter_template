<?php
// ENQUEUE STYLES
function enqueue_styles()
{
    wp_register_style('style', THEME . '/style.css', array(), time(), 'all');
    wp_enqueue_style('style');
    wp_register_style('scss', THEME . '/assets/scss/style.css', array(), time(), 'all');
    wp_enqueue_style('scss');
}
add_action('wp_enqueue_scripts', 'enqueue_styles'); // Add Theme Stylesheet

// ENQUEUE SCRIPTS
function enqueue_scripts()
{
    if (!is_admin()) {
        wp_deregister_script('jquery');
        wp_register_script('jquery', THEME . '/assets/js/jquery.min.js', array(), NULL, true);
        wp_enqueue_script('jquery');
    }
    // wp_register_script('assets', THEME . '/assets/js/assets.min.js', array(), NULL, true);
    // wp_enqueue_script('assets');
    wp_register_script('scripts', THEME . '/assets/js/scripts.js?v=' . time(), array(), NULL, true);
    wp_enqueue_script('scripts');
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');
