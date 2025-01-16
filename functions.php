<?php
/**
 * @package not-jquery
 * @author Samuele Mancuso (AllWorkNoPlay-95 @ GitHub)
 * @link https://github.com/AllWorkNoPlay-95/not-jquery
 * @description A lightweight JavaScript library that emulates essential jQuery functions, designed for WordPress themes and plugins without relying on the full jQuery library.
 */

namespace mncs\not_jquery;
function enqueue_fe() {
    wp_enqueue_script(
        'mncs-not-jquery', // Handle
        get_template_directory_uri() . '/js/not-jquery.min.js', // Path to the script
        [], // Dependencies (none required)
        '1.0.0', // Version number
        true // Load script in the footer
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_fe');
