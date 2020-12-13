<?php
// ini_set('display_errors',1);
// error_reporting(E_ALL);
/*****************************************
 **  Languages
 *****************************************/
add_action('after_setup_theme', 'imaginet_theme_textdomain');
function imaginet_theme_textdomain()
{
    load_theme_textdomain('imaginet', THEME . '/languages'); // Localisation Support
}
/*****************************************
 **  Define
 *****************************************/
if (!defined('THEME')) {
    define("THEME", get_template_directory_uri());
}
define('ENV', 'dev'); // only when developing, after that change it to ''
if (!defined('TEMPLATEPATH')) {
    define('TEMPLATEPATH', get_template_directory());
}
define('GOOGLE_API_KEY', 'SOME_KEY');
/*****************************************
 **  Includes
 ****************************************/
get_template_part("includes/enqueue");
get_template_part("includes/types-and-taxonomies");
// get_template_part("functions/tgm");
// get_template_part("functions/shortcodes");
// get_template_part("functions/ajax");

/*****************************************
 **  Theme Support
 *****************************************/
if (function_exists('add_theme_support')) {
    // Add Menu Support
    add_theme_support('menus');
    // Add custom logo
    add_theme_support('custom-logo');
    // Add title tag in wp_head
    add_theme_support('title-tag');
    // Add Thumbnail Theme Support
    add_theme_support('post-thumbnails');
    // override media setting - Image sizes
    add_image_size('small', 300, '', true); // Small Thumbnail
    add_image_size('medium', 640, '', true); // Medium Thumbnail
    add_image_size('large', 1024, '', true); // Large Thumbnail
    // Enables post and comment RSS feed links to head
    add_theme_support('automatic-feed-links');
    // Enable support for wp galleries with figure tag
    add_theme_support('html5', array('gallery'));
}
// Register Blank Navigation
register_nav_menus(array( // Using array to specify more menus if needed
    'main-menu' => __('Main Menu', 'imaginet'), // Main Navigation
    'mobile-menu' => __('Mobile Menu', 'imaginet') // Mobile Navigation
));
// Register sidebars
if (function_exists('register_sidebar')) {
    $sidebar_array = array(
        array('name' => 'Main Sidebar', 'id' => 'main_sidebar'),
        array('name' => 'Blog', 'id' => 'blog_sidebar')
    );
    foreach ($sidebar_array as $sidebar) {
        register_sidebar(array(
            'name' => $sidebar['name'],
            'id' => $sidebar['id'],
            'description' => __('Drag here menu widgets to put in the sidebar', 'imaginet'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title' => '<h2 class="widget_title">',
            'after_title' => '</h2>'
        ));
    }
}
// Add Theme Stylesheet To ADMIN
add_action('admin_enqueue_scripts', 'qs_admin_theme_styles');
function qs_admin_theme_styles()
{
    wp_register_style('admin-style', THEME . '/admin/admin-style.css', array(), NULL, 'all');
    wp_enqueue_style('admin-style');
}
// Add body classes
if (!function_exists('add_body_class')) {
    function add_body_class($classes)
    {
        global $is_lynx, $is_gecko, $is_IE, $is_opera, $is_NS4, $is_safari, $is_chrome, $is_iphone;
        if ($is_lynx) $classes[] = 'lynx';
        elseif ($is_gecko) $classes[] = 'gecko';
        elseif ($is_opera) $classes[] = 'opera';
        elseif ($is_NS4) $classes[] = 'ns4';
        elseif ($is_safari) $classes[] = 'safari';
        elseif ($is_chrome) $classes[] = 'chrome';
        elseif ($is_IE) {
            $classes[] = 'ie';
            if (preg_match('/MSIE ( [0-11]+ )( [a-zA-Z0-9.]+ )/', $_SERVER['HTTP_USER_AGENT'], $browser_version))
                $classes[] = 'ie' . $browser_version[1];
        } else $classes[] = 'unknown';
        if ($is_iphone) $classes[] = 'iphone';
        if (stristr($_SERVER['HTTP_USER_AGENT'], "mac")) {
            $classes[] = 'osx';
        } elseif (stristr($_SERVER['HTTP_USER_AGENT'], "linux")) {
            $classes[] = 'linux';
        } elseif (stristr($_SERVER['HTTP_USER_AGENT'], "windows")) {
            $classes[] = 'windows';
        }
        return $classes;
    }
    add_filter('body_class', 'add_body_class');
}
// woocommerce activation snippet
// function mytheme_add_woocommerce_support() {
//   add_theme_support( 'woocommerce' );
// }
// add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
// initialize ACF Google Maps API
function my_acf_init()
{
    acf_update_setting('google_api_key', GOOGLE_API_KEY);
}
add_action('acf/init', 'my_acf_init');
// Advanced Custom Fields Options Page
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'     => 'Theme General Settings',
        'menu_title'    => 'General Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'        => false
    ));
}
// Pagination for paged posts, Page 1, Page 2, Page 3, with Next and Previous Links, No plugin
function imaginet_pagination()
{
    global $wp_query;
    $big = 999999999;
    echo paginate_links(array(
        'base' => str_replace($big, '%#%', get_pagenum_link($big)),
        'format' => '?paged=%#%',
        'current' => max(1, get_query_var('paged')),
        'total' => $wp_query->max_num_pages
    ));
}
// Add Custom Pagination
add_action('init', 'imaginet_pagination'); // Add our Pagination
add_action('acf/init', function () {
    global $globalOptions;
    $globalOptions = get_fields('options');
});
// Add Filters
add_filter('widget_text', 'do_shortcode'); // Allow shortcodes in Dynamic Sidebar
add_filter('the_excerpt', 'do_shortcode'); // Allows Shortcodes to be executed in Excerpt (Manual Excerpts only)
// Remove the excerpt more 'read more btn'
function remove_excerpt_more($more)
{
    global $post;
    return '';
}
add_filter('excerpt_more', 'remove_excerpt_more');
// Change the excerpt length
function new_excerpt_length($length)
{
    return 30;
}
add_filter('excerpt_length', 'new_excerpt_length');
// tinymce color pallete
function my_mce4_options($init)
{
    $default_colours = '';
    $custom_colours = '
		"16b1af", "Turquoise",
		"df7d28", "Orange",
		"a7cf3e", "Light Green",
		"2f9de0", "Blue Sky",
		"fff", "White",
		"7d7d7d" , "Light Gray",
		"555555" , "Dark Gray"
	';
    // build colour grid default+custom colors
    $init['textcolor_map'] = '[' . $custom_colours . ',' . $default_colours . ']';
    // enable 6th row for custom colours in grid
    $init['textcolor_rows'] = 6;
    return $init;
}
add_filter('tiny_mce_before_init', 'my_mce4_options');
/***************************************** no hebrew files  ********/
add_filter('wp_handle_upload_prefilter', 'hebrew_files_prevent');
function hebrew_files_prevent($file)
{
    $filename = $file['name'];
    if (preg_match('/[אבגדהוזחטיכלמנסעפצקרשתףץךםן]/', $filename, $matches)) {
        $file['error'] = 'נא לא להעלות קבצים עם שמות בעברית!';
    }
    return $file;
}
/**
 * Responsive Image Helper Function
 * @param string $image_id the id of the image (from ACF or similar)
 * @param string $image_size the size of the thumbnail image or custom image size
 * @param string $max_width the max width this image will be shown to build the sizes attribute
 */
