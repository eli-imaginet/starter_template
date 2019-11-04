					<!-- footer -->
					<footer class="footer" role="contentinfo">
						<div class="container">
							<div class="credit">Site by <a href="http://imaginet.co.il" target="_blank">Imaginet</a></div>
						</div>
					</footer>
					<!-- /footer -->

				</div><!-- end of .off-canvas-content -->


				<?php if(is_rtl()){ $pos_dir = 'right'; }else{ $pos_dir = 'left'; } ?>
				<div class="off-canvas position-<?php echo $pos_dir;?>" id="offCanvas" data-off-canvas>
					<div class="mobile_menu_holder">
						<div class="mobile_menu_title"><?php _e('Menu','imaginet'); ?></div>
							<?php wp_nav_menu(
									array(
										'theme_location' => 'mobile-menu',
										'menu_id' => 'mobile-menu',
										'menu_class' => 'mobile_menu'
									));
							?>
					</div>
				</div>

			</div><!-- end of .off-canvas-wrapper-inner -->
		</div><!-- end of .off-canvas-wrapper -->

		<?php wp_footer(); ?>
	</body>
</html>
