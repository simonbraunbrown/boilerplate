var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');

const server = browserSync.create();
const clean = () => del(['dist/*']);

const paths = {
    styles: {
        src: 'src/styles/**/**.scss',
        main: 'src/styles/main.scss',
        dest: 'dist/styles/'
    },
    scripts: {
      src: 'src/scripts/**/**.js',
      main: 'src/scripts/index.js',
      dest: 'dist/scripts/'
    }
  };

  function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(notify({ message: 'Scripts task complete' }));
  }

  function styles() {
    return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename({basename: 'style', suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
  }

  function reload(done) {
    server.reload();
    done();
  }
  
  function serve(done) {
    server.init({
      server: {
        baseDir: './'
      }
    });
    done();
  }
  
  function watch(done) {
    gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
    gulp.watch(paths.styles.src, gulp.series(styles, reload));
  }
gulp.task('dev', gulp.series(clean, scripts, styles, serve, watch));