function print_responsive_image_attr($image_id, $image_size, $max_width, $lazy = false)
{
    // check the image ID is not blank
    if ($image_id != '') {
        // set the default src image size
        $image_src = wp_get_attachment_image_url($image_id, $image_size);
        // set the srcset with various image sizes
        $image_srcset = wp_get_attachment_image_srcset($image_id, $image_size);
        if ($lazy) {
            $data = 'data-';
        } else {
            $data = '';
        }
        // generate the markup for the responsive image
        echo $data . 'src="' . $image_src . '" ' . $data . 'srcset="' . $image_srcset . '" sizes="(max-width: ' . $max_width . ') 100vw, ' . $max_width . '"';
    }
}
function phpLog($logme)
{
    echo "<script>console.log(" . json_encode(var_export($logme, true)) . ");</script>";
}
/**
 * get Youtube ID
 */
function getYoutubeId($video_uri)
{
    // determine the type of video and the video id
    preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $video_uri, $matches);
    //return thumbnail uri
    return $matches[1];
}
/************************************************************/
/**
 * Gets a Youtube thumbnail url
 * @param $id A vimeo id (ie. K4Rh8fyeJAE)
 * @param $size size of Thumbnail (0,1,2,3,"default","hqdefault","mqdefault","sddefault")
 * @return thumbnails url
 */
