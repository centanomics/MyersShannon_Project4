const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const reload      = browserSync.reload;

const src = {
    scss: 'scss/*.scss',
    css:  'css',
    html: '*.html',
    js: 'js/*.js'
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
    gulp.watch(src.js).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(src.css))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);