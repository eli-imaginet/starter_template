<!doctype html>
<html <?php language_attributes(); ?> class="no-js">

<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<!-- dns prefetch -->
	<link href="//www.google-analytics.com" rel="dns-prefetch" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<?php wp_head(); ?>
	<script type="text/javascript">
		var ThemeUrl = '<?php echo THEME; ?>';
	</script>
</head>

<body <?php body_class(); ?>>
	<div class="off-canvas-wrapper">
		<div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
			<div class="off-canvas-content" data-off-canvas-content>
				<header class="header clear" role="banner" id="header">
					<div class="flex_container">
						<div class="logo">
							<?php if (has_custom_logo()) : ?>
								<?php
									$custom_logo_id = get_theme_mod('custom_logo');
									$image = wp_get_attachment_image_src($custom_logo_id, 'full');
									?>
								<a href="<?php echo esc_url(home_url('/')); ?>" title="<?php echo get_bloginfo('name') ?>" class="site_logo" rel="home" itemprop="url">
									<img src="<?php echo $image[0]; ?>" alt="<?php echo get_bloginfo('name') ?>" itemprop="logo">
								</a>
							<?php else : ?>
								<a href="<?php echo esc_url(home_url('/')); ?>" title="<?php echo get_bloginfo('name'); ?>" class="site_logo" rel="home" itemprop="url">
									<?php echo get_bloginfo('name'); ?>
								</a>
							<?php endif; ?>
						</div>
						<nav class="nav" role="navigation">
							<div class="mobile_menu_button">
								<button type="button" class="button triggerMobileMenu" data-toggle="offCanvas" data-fontsize="18" aria-expanded="false" aria-controls="offCanvas">
									<span></span><span></span><span></span>
								</button>
							</div>
							<?php
							wp_nav_menu(array(
								'theme_location' => 'main-menu',
								'menu_id' => 'main-menu',
								'menu_class' => 'menu',
								'container_class' => 'wrap_main_menu'
							));
							?>
						</nav>
					</div>
				</header>