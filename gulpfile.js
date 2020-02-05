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
// const argv = require("yargs").argv;
const gap = require("gulp-append-prepend");
// const md5 = require("md5");
const replace = require("gulp-replace");
const inquirer = require("inquirer");
const fs = require("fs");
const zip = require("zip-lib");
const wpUrl = "https://wordpress.org/latest.zip";
const cleanUpDirs = ["./downloads/", "./starter-template", "./wordpress/wp-content/themes/twenty*"];
const assetsBase = "./wordpress/wp-content/themes/starter-template/assets";
const templateDir = "./wordpress/wp-content/themes/starter-template";
const cssHeader = `/*
	Theme Name: Starter Template
	Version: 1.0
	Author: Imaginet Studio
*/`;
const coreJsResources = [
	`./${assetsBase}/jquery/jquery.min.js`,
	// `./${assetsBase}/bootstrap/js/bootstrap.min.js`
];
const coreCssResources = [
	`${assetsBase}/bootstrap/css/bootstrap.min.css`
];
const ftpconfig = {
	"protocol": "ftp",
	"host": "{host}",
	"port": 21,
	"user": "{user}",
	"pass": "{password}",
	"promptForPass": false,
	"remote": "/",
	"local": "",
	"secure": false,
	"secureOptions": null,
	"connTimeout": 10000,
	"pasvTimeout": 10000,
	"keepalive": 10000,
	"watch": [
		"public_html/wp-content/themes/starter-template/assets/scss/*.css",
		"public_html/wp-content/themes/starter-template/assets/scss/*.scss"
        ],
	"watchTimeout": 500
}

const sftpConfig = {
	"name": "",
	"host": "",
	"protocol": "ftp",
	"port": 21,
	"username": "",
	"password": "",
	"remotePath": "",
	"uploadOnSave": true,
	"watcher": {
		"files": "wp-content/themes/starter-template/assets/scss/*.{css,map}",
		"autoUpload": true,
		"autoDelete": false
	},
	"remoteExplorer": {
		"filesExclude": ["node_modules"]
	}
}

const themeCoreFiles = ['gulpfile.js', 'package-lock.json', 'package.json'];
const templateAfterGenerationLocation = './wp-content/themes/starter-template';

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
			}.bind(null, cb))
		)
}

function js(cb) {
	gulp.src(coreJsResources)
		.pipe(concat("assets.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(`${assetsBase}/js`))
		.on("finish", () => {
			notify({
				successText: 'Assets Moved!'
			});
			cb();
		});
}

function css(cb) {
	if (fs.existsSync(`${templateAfterGenerationLocation}/style.css.map`)) {
		gulp.src(`${templateAfterGenerationLocation}/style.css.map`).pipe(clean({
			force: true,
		}));
	}
	_concatCSS().on('finish', cb);
	// .on(
	// 	"finish",
	// 	function () {
	// 		// _combineCSSAssetsAndCompiledSass(_compileSass());
	// 		cb();
	// 	}.bind(null, cb)
	// );
}

function _concatCSS(cb) {
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


function setForDeploy(cb) {
	gulp.src(themeCoreFiles).pipe(gulp.dest('./wordpress'));
	cleanGarbage(cb)
}

function _compileSass(cb) {
	return gulp
		.src(`${templateAfterGenerationLocation}/assets/scss/style.scss`)
		.pipe(plumber({
			errorHandler: (err) => {
				global.error = err;
			}
		}))
		.pipe(sourcemaps.init()).on('error', function () {
			gulp.src(`${templateAfterGenerationLocation}/style.css.map`).clean({
				force: true
			});
		})
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(concat("style.css"))
		.pipe(gulp.dest(templateAfterGenerationLocation, {
			append: true
		}))
		.pipe(sourcemaps.write("./"))
}

function _combineCSSAssetsAndCompiledSass(pipe) {
	pipe.pipe(cleanCSS())
		.pipe(concat("style.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(templateAfterGenerationLocation, {
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
	gulp.watch(`${templateAfterGenerationLocation}/assets/scss/*.scss`, css);
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
	gulp.src([...cleanUpDirs, ...themeCoreFiles])
		.pipe(clean({
			force: true,
		}))
		.on("finish", cb);
}

function setStarterTemplateInWpContent(cb) {
	gulp.src("./starter-template/**")
		.pipe(gulp.dest("./wordpress/wp-content/themes/starter-template"))
		.on("finish", cb);
}


function _atomCreateFtpConfig(cb) {
	// inquirer.prompt({
	// 	type: 'confirm',
	// 	name: 'a',
	// 	message: 'Did you copy the template to the server first?'
	// }).then(function (a) {
	// 	if (!a.a) {
	// 		cb();
	// 		notify({
	// 			errorText: `.ftpconfig shoud be generated only after the template files were copied to the server and all server configuration has been made`,
	// 		});
	// 		return;
	// 	}
	fs.writeFile(`./.ftpconfig`, JSON.stringify(ftpconfig, null, 4), cb);
	notify({
		successText: `.ftpconfig was generated at theme folder, please edit the file and fulfill the ftp credentials`,
	})
	// })
}

function _codeCreateSftpConfig(cb) {
	fs.mkdir('./.vscode', function (err, stdout, stderr) {
		if (!err) {
			fs.writeFile(`./.vscode/sftp.json`, JSON.stringify(sftpConfig, null, 4), cb);
			notify({
				successText: `.sftp.json was generated at .vscode folder, please edit the file and fulfill the ftp credentials`,
			})
		}
	}.bind(cb));
}

function init(cb) {
	const q = [{
		type: 'list',
		name: 'action',
		message: 'What would you like to do today?',
		choices: [{
				name: 'Initiate the imaginet starter template (Once initiated there is no way back)',
				value: 1
			},
			{
				name: 'Generate Atom ftpconfig',
				value: 2
			},
			{
				name: 'Generate VScode sftpconfig',
				value: 3
			},
			// {
			// 	name: 'I am ready to deploy',
			// 	value: 4
			// }
		]
	}];
	inquirer.prompt(q).then((answer) => {
		switch (answer.action) {
			case 1:
				templateInit(cb);
				break;
			case 2:
				_atomCreateFtpConfig(cb);
				break;
			case 3:
				_codeCreateSftpConfig(cb);
				break;
				// case 4:
				// 	setForDeploy(cb);
				// 	break;
		}
	})
}
templateInit = series(
	downloadWP,
	unzipWP,
	// extractWP,
	setStarterTemplateInWpContent,
	moveToAssets,
	css,
	setForDeploy
);
// exports.add = add;
// exports.js = js;
// exports.css = css;
// exports.watch = watch;
// exports.atom = _atomCreateFtpConfig;
exports.init = init;
// exports.clean = cleanGarbage;
