const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulpPug = require('gulp-pug');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const pug = require('pug');
const cheerio = require('cheerio');
const config = require('./config.json')

const getRecentPosts = num => {
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync('src/archives/').reverse().slice(0, num);
        let recent = [];
        for (filename of files) {
            const html = pug.renderFile(`src/archives/${filename}`, {
                config: config,
                basedir: 'src/'
            });
            const dom = cheerio.load(html);
            const title = dom('title').text();
            const pageNum = filename.slice(0, filename.length - 4);
            const date = dom('span.date').text();

            recent.push({ number: pageNum, title: title, date: date });
        }
        resolve(recent);
    });
};

gulp.task('pug', () => {
    getRecentPosts(config.numberOfRecent).then((recent) => {
        return gulp.src(['src/**/[^_]*.pug'])
            .pipe(plumber())
            .pipe(gulpPug({
                locals: {
                    config: config,
                    recent: recent
                },
                basedir: 'src/'
            }))
            .pipe(gulp.dest('dist/'));
    });
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
    gulp.watch('config.json', ['pug', 'less']);
});

gulp.task('default', ['pug', 'less']);
