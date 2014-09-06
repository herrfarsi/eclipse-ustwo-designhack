var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

gulp.task('styles', function() {
  return gulp.src([
      'library/scss/style.scss'
    ])
    .pipe(compass({
      config_file: 'library/scss/config.rb',
      css: 'library/css',
      sass: 'library/scss',
      image: 'library/img',
      style: 'compressed'
    }))
    .on('error', function() {
      gutil.log(gutil.colors.red('## FIX THE SCSS FFS! ###'))
      gutil.beep()
    })
    .pipe(gulp.dest('library/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('scripts', function() {
    return gulp.src([
      'library/js/lib/jquery.velocity.js',
      'library/js/lib/jquery.velocity.ui.js',
      'library/js/*.js'
    ])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('library/js/min'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('library/js/min'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('images', function() {
  return gulp.src(['library/img/source/**/*'])
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('library/img'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Images task complete' }));
});
gulp.task('clean', function() {
  return gulp.src(['library/css', 'library/js', 'library/img'], {read: false})
    .pipe(clean());
});
gulp.task('php', function(){
  return gulp.src(['*.php', '!functions.php'])
    .pipe(livereload(server));
});

//Default
gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {
  // Livereload listen on default port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
    gulp.watch('library/scss/**/*.scss', ['styles']);
    gulp.watch('library/js/**/*.js', ['scripts']);
    gulp.watch(['library/img/source/*', '!library/img/opt/**/*/'], ['images']);
    gulp.watch(['*.php', '!functions.php'], ['php']);
  });
});