# Imaginet's Starter @1.0.1

### Release Notes  
fixed jQuery deregister bug

## Welcome,

***Using This Template Guarantees You The Latest WordPress, Bootstrap, JQuery Versions***

1. Clone the repository
2. Cd into the cloned folder
3. Install dependencies by typing in the console `npm install` or `npm ci` the latter is much faster
4. run `npm run gulp init`
5. Choose your ftp config by editor:  
  VSCode => choose `Generate VSCode sftpconfig`  
  Atom => choose `Generate Atom ftpconfig`
6. run `npm run gulp init` again and choose  
  `Initiate the imaginet starter template (Once initiated there is no way back)`
7. After the build has finished you shall see a `wordpress` directory.
8. Zip the newly created `wordpress` folder
9. Upload the zip file to the host
10. Install WordPress
11. After installation **connect to the admin and choose the starter-template as your theme**
12. Connect the theme via FTP
13. Using your editors SASS compiler cd into `/wp-content/themes/starter-template/assets/scss`
14. Save your style.css => it should compile all the relevant files



## External Resource Loading

Resources can be loaded the conventional way via `wp_register_script` following `wp_enqueue_script`
And for styles via `wp_register_style` following `wp_enqueue_style`

<a href="https://developer.wordpress.org/reference/functions/wp_enqueue_script/" target="_blank">https://developer.wordpress.org/reference/functions/wp_enqueue_script/</a>

