const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");

const paths = {
    src:      ['!src/external/jqgrid/i18n/grid.locale*','src/**/*.js'],
    dest:     'build/src',
    specSrc:  'spec/**/*Spec.js',
    specDest: 'build/spec',
    spec:     'build/spec/**/*Spec.js',
    appSrc:   'app/**/*.js',
    appDest:  'build/app'
};


function build(src, dst) {
  // return gulp.src(src)
  //     .pipe(babel())
  //     .pipe(gulp.dest(dst));
    return gulp.src(src)
      .pipe(sourcemaps.init())
          .pipe(babel())
          .pipe(sourcemaps.write("."))
          .pipe(gulp.dest(dst));

    // var pipe = gulp.src(src).pipe(babel({ presets: ['es2015'] })), dest = gulp.dest(dst);
    // return pipe.pipe(dest);
}

gulp.task('build:babel', function() {
    return build(paths.src, paths.dest);
});
