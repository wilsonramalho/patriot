var
  autoprefixer    = require('gulp-autoprefixer'),
  browserSync     = require('browser-sync'),
  cache           = require('gulp-cache'),
  cached          = require('gulp-cached'),
  changed         = require('gulp-changed'),
  concat          = require('gulp-concat'),
  filter          = require('gulp-filter'),
  gulp            = require('gulp'),
  gulpif          = require('gulp-if'),
  imagemin        = require('gulp-imagemin'),
  jade            = require('gulp-jade'),
  jadeInheritance = require('gulp-jade-inheritance'),
  jshint          = require('gulp-jshint'),
  minifycss       = require('gulp-minify-css'),
  plumber         = require('gulp-plumber'),
  rename          = require('gulp-rename'),
  rimraf          = require('gulp-rimraf'),
  less            = require('gulp-less'),
  uglify          = require('gulp-uglify');
  gutil           = require('gulp-util');

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

gulp.task('respond', function() {
  return gulp.src([
    'bower_components/respond/dest/respond.min.js'
  ])
  .pipe(uglify())
  .pipe(rename('respond.js'))
  .pipe(gulp.dest('build/scripts'));
});

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/bootstrap/fonts/**/*',
    'source/fonts/**/*'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(gulp.dest('build/fonts'));
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
  .pipe(cache(imagemin({
    interlaced: true,
    optimizationLevel: 5,
    progressive: true
  })))
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(gulp.dest('build/images'));
});

gulp.task('libraries', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/js/transition.js',
    'bower_components/bootstrap/js/alert.js',
    'bower_components/bootstrap/js/button.js',
    'bower_components/bootstrap/js/carousel.js',
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
    'bower_components/jasny-bootstrap/js/offcanvas.js',
    //'bower_components/jasny-bootstrap/js/rowlink.js',
    //'bower_components/bootstrap-select/bootstrap-select.js',
    //'bower_components/jquery.validation/dist/jquery.validate.js',
    'source/scripts/jquery.scripts.js'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(concat('libraries.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts/'));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(less())
  .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe(minifycss({
    keepSpecialComments: 0, 
    removeEmpty: true
  }))
  .pipe(gulp.dest('build/stylesheets/'));
});

gulp.task('templates', function() {
  return gulp.src([
    'source/*.jade'
  ])
  .pipe(changed('build', {
    extension: '.html'
  }))
  .pipe(gulpif(global.isWatching, cached('templates')))
  .pipe(jadeInheritance({
    basedir: 'source'
  }))
  .pipe(filter( function(file) {
    return !/\/_/.test(file.path) || !/^_/.test(file.relative);
  }))
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(jade({
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
    'templates',
    'respond'
  );
});

gulp.task('clear', function() {
  return gulp.src([
    'build/*',
    'build/fonts',
    'build/images',
    'build/scripts',
    'build/stylesheets'
  ], {
    read: false
  })
  .pipe(rimraf());
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

gulp.task('default', ['setWatch', 'build'], function() {
  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('source/scripts/**/*.js', ['libraries']);
  gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
  gulp.watch('source/**/*.jade', ['templates']);
  browserSync.init('build/**/*', {
    server: {
      baseDir: 'build'
    }
  });
});
