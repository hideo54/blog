const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulpPug = require('gulp-pug');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const pug = require('pug');
const cheerio = require('cheerio');
const google = require('googleapis');
const config = require('./config.json');

const getPostData = filename => {
    const html = pug.renderFile(`src/archives/${filename}`, {
        config: config,
        basedir: 'src/'
    });
    const dom = cheerio.load(html);
    const title = dom('title').text();
    const pageNum = filename.slice(0, filename.length - 4);
    const date = dom('span.date').text();
    return { number: pageNum, title: title, date: date };
};

const getRecentPosts = num => {
    const files = fs.readdirSync('src/archives/').reverse().slice(0, num);
    let recent = [];
    for (filename of files) {
        const data = getPostData(filename);
        recent.push(data);
    }
    return recent;
};

const getPopularPosts = num => {
    return new Promise((resolve, reject) => {
        if (config.numberOfPopular === 0) { resolve([]); } else {
            const googleKey = require('./google-key.json');
            const jwtClient = new google.auth.JWT(
                googleKey.client_email, null, googleKey.private_key,
                ['https://www.googleapis.com/auth/analytics.readonly'], null
            );
            const analytics = google.analytics('v3');
            analytics.data.ga.get({
                auth: jwtClient,
                ids: config.googleAnalyticsViewId,
                'start-date': '7daysAgo',
                'end-date': 'today',
                metrics: 'ga:pageviews',
                dimensions: 'ga:pagePath',
                filters: 'ga:pagePath=~^\/archives\/[0-9]*$',
                sort: '-ga:pageviews'
            }, async (err, data) => {
                if (err) { console.log(err); } else {
                    const popular = data.rows.slice(0, num).map(array => {
                        return getPostData(`${array[0].slice(10)}.pug`);
                    });
                    resolve(popular);
                }
            });
        }
    });
};

gulp.task('pug', async () => {
    const recent = await getRecentPosts(config.numberOfRecent);
    const popular = await getPopularPosts(config.numberOfPopular);
    return gulp.src(['src/**/[^_]*.pug'])
        .pipe(plumber())
        .pipe(gulpPug({
            locals: {
                config: config,
                recent: recent,
                popular: popular
            },
            basedir: 'src/'
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
    gulp.watch('config.json', ['pug', 'less']);
});

gulp.task('default', ['pug', 'less']);
