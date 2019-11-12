const gulp = require("gulp");
const { series, parallel } = require("gulp");
const colors = require("colors");
const exec = require("child_process").exec;
const npmDist = require("gulp-npm-dist");
const rename = require("gulp-rename");
const download = require("gulp-download-files");
const unzip = require("gulp-unzip");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const argv = require("yargs").argv;
const gap = require("gulp-append-prepend");
const fs = require("fs");

const wpUrl = "https://wordpress.org/latest.zip";
const cleanUpDirs = ["./downloads/", "./wordpress/", "./wp-content/themes/*"];
const assetsBase = "./wp-content/themes/starter-template/assets";
const templateDir = "./wp-content/themes/starter-template";
const cssHeader = `/*
	Theme Name: Starter Template
	Version: 1.0
	Author: Imaginet Studio
*/`;

const coreJsResources = [
	`./${assetsBase}/jquery/jquery.min.js`,
	`./${assetsBase}/bootstrap/js/bootstrap.min.js`
];

const coreCssResources = [
	`${assetsBase}/css/*.css`
	// `./${assetsBase}/jquery/jquery.min.js`,
	// `./${assetsBase}/bootstrap/js/bootstrap.min.js`
];

function notify(notifyObject) {
	const { errorText, instructions, successText } = notifyObject;
	console.log("\033[2J");
	if (successText) {
		console.log(successText.bold.white.bgGreen + "\n");
	}
	if (errorText) {
		console.log(errorText.white.bgRed + "\n");
	}
	if (instructions) {
		console.log("\n" + instructions.black.bgYellow);
	}
}

function add(cb) {
	const packageName = argv.p || null;
	if (!packageName) {
		const notifyObject = {
			errorText: "Please Provide A Valid NPM Package Name!",
			instructions:
				"Should be executed as: " +
				"\n" +
				"npm run add -- -p={packgage-name}"
		};
		notify(notifyObject);
		cb();
		return;
	}
	exec(`npm i ${packageName}`, function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		gulp.src(npmDist(), { base: "./node_modules" })
			.pipe(
				rename(path => {
					path.dirname = path.dirname
						.replace(/\/dist/, "")
						.replace(/\\dist/, "");
				})
			)
			.pipe(gulp.dest(assetsBase + "/js/"));
		notify({
			successText: `Package ${packageName} successfully installed and moved to assets dir`,
			instructions:
				`Please don't forget to add your file to core resource arrays and run:` +
				"\n" +
				"npm run gulp compileAll"
		});
		cb();
	});
}

function moveToAssets(cb) {
	gulp.src(npmDist(), { base: "./node_modules" })
		.pipe(
			rename(path => {
				path.dirname = path.dirname
					.replace(/\/dist/, "")
					.replace(/\\dist/, "");
			})
		)
		.pipe(
			gulp.dest(assetsBase).on("end", () => {
				js();
				console.log("Assets moved");
			})
		)
		.on("finish", cb);
}

