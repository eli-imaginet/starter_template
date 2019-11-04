<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'starter' );

/** MySQL database username */
define( 'DB_USER', 'starter' );

/** MySQL database password */
define( 'DB_PASSWORD', '1234' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '/T+!m9# cNv1nnek6Jp/`1Rcg+FCy7*(oY%*&Wh*#hk1]9Ha cW,+&Mv</iVs0nY' );
define( 'SECURE_AUTH_KEY',  '6#dKH{o!KUe/Y6qGhk4=%h`R&C0YJsm!j{NpXTxVM27/j?CDB3{pyxQsPg:u+Z}M' );
define( 'LOGGED_IN_KEY',    'hMIJ+jg@^@VR_6~VmLGb|Im!Q-&L}XcX#eqZ?hd(xtRZ_]a4Jlap@Dsps)gd,X37' );
define( 'NONCE_KEY',        'r5;@V*Y|X,[CWD`hY!`xU|eRFum=>%S9v0K<EJ&/;f9wJ3we7ET{j~ga*t)LytK#' );
define( 'AUTH_SALT',        '0]:>for/Y:t$`Hkg@,qvpCLX^Ogf!_iA*c[Kg9t1$[&WmNZdl&iRms6*nn=KpC$ ' );
define( 'SECURE_AUTH_SALT', 'Mlr>+;hyxK)pqTgeE>$#qtp^.EN8^?U##UK6RziV,U@yr`s!fEu2bpwzmF!6*9Cw' );
define( 'LOGGED_IN_SALT',   ']Y=4`M,V`izuck>x;55QaSIJ^`t)VS2%]g[f}SSN^ZAf3SX`b:P,F}wd^0?nHdm~' );
define( 'NONCE_SALT',       '7)E:}&|8b X9?zvBmocw&[w#uYnW&iuzZ[/Y7l1RehjM:v[X*[bVkW25ctY#CCaT' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
