# not-jquery
A lightweight JavaScript library that emulates essential jQuery functions, designed for modern web projects and WordPress themes without relying on the full jQuery library.

## Features

- Implements key jQuery methods such as:
    - `.addClass()`
    - `.removeClass()`
    - `.html()`
    - `.val()`
    - `.on()`
- Provides a modern, minimal alternative for themes and plugins that require basic jQuery-like capabilities.
- Designed to improve page performance by reducing unnecessary dependencies.

## Why Use not-jquery?

WordPress often includes jQuery by default, even for small operations. **not-jquery** allows you to:
- Avoid loading the full jQuery library.
- Use lightweight and optimized JavaScript to handle common DOM operations.
- Ensure compatibility with older WordPress plugins or themes that require jQuery-like functions.

## Installation

1. **Download the Plugin**
    - Clone the repository or download the latest release as a `.zip` file.

2. **Add to Your WordPress Project**
    - Upload the `not-jquery` folder to the `wp-content/plugins` directory of your WordPress installation.
    - Alternatively, copy the `not-jquery.min.js` file to your theme's `js` directory.

3. **Enqueue the Script in Your Theme**
   Add the following code to your theme’s `functions.php` file:
   ```php
   function load_not_jquery() {
       wp_enqueue_script('not-jquery', get_template_directory_uri() . '/js/not-jquery.min.js', [], '1.0.0', true);
   }
   add_action('wp_enqueue_scripts', 'load_not_jquery');
   ```
## Usage

   ```js
        $(document).ready(function () {
            $('.my-class').addClass('new-class');
            $('#my-id').on('click', function () {
                console.log('Button clicked!');
            });
        });
   ```
## Licence

This project is licensed under the GPLv3 License. See the LICENSE file for details.
