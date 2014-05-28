var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    //cache         = require('gulp-cache'),
    newer         = require('gulp-newer'),
    clean         = require('gulp-clean'),
    concat        = require('gulp-concat'),
    imagemin      = require('gulp-imagemin'),
    jade          = require('gulp-jade'),
    jshint        = require('gulp-jshint'),
    less          = require('gulp-less'),
    livereload    = require('gulp-livereload'),
    lr            = require('tiny-lr'),
    minifycss     = require('gulp-minify-css'),
    //notify        = require('gulp-notify'),
    server        = lr(),
    uglify        = require('gulp-uglify');

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/bootstrap/fonts/**/*',
    'source/fonts/**/*'
  ])
  .pipe(gulp.dest('build/fonts/'))
  .pipe(livereload(server))
  //.pipe(notify({message: 'Fonts task complete.'}));
});

gulp.task('images', function() {
  return gulp.src([
    'source/images/**/*.gif',
    'source/images/**/*.jpg',
    'source/images/**/*.png'
  ])
  .pipe(newer('build/images/'))
  .pipe(imagemin({interlaced: true, optimizationLevel: 5, progressive: true}))
  .pipe(gulp.dest('build/images/'))
  .pipe(livereload(server))
  //.pipe(notify({message: 'Images task complete.'}));
});

gulp.task('libraries', function() {
  return gulp.src([
    'bower_components/jquery/jquery.min.js',
    'bower_components/bootstrap/js/transition.js',
    //'bower_components/bootstrap/js/alert.js',
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
    'bower_components/bootstrap-select/bootstrap-select.js',
    'bower_components/jquery.validation/dist/jquery.validate.js',
    'source/scripts/jquery.scripts.js',
    'source/scripts/jquery.calls.js'
  ])
  .pipe(concat('libraries.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts/'))
  .pipe(livereload(server))
  //.pipe(notify({message: 'Libraries task complete.'}));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe(less())
  .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe(minifycss({keepSpecialComments: 0, removeEmpty: true}))
  .pipe(gulp.dest('build/stylesheets/'))
  .pipe(livereload(server))
  //.pipe(notify({message: 'Stylesheets task complete.'}));
});

gulp.task('templates', function() {
  return gulp.src('source/*.jade')
  .pipe(jade({pretty: true}))
  .pipe(gulp.dest('build/'))
  .pipe(livereload(server))
  //.pipe(notify({message: 'Templates task complete.'}))
});

gulp.task('clean', function() {
  return gulp.src('build/', {read: false})
  .pipe(clean());
});

gulp.task('default', function() {
  gulp.start('fonts', 'images', 'stylesheets', 'libraries', 'templates');
});

gulp.task('watch', ['default'], function() {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
    gulp.watch(['source/fonts/**/*'], ['fonts']);
    gulp.watch(['source/images/**/*'], ['images']);
    gulp.watch(['source/stylesheets/**/*.less'], ['stylesheets']);
    gulp.watch(['gulpfile.js', 'source/scripts/**/*.js'], ['libraries']);
    gulp.watch(['source/**/*.jade'], ['templates']);
  });
});
