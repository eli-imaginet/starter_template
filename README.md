# Imaginet's Starter @1.0.0


## Welcome,

***Using This Template Guarantees You The Latest WordPress, Bootstrap, JQuery Versions***

1. Clone the repository
2. Cd into the cloned folder
3. Install dependencies by typing in the console `npm install` or `npm ci` the latter is much faster
4. run `npm run gulp init`
5. Choose your ftp config by editor:  
  VScode => choose `Generate VScode sftpconfig`  
  Atom => choose `Generate Atom ftpconfig`
6. run `npm run gulp init` again and choose `Initiate the imaginet starter template (Once initiated there is no way back)`
7. After the build has finished you shall see a `wordpress` directory.
8. Zip the newly created`wordpress` folder
9. Upload the zip file to the host
10. install WordPress
11. Connect to the theme via FTP
12. Using your editors SASS compiler cd into `/wp-content/themes/starter-template/assets/scss`
13. Save your style.css => it should compile all the relevant files



## Loading External Resources

Loading external **JS** resources should be done with caution:

If your resource should be shared among all pages:

1. Copy your **minified** resource to clipboard
2. Paste it in the `/wp-content/themes/starter-template/assets/js/assets.min.js`

Loading external **CSS** resources

1. Copy your **minified** resource to clipboard
2. Paste it in `/wp-content/themes/starter-template/style.css`

 
