<?php

namespace mncs\not_jquery\admin;
defined("ABSPATH") or die();

use const mncs\not_jquery\OPTION_GROUP;

function register_settings(): void
{
    register_setting(OPTION_GROUP, OPTION_GROUP . "_dequeue_jquery", [
        "default" => 0,
    ]);
    register_setting(OPTION_GROUP, OPTION_GROUP . "_ghost_jquery", [
        "default" => 0,
    ]);
}

add_action("admin_init", __NAMESPACE__ . '\register_settings');

function print_settings_page(): void
{
    ?>
  <div class="wrap">
    <h1><?php echo OPTION_GROUP; ?></h1>
    <form action="options.php" method="POST">
        <?php settings_fields(OPTION_GROUP); ?>
        <?php do_settings_sections(OPTION_GROUP); ?>
      <h2>Not jQuery</h2>
      <!-- DEQUEUE -->
      <input name="<?php echo OPTION_GROUP .
          "_dequeue_jquery"; ?>" type="checkbox"
             value="1" <?php checked(
                 "1",
                 get_option(OPTION_GROUP . "_dequeue_jquery")
             ); ?> />
      <label for="<?php echo OPTION_GROUP .
          "_dequeue_jquery"; ?>">Dequeue jQuery?</label>
      <br />
      <br />
      <!-- ### -->
      <!-- GHOST -->
      <input name="<?php echo OPTION_GROUP .
          "_ghost_jquery"; ?>" type="checkbox"
             value="1" <?php checked(
                 "1",
                 get_option(OPTION_GROUP . "_ghost_jquery")
             ); ?> />
      <label for="<?php echo OPTION_GROUP .
          "_ghost_jquery"; ?>">Ghost jQuery?</label>
      <br />
      <small>Adds blank scripts to make the sure the jQuery depency exists, it's for debugging purpose only.</small>
      <br />
      <!--  ###  -->
        <?php submit_button(); ?>
    </form>
  </div>
    <?php
}

function add_menu(): void
{
    add_options_page(
        "Not jQuery",
        "Not jQuery",
        "administrator",
        OPTION_GROUP,
        __NAMESPACE__ . "\print_settings_page"
    );
}

add_action("admin_menu", __NAMESPACE__ . "\add_menu");
