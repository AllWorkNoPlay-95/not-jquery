<?php
/**
 * @package not-jquery
 * @author Samuele Mancuso (AllWorkNoPlay-95 @ GitHub)
 * @link https://github.com/AllWorkNoPlay-95/not-jquery
 * @description A lightweight JavaScript library that emulates essential jQuery functions, designed for WordPress themes and plugins without relying on the full jQuery library.
 */

namespace mncs\not_jquery;
defined('ABSPATH') or die();
#region Constants
const OPTION_GROUP = 'mncs_not_jquery_settings';
#endregion
#region Admin
require_once plugin_dir_path(__FILE__) . 'admin/settings.php';
#endregion

#region Main
function enqueue_fe():void {
    wp_enqueue_script(
        'mncs-not-jquery',
        get_template_directory_uri() . '/js/not-jquery.min.js',
        [],
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_fe');

function prune():void
{
    if (!is_admin()) { // Only run on the frontend
        if(get_option(OPTION_GROUP . '_dequeue_jquery')==1) {
            wp_deregister_script('jquery');
            wp_deregister_script('jquery-core');
        }
    }
}

add_action('init', __NAMESPACE__ . '\prune', 999);
#endregion