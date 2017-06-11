const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');

gulp.task('pug', () => {
    return gulp.src('src/**/*.pug')
        .pipe(plumber())
        .pipe(pug({
            locals: require('./config.json')
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('less', () => {
    return gulp.src('src/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['pug', 'less'], () => {
    gulp.watch('src/**/*.pug', ['pug']);
    gulp.watch('src/style.less', ['less']);
});

gulp.task('default', ['pug', 'less']);