function getYoutubeThumbUrl($id, $size = "0")
{
    $data = "http://img.youtube.com/vi/" . $id . "/" . $size . ".jpg";
    return $data;
}
/************************************************************/
/**
 *  get youtube title
 * @param  [type] $id [description]
 */
function getYoutubeTitle($id)
{
    if (empty($id)) {
        return null;
    }
    // returns a single line of XML that contains the video title. Not a giant request. Use '@' to suppress errors.
    $content = @file_get_contents("http://youtube.com/get_video_info?video_id=" . $id);
    if ($content) {
        // look for that title tag and get the insides
        parse_str($content, $ytarr);
        $videoTitle = $ytarr['title'];
        return $videoTitle;
    } else {
        return __('No title', 'text_domian');
    }
}
remove_filter('map_meta_cap', 'flamingo_map_meta_cap');
add_filter('map_meta_cap', 'mycustom_flamingo_map_meta_cap', 9, 4);
function mycustom_flamingo_map_meta_cap($caps, $cap, $user_id, $args)
{
    $meta_caps = array(
        'flamingo_edit_contact' => 'edit_posts',
        'flamingo_edit_contacts' => 'edit_posts',
        'flamingo_delete_contact' => 'edit_posts',
        'flamingo_edit_inbound_message' => 'publish_posts',
        'flamingo_edit_inbound_messages' => 'publish_posts',
        'flamingo_delete_inbound_message' => 'publish_posts',
        'flamingo_delete_inbound_messages' => 'publish_posts',
        'flamingo_spam_inbound_message' => 'publish_posts',
        'flamingo_unspam_inbound_message' => 'publish_posts',
        'flamingo_edit_outbound_message' => 'publish_posts',
        'flamingo_edit_outbound_messages' => 'publish_posts',
        'flamingo_delete_outbound_message' => 'publish_posts',
    );
    $caps = array_diff($caps, array_keys($meta_caps));
    if (isset($meta_caps[$cap]))
        $caps[] = $meta_caps[$cap];
    return $caps;
}
add_action('init', function () {
    register_post_type('testimonials', array(
        'labels' => array(
            'name' => __('Testimonials'),
            'singular_name' => __('Testimonial')
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'testimonials'),
        'supports' => array('thumbnail', 'editor', 'title')
    ));
    register_post_type('news', array(
        'labels' => array(
            'name' => __('News'),
            'singular_name' => __('News')
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'news'),
        'supports' => array('thumbnail', 'editor', 'title')
    ));
});
function upload_svg_files($allowed)
{
    if (!current_user_can('manage_options'))
        return $allowed;
    $allowed['svg'] = 'image/svg+xml';
    return $allowed;
}
add_filter('upload_mimes', 'upload_svg_files');
function isCurrentPage($pageSlug, $menuItem)
{
    $target = $menuItem->post_name;
    if (is_numeric($menuItem->post_name)) {
        $target = $menuItem->object;
    }
    // echo 'slug: ' . $pageSlug . PHP_EOL . 'menu: ' . $menuItem->post_name;
    return !empty($pageSlug) && $pageSlug == $target;
}
function cleanData($data)
{
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            $data[$key] = cleanData($value);
            continue;
        }
        $data[$key] = sanitize_text_field($value);
    }
    return $data;
}
