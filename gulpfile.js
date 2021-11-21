var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    rollup = require('gulp-rollup'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');

const server = browserSync.create();
const clean = () => del(['dist/*']);

const paths = {
    html: {
      src: 'src/index.html',
      dest: 'dist/'
    },
    styles: {
        src: 'src/styles/**/**.scss',
        main: 'src/styles/main.scss',
        dest: 'dist/'
    },
    scripts: {
      src: 'src/scripts/**/**.js',
      main: 'src/scripts/main.js',
      dest: 'dist/'
    }
  };

  function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
      .pipe(sourcemaps.init())
      .pipe(rollup({
        input: paths.scripts.main,
        output: {
          format: 'umd',
        }
      }))
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(notify({ message: 'Scripts task complete' }));
  }

  function styles() {
    return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename({basename: 'style', suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
  }

  function transferHTML() {
    return gulp.src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest));
  }

  function reload(done) {
    server.reload();
    done();
  }
  
  function serve(done) {
    server.init({
      server: {
        baseDir: './dist/'
      }
    });
    done();
  }
  
  function watch(done) {
    gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
    gulp.watch(paths.styles.src, gulp.series(styles, reload));
    gulp.watch(paths.html.src, gulp.series(transferHTML, reload));
  }
gulp.task('dev', gulp.series(clean, transferHTML, scripts, styles, serve, watch));

