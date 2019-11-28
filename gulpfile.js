const gulp = require("gulp");
const {
	series,
	parallel
} = require("gulp");
const colors = require("colors");
const exec = require("child_process").exec;
const npmDist = require("gulp-npm-dist");
const rename = require("gulp-rename");
const download = require("gulp-download-files");
const unzip = require("gulp-unzip");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const argv = require("yargs").argv;
const gap = require("gulp-append-prepend");
const md5 = require("md5");
const replace = require("gulp-replace");
const inquirer = require("inquirer");
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
	const {
		errorText,
		instructions,
		successText
	} = notifyObject;
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
			instructions: "Should be executed as: " +
				"\n" +
				"npm run add -- -p={packgage-name}"
		};
		notify(notifyObject);
		cb();
		return;
	}
	exec(`npm i ${packageName}`, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		gulp.src(npmDist(), {
				base: "./node_modules"
			})
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
			instructions: `Please don't forget to add your file to core resource arrays and run:` +
				"\n" +
				"npm run gulp compileAll"
		});
		cb();
	});
}

function moveToAssets(cb) {
	gulp.src(npmDist(), {
			base: "./node_modules"
		})
		.pipe(
			rename(path => {
				path.dirname = path.dirname
					.replace(/\/dist/, "")
					.replace(/\\dist/, "");
			})
		)
		.pipe(
			gulp.dest(assetsBase).on("end", function () {
				js(cb);
				console.log("Assets moved");
			}.bind(null, cb))
		)
}

function js(cb) {
	gulp.src(coreJsResources)
		.pipe(concat("assets.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(`${assetsBase}/js`))
		.on("finish", cb);
}

function css(cb) {
	if (fs.existsSync(`${templateDir}/style.css.map`)) {
		gulp.src(`${templateDir}/style.css.map`).pipe(clean({
			force: true
		}));
	}
	_concatCSS().on(
		"finish",
		function () {
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

function _compileSass(cb) {
	return gulp
		.src(`${assetsBase}/scss/style.scss`)
		.pipe(plumber({
			errorHandler: (err) => {
				global.error = err;
			}
		}))
		.pipe(sourcemaps.init()).on('error', function () {
			gulp.src(`${assetsBase}/style.css.map`).clean({
				force: true
			});
		})
		.pipe(sass())
		// 	{
		// 	onSuccess: () => {
		// 		notify({
		// 			successText: `Scss compiled Successfully at ${getCurrentTime()}`
		// 		});
		// 	},
		// 	onError: function (err) {
		// 		notify({
		// 			errorText: err.formatted
		// 		});
		// 		cb();
		// 	}
		// }
		// .on('error', function (err) {
		// 	// this.emit('close');
		// 	// cb();
		// }.bind(cb))
		// .on('success', function () {
		// 	notify({
		// 		successText: `Scss compiled Successfully at ${getCurrentTime()}`
		// 	});
		// })
		// .on("error", function (err) {
		// 	// console.log("\033[2J");
		// 	notify({
		// 		errorText: err.formatted
		// 	});
		// 	cb();
		// 	// this.emit("end");
		// }.bind(this, cb))
		.pipe(cleanCSS())
		.pipe(concat("style.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(templateDir, {
			append: true
		}))
}

function _combineCSSAssetsAndCompiledSass(pipe) {
	pipe.pipe(cleanCSS())
		.pipe(concat("style.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(templateDir, {
			append: true
		}))
		.on("finish", function () {
			if (!global.error) {
				notify({
					successText: `Scss compiled Successfully at ${getCurrentTime()}`
				});
			} else {
				notify({
					errorText: global.error.formatted
				});
			}
			delete global.error;
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
		.pipe(clean({
			force: true
		}))
		.on("finish", cb);
}

function setStarterTemplateInWpContent(cb) {
	gulp.src("./starter-template/**")
		.pipe(gulp.dest("./wp-content/themes/starter-template"))
		.on("finish", cb);
}

function setTemplateGenerationStamp(cb) {
	// inquirer.prompt({
	// 	name: 'a',
	// 	type: 'confirm',
	// 	message: 'Did you copy the template to the server?',
	// 	choices: ['Yes', 'No']
	// }).then((answer) => {
	// 	if (!answer.a) {
	// 		notify({
	// 			errorText: 'Please copy the template dir to the server and then init the Atom Config'
	// 		});
	// 	} else {
	fs.readFile('./gulpfile.js', function (err, data) {
		let fileString = data.toString();
		const stampMatched = fileString.match('//' + md5('Template Generated'));
		if (stampMatched) {
			_atomCreateFtpConfig(cb);
			// gulp.src("./gulpfile.js").pipe(gap.prependText(`//${md5('Template Generated')}`)).pipe(gulp.dest('./'));
		}
		// else {
		// 	notify({
		// 		errorText: 'Please copy the template dir to the server and then init the Atom Config'
		// 	});
		// 	cb();
		// }
	}.bind(null, cb));
	// }
	// cb();
	// });
}

function _atomCreateFtpConfig(cb) {
	const ftpconfig = {
		"protocol": "ftp",
		"host": "{host}",
		"port": 21,
		"user": "{user}",
		"pass": "{password}",
		"promptForPass": false,
		"remote": "/public_html",
		"local": "",
		"secure": false,
		"secureOptions": null,
		"connTimeout": 10000,
		"pasvTimeout": 10000,
		"keepalive": 10000,
		"watch": [
			"/wp-content/themes/rimed-theme/css/assets.min.css",
			"/wp-content/themes/rimed-theme/css/all_assets.min.css",
			"/wp-content/themes/rimed-theme/js/assets.min.js",
			"/wp-content/themes/rimed-theme/css/_mobile_menu.scss",
			"/wp-content/themes/rimed-theme/css/_vars.scss",
			"/wp-content/themes/rimed-theme/css/responsive.css",
			"/wp-content/themes/rimed-theme/css/style.css",
			"/wp-content/themes/rimed-theme/js/scripts.js",
			"/wp-content/themes/rimed-theme/css/production.min.css",
			"/wp-content/themes/rimed-theme/js/production.min.js"
		],
		"watchTimeout": 500
	}
	inquirer.prompt({
		type: 'confirm',
		name: 'a',
		message: 'Did you copy the template to the server first?'
	}).then((a) => {
		if (!a.a) {
			cb();
			notify({
				errorText: 
				`.ftpconfig shoud be generated only after the template files were copied to the server and all server configuration has been made`,
			})
			return;
		}
		fs.writeFile(`${templateDir}/.ftpconfig`, JSON.stringify(ftpconfig, null, 4), cb);
	})

}

function init(cb) {
	const q = [{
		type: 'list',
		name: 'action',
		message: 'What would you like to do today?',
		choices: [{
				name: 'Initiate the imaginet starter template',
				value: 1
			},
			{
				name: 'Add a dependency',
				value: 2
			},
			{
				name: 'Compile Sass',
				value: 3
			},
			{
				name: 'Generate Atom ftpconfig',
				value: 4
			}
		]
	}];
	inquirer.prompt(q).then((answer) => {
		switch (answer.action) {
			case 1:
				templateInit();
				break;
			case 2:
				break;
			case 3:
				watch(cb);
				break;
			case 4:
				_atomCreateFtpConfig(cb);
				break;
		}
	})
}

templateInit = series(
	downloadWP,
	unzipWP,
	extractWP,
	setStarterTemplateInWpContent,
	moveToAssets,
);

exports.add = add;
exports.js = js;
exports.css = css;
exports.watch = watch;
exports.atom = _atomCreateFtpConfig;
exports.setStamp = setTemplateGenerationStamp;
exports.init = init;