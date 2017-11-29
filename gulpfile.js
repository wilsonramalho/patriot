var
  gutil       = require('gulp-util'),
  notify       = require('gulp-notify'),
  browserSync = require('browser-sync'),
  del         = require('del'),
  gulp        = require('gulp'),
  $           = require("gulp-load-plugins")({
                  pattern: ['gulp-*', 'gulp.*'],
                  replaceString: /\bgulp[\-.]/,
                  lazy: false
                });


gulp.task('html', function() {
  gulp
    .src('source/*.html')
    .pipe($.htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true
    }))
    .pipe(gulp.dest('build'))
    .pipe(notify("HTML has been deployed"))
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/main.less')
  .pipe($.plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe($.less())
  .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe($.minifyCss({
      keepSpecialComments: 0,
      removeEmpty: true
    }))
    .pipe($.sourcemaps.write('../maps'))
  .pipe(gulp.dest('build/assets/stylesheets/'))
  .pipe(notify("CSS has been deployed"))
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
  .pipe($.imagemin({
    interlaced: true,
    optimizationLevel: 5,
    progressive: true
  }))
  .pipe(gulp.dest('build/assets/images'))
  .pipe(notify("Images has been deployed"))
});

gulp.task('vendors', function() {
  gulp
    .src([
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
    'source/scripts/plugins.js'
    ])
    .pipe($.plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/assets/scripts'))
    .pipe(notify("JS Vendor has been deployed"))
});

gulp.task('scripts', function() {
  gulp
    .src([
      'source/scripts/scripts.js',
      'source/scripts/shame.js'
    ])
    .pipe($.plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/assets/scripts'))
    .pipe(notify("JS Scripts has been deployed"))
});

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/fontawesome/fonts/**/*',
    'source/fonts/**/*'
  ])
  .pipe($.plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(gulp.dest('build/assets/fonts/'))
  .pipe(notify("Fonts has been deployed"))
});

gulp.task('build', ['clear'], function() {
  gulp.start(
    'html',
    'stylesheets',
    'images',
    'vendors',
    'scripts',
    'fonts'
  );
});

// Clear

gulp.task('clear', function() {
  return gulp.src([
    'build/*',
    'build/assets/fonts',
    'build/assets/images',
    'build/assets/scripts',
    'build/assets/stylesheets'
  ], {
    read: false
  })
  .pipe($.rimraf());
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Default

gulp.task('watch', ['setWatch', 'build'], function() {
  gulp.watch('source/*.html', ['html']);
  gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
  gulp.watch('source/scripts/**/*.js', ['scripts']);
  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('source/images/**/*', ['images']);
  browserSync.init('build/**/*', {
    server: {
      baseDir: 'build'
    }
  });
});
