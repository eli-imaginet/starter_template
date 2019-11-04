<?php
// ENQUEUE STYLES
function enqueue_styles()
{

    wp_register_style('assets', THEME . '/css/all_assets.min.css', array(), NULL, 'all');
    wp_enqueue_style('assets');
    wp_register_style('style', THEME . '/style.css', array(), time(), 'all');
    wp_enqueue_style('style');
}
add_action('wp_enqueue_scripts', 'enqueue_styles'); // Add Theme Stylesheet

// ENQUEUE SCRIPTS
function enqueue_scripts()
{
    if (!is_admin()) {
        wp_deregister_script('jquery');
    }
    wp_register_script('assets', THEME . '/assets/js/assets.min.js', array(), NULL, true);
    wp_enqueue_script('assets');
    wp_register_script('scripts', THEME . '/assets/js/scripts.js?v=' . time(), array(), NULL, true);
    wp_enqueue_script('scripts');
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');
