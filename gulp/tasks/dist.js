var gulp = require('gulp');
var fs = require('fs');

var config = require('../config.js').config;
var minimizeConf = JSON.parse(fs.readFileSync('./minimizeConf.json','utf8'));


gulp.task('dist:copy', function (callback) {

	// Generamos la carpeta de distribuibles

	// dist/js
	console.log('dist/js');
	gulp.src(config.dirs.buildJs + '/*').pipe(gulp.dest('./dist/js'));


	// dist/css
	console.log('dist/css');
	gulp.src(minimizeConf.rupCssDistFiles).pipe(gulp.dest('./dist/css'));

	// dist/css/external
	// console.log("dist/css/external");
	//gulp.src(minimizeConf.rupCssExternalFiles).pipe(gulp.dest('./dist/css/external'));
	// gulp.src(["./node_modules/jquery-ui-dist/jquery-ui.css",
	// "./node_modules/gridstack/dist/gridstack.css",
	// "./node_modules/gridstack/dist/gridstack-extra.css",
	// "./node_modules/blueimp-file-upload/css/jquery.fileupload.css",
	// "./node_modules/blueimp-file-upload/css/jquery.fileupload-ui.css"])
	//     .pipe(gulp.dest('./dist/css/external'));
	gulp.src(['./node_modules/font-awesome/css/font-awesome.css','./node_modules/font-awesome/css/font-awesome.min.css']).pipe(gulp.dest('./dist/css'));
	// gulp.src("./build/css/bootstrap.css").pipe(gulp.dest('./dist/css/external'));
	gulp.src(['./build/css/*.css']).pipe(gulp.dest('./dist/css'));
	// gulp.src("./build/css/rup-base.css").pipe(gulp.dest('./dist/css'));
	// gulp.src("./build/css/rup-theme.css").pipe(gulp.dest('./dist/css'));
	// gulp.src("./build/css/rup-jqueryui-theme.css").pipe(gulp.dest('./dist/css'));

	// dist/css/images
	console.log('dist/css/images');
	gulp.src(['./assets/images/rup/**/*.*','./assets/images/jquery-ui/**/*.*']).pipe(gulp.dest('dist/css/images'));
	// dist/css/cursors
	console.log('dist/css/cursors');
	gulp.src(['./assets/cursors/**/*.*']).pipe(gulp.dest('dist/css/cursors'));

	// resources
	console.log('dist/resources');
	gulp.src(['./i18n/*.json']).pipe(gulp.dest('dist/resources'));

	// fonts
	console.log('dist/fonts');
	gulp.src('./node_modules/font-awesome/fonts/fontawesome-webfont*.*')
		.pipe(gulp.dest('dist/fonts'));

	// jquery-ui (legacy)
	console.log('jquery-ui (legacy)');
	gulp.src(['./assets/jquery-ui/**/*.*'])
		.pipe(gulp.dest('dist/css/external'));


	// externals
	console.log('externals ');
	console.log('bootstrap (v3, v4)');
	gulp.src(['./assets/css/externals/**/*.*'])
		.pipe(gulp.dest('dist/css/externals'));

	gulp.src(['./assets/js/externals/**/*.*'])
		.pipe(gulp.dest('dist/js/externals'));

	callback();
});

gulp.task('dist:x21a', function () {
	gulp.src(['!./dist/css/main.css','./dist/**/*.*'])
		.pipe(gulp.dest('../udaDemoApp/x21aStatics/WebContent/rup/'));

	gulp.src(['./dist/css/main.css'])
		.pipe(gulp.dest('../udaDemoApp/x21aStatics/WebContent/x21a/styles'));
});
