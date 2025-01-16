<?php
/**
 * Plugin Name: Not jQuery
 * Author: Samuele Mancuso (AllWorkNoPlay-95 @ GitHub)
 * Author URI: https://github.com/AllWorkNoPlay-95
 * Description: A lightweight JavaScript library that emulates essential jQuery functions, designed for WordPress themes and plugins without relying on the full jQuery library.
 * Plugin URI:  https://github.com/AllWorkNoPlay-95/not-jquery
 * Version: 1.0.0
 * License: GPL-3.0+
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 */

namespace mncs\not_jquery;
defined("ABSPATH") or die();
#region Constants
const OPTION_GROUP = "mncs_not_jquery_settings";
#endregion
#region Admin
require_once plugin_dir_path(__FILE__) . "wp-admin/settings.php";
#endregion

#region Main
function enqueue_fe(): void
{
    wp_enqueue_script(
        "mncs-not-jquery",
        plugin_dir_url() . "/dist/not-jquery.js",
        [],
        "1.0.0",
        true
    );
}

add_action("wp_enqueue_scripts", __NAMESPACE__ . '\enqueue_fe');

function prune(): void
{
    if (!is_admin()) {
        // Only run on the frontend
        if (get_option(OPTION_GROUP . "_dequeue_jquery") == 1) {
            wp_deregister_script("jquery");
            wp_deregister_script("jquery-core");
        }
    }
}

add_action("init", __NAMESPACE__ . "\prune", 999);
#endregion