function js(cb) {
	gulp.src(coreJsResources)
		.pipe(concat("assets.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(`${assetsBase}/js`))
		.on("finish", cb);
}

function css(cb) {
	_concatCSS().on(
		"finish",
		function() {
			_combineCSSAssetsAndCompiledSass(_compileSass());
			cb();
		}.bind(null, cb)
	);
}

function _concatCSS() {
	return gulp
		.src(coreCssResources)
		.pipe(concat("style.css"))
		.pipe(cleanCSS())
		.pipe(
			autoprefixer({
				cascade: false
			})
		)
		.pipe(gap.prependText(cssHeader))
		.pipe(gulp.dest(templateDir));
}

function _compileSass() {
	return gulp
		.src(`${assetsBase}/scss/style.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", function(err) {
			console.log("\033[2J");
			notify({
				errorText: err.formatted
			});
			this.emit("end");
		});
}

function _combineCSSAssetsAndCompiledSass(pipe) {
	pipe.pipe(cleanCSS())
		.pipe(concat("style.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(templateDir, { append: true }))
		.on("finish", function() {
			notify({
				successText: `Scss compiled Successfully at ${getCurrentTime()}`
			});
		});
}

function getCurrentTime() {
	const date = new Date();
	const minutes = date.getMinutes();
	const hours = date.getHours();
	const seconds = date.getSeconds();
	return ` ${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
		seconds < 10 ? `0${seconds}` : seconds
	} `.bold.bgGray.white;
}

function watch(cb) {
	css(cb);
	gulp.watch(`${assetsBase}/scss/*.scss`, css);
}

function downloadWP(cb) {
	if (!fs.existsSync("./downloads/latest.zip")) {
		download(wpUrl)
			.pipe(gulp.dest("./downloads/"))
			.on("finish", cb);
		return;
	}
	cb();
}

function extractWP(cb) {
	gulp.src("./wordpress/**")
		.pipe(gulp.dest("./"))
		.on("finish", cb);
}

function unzipWP(cb) {
	gulp.src("./downloads/latest.zip")
		.pipe(unzip())
		.pipe(gulp.dest("./"))
		.on("finish", cb);
}

function cleanGarbage(cb) {
	gulp.src(cleanUpDirs)
		.pipe(clean({ force: true }))
		.on("finish", cb);
}

function setStarterTemplateInWpContent(cb) {
	gulp.src("./starter-template/**")
		.pipe(gulp.dest("./wp-content/themes/starter-template"))
		.on("finish", cb);
}

exports.templateInit = series(
	downloadWP,
	unzipWP,
	extractWP,
	setStarterTemplateInWpContent,
	moveToAssets
);

exports.add = add;
exports.js = js;
exports.css = css;
exports.watch = watch;

// var gulp = require("gulp"),
// 	sass = require("gulp-sass"),
// 	uglify = require("gulp-uglify"),
// 	rename = require("gulp-rename"),
// 	cleanCSS = require("gulp-clean-css"),
// 	autoprefixer = require("gulp-autoprefixer"),
// 	concat = require("gulp-concat"),
// 	rtlcss = require("gulp-rtlcss"),
// 	notify = require("gulp-notify");

// /*******************************
//     Define bootstrap Framework
// *******************************/
// var tether = "./assets/bootstrap/tether.min.js";
// var bootstrap_js = "./assets/bootstrap/bootstrap.min.js";
// var bootstrap_css = "./assets/bootstrap/bootstrap.min.css";

// gulp.task("default", function() {
// 	console.log("Gulp default started");
// });

// gulp.task;
// /**************
// Development
// **************/
// var src_scripts = [
// 	tether,
// 	bootstrap_js,
// 	"./assets/js/jquery.magnific-popup.min.js",
// 	"./assets/js/slick.min.js",
// 	"./assets/js/jquery.lazy.min.js",
// 	"./assets/js/wow.min.js"
// ];

// gulp.task("js", function() {
// 	return gulp
// 		.src(src_scripts)
// 		.pipe(concat("assets.js"))
// 		.pipe(gulp.dest("./js/"))
// 		.pipe(rename("assets.min.js"))
// 		.pipe(uglify())
// 		.pipe(gulp.dest("./js/"))
// 		.pipe(notify("Scripts compiled and minified"));
// });

// var src_styles = [
// 	bootstrap_css,
// 	"./assets/css/assets.min.css",
// 	"./assets/css/animate.css",
// 	"./assets/css/magnific-popup.css",
// 	"./assets/css/slick.css"
// ];

// gulp.task("css", ["js"], function() {
// 	return gulp
// 		.src(src_styles)
// 		.pipe(concat("all_assets.css"))
// 		.pipe(gulp.dest("./css/"))
// 		.pipe(rename("all_assets.min.css"))
// 		.pipe(cleanCSS())
// 		.pipe(
// 			autoprefixer({
// 				browsers: ["last 2 versions"],
// 				cascade: false
// 			})
// 		)
// 		.pipe(gulp.dest("./css/"))
// 		.pipe(notify("Styles compiled and minified"));
// });

// gulp.task("sass", ["css"], function() {
// 	gulp.src("./css/style.scss") // the src of the file we want to manipulate
// 		.pipe(sass()) // in the pipe the file is going to be transformed
// 		// .pipe(cleanCSS())
// 		.pipe(
// 			autoprefixer({
// 				browsers: ["last 2 versions"],
// 				cascade: false
// 			})
// 		)
// 		.pipe(gulp.dest("./css/"))
// 		.pipe(notify("SASS files were manipulated."));
// });

// gulp.task("development", ["sass"], function() {
// 	console.log("Development scripts & styles compiled!!!");
// });

// gulp.task("watch", ["development"], function() {
// 	gulp.watch("./css/*.scss");
// });

// /*********************
//     Production
// *********************/

// var production_scripts = ["./js/assets.min.js", "./js/scripts.js"];

// gulp.task("production-js", function() {
// 	return gulp
// 		.src(production_scripts)
// 		.pipe(concat("production.min.js"))
// 		.pipe(gulp.dest("./js/"))
// 		.pipe(uglify())
// 		.pipe(gulp.dest("./js/"))
// 		.pipe(notify("Production script compiled and minified"));
// });

// var production_styles = [
// 	"./css/all_assets.min.css",
// 	"./css/style.min.css",
// 	"./css/responsive.min.css",
// 	"./css/rtl-style.css"
// ];

// gulp.task("production-css", ["production-js"], function() {
// 	return gulp
// 		.src(production_styles) // move it to build/css/ directory
// 		.pipe(rename("production.min.css")) // rename it
// 		.pipe(cleanCSS()) // minify css
// 		.pipe(
// 			autoprefixer({
// 				browsers: ["last 2 versions"],
// 				cascade: false
// 			})
// 		)
// 		.pipe(concat("production.min.css"))
// 		.pipe(gulp.dest("./build/css/")) // move it again to build/clean/ directory
// 		.pipe(notify("Production style compiled and minified")); // notify message
// });

// gulp.task("production", ["production-css"], function() {
// 	console.log("Production executed!!!");
// });
