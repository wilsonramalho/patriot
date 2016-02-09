var
  $           = require('gulp-load-plugins')(),
  gutil       = require('gulp-util'),
  browserSync = require('browser-sync'),
  del         = require('del'),
  gulp        = require('gulp');

// var del = require('del');
// var browserSync = require('browser-sync');

// var gutil = require('gulp-util');

// var plugins = require("gulp-load-plugins")({
//     pattern: ['gulp-*', 'gulp.*'],
//     replaceString: /\bgulp[\-.]/,
//     lazy: false,
//     rename: {
//       'gulp-minify-css' : 'minifycss',
//       'gulp-if' : 'gulpIf',
//       'gulp-jade-inheritance' : 'jadeInheritance'
//     }
// });

var onError = function (err) {  
  gutil.beep();
  console.log(err);
};

gulp.task('fonts', function() {
  gulp.src('source/fonts/**/*')
  .pipe($.plumber({
    errorHandler: onError
  }))
  .pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('images', function() {
  gulp.src([
    'source/images/**/*.gif',
    'source/images/**/*.ico',
    'source/images/**/*.jpeg',
    'source/images/**/*.jpg',
    'source/images/**/*.png',
    'source/images/**/*.svg'
  ])
  .pipe($.imagemin({
    interlaced: true,
    optimizationLevel: 5,
    progressive: true
  }))
  .pipe(gulp.dest('build/assets/images'));
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
  .pipe($.concat('libraries.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('build/assets/scripts'));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe($.plumber({
    errorHandler: onError
  }))
  .pipe($.less())
  .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe($.minifyCss({keepSpecialComments: 0, removeEmpty: true}))
  .pipe(gulp.dest('build/assets/stylesheets'));
});

gulp.task('templates', function() {
  gulp.src(['!source/partials/**/!(_)*.jade', 'source/**/!(_)*.jade'])
  .pipe($.changed('build', { extension: '.html' }))
  .pipe($.plumber())
  .pipe($.jade({ pretty: true }))
  .pipe(gulp.dest('build'));
});

gulp.task('build', function() {
  gulp.start(
    'fonts',
    'images',
    'libraries',
    'stylesheets',
    'templates'
  );
});

gulp.task('clear', function() {
  del('build/*')
});

gulp.task('watch', function() {

  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('source/images/**/*', ['images']);
  gulp.watch('source/scripts/**/*.js', ['libraries']);
  gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
  gulp.watch('source/**/*.jade', ['templates']);

  browserSync.init('build/**/*', {
    server: { baseDir: 'build' }
  });

});
