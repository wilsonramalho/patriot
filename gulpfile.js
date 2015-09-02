var gulp = require('gulp');

var del = require('del');
var browserSync = require('browser-sync');

var gutil = require('gulp-util');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/,
    lazy: false,
    rename: {
      'gulp-minify-css' : 'minifycss',
      'gulp-if' : 'gulpIf',
      'gulp-jade-inheritance' : 'jadeInheritance'
    }
});

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/fontawesome/fonts/**/*',
    'source/fonts/**/*'
  ])
  .pipe(plugins.plumber({
    errorHandler: onError
  }))
  .pipe(gulp.dest('build/fonts/'))
});

gulp.task('images', function() {
  return gulp.src([
    'source/images/**/*.gif',
    'source/images/**/*.ico',
    'source/images/**/*.jpg',
    'source/images/**/*.jpeg',
    'source/images/**/*.svg',
    'source/images/**/*.png'
  ])
  .pipe(plugins.cache(plugins.imagemin({
    interlaced: true,
    optimizationLevel: 5,
    progressive: true
  })))
  .pipe(gulp.dest('build/images'));
});

gulp.task('libraries', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    //'bower_components/bootstrap/js/transition.js',
    //'bower_components/bootstrap/js/alert.js',
    //'bower_components/bootstrap/js/button.js',
    //'bower_components/bootstrap/js/carousel.js',
    //'bower_components/bootstrap/js/collapse.js',
    //'bower_components/bootstrap/js/dropdown.js',
    //'bower_components/bootstrap/js/modal.js',
    //'bower_components/bootstrap/js/tooltip.js',
    //'bower_components/bootstrap/js/popover.js',
    //'bower_components/bootstrap/js/scrollspy.js',
    //'bower_components/bootstrap/js/tab.js',
    //'bower_components/bootstrap/js/affix.js',
    //'bower_components/jasny-bootstrap/js/fileinput.js',
    //'bower_components/jasny-bootstrap/js/inputmask.js',
    //'bower_components/jasny-bootstrap/js/offcanvas.js',
    //'bower_components/jasny-bootstrap/js/rowlink.js',
    'source/scripts/jquery.scripts.js'
  ])
  .pipe(plugins.plumber({
    errorHandler: onError
  }))
  .pipe(plugins.concat('libraries.js'))
  .pipe(plugins.uglify())
  .pipe(gulp.dest('build/scripts/'))
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe(plugins.plumber({
    errorHandler: onError
  }))
  .pipe(plugins.less())
  .pipe(plugins.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe(plugins.minifycss({keepSpecialComments: 0, removeEmpty: true}))
  .pipe(gulp.dest('build/stylesheets/'))
});

gulp.task('templates', function() {
  return gulp.src([
    'source/**/*.jade'
  ])
  .pipe(plugins.changed('build', {
    extension: '.html'
  }))
  .pipe(plugins.gulpIf(global.isWatching, plugins.cached('templates')))
  .pipe(plugins.jadeInheritance({
    basedir: 'source'
  }))
  .pipe(plugins.filter( function(file) {
    return !/\/_/.test(file.path) || !/^_/.test(file.relative);
  }))
  .pipe(plugins.plumber())
  .pipe(plugins.jade({
    pretty: true
  }))
  .pipe(gulp.dest('build'));
});

gulp.task('build', ['clear'], function() {
  gulp.start(
    'fonts',
    'images',
    'libraries',
    'stylesheets',
    'templates'
  );
});

gulp.task('clear', function(cb) {
  del(['build/**'], cb)
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Default

gulp.task('default', ['setWatch', 'build'], function() {
  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('source/images/**/*', ['images']);
  gulp.watch('source/scripts/**/*.js', ['libraries']);
  gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
  gulp.watch('source/**/*.jade', ['templates']);
  browserSync.init('build/**/*', {
    server: {
      baseDir: 'build'
    }
  });
});
