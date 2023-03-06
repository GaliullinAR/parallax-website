const {src, dest, watch, series, parallel} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function browser() {
    browserSync.init({
        server: {
            baseDir: './src/'
        },
        port: 9000,
        notify: false
    })
}

function scripts() {
    return src('./src/js/app.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('./src/js/'))
}

function styles() {
    return src('./src/scss/style.scss')
    .pipe(autoprefixer({
        overrideBrowserslist: [
            'last 10 version'
        ] 
    }))
    .pipe(concat('style.min.css'))
    .pipe(scss({
        outputStyle: 'compressed'
    })).on('error', scss.logError)
    .pipe(dest('./src/css/'))
    .pipe(browserSync.stream());
}

function watcher() {
    watch('./src/scss/style.scss', styles);
    watch('./src/js/app.js', scripts);
    watch('./src/*.html').on('change', browserSync.reload);
}

function build() {
    return src([
        './src/css/style.min.css',
        './src/js/app.min.js',
        './src/images/**/*.[svg, jpg, jpeg, webp, png]',
        './src/fonts/*.*',
        './src/**/*.html'
    ], {base: './src/'})
    .pipe(dest('dist'))
}

function cleaner() {
    return src('./dist')
    .pipe(clean());
}

exports.watcher = watcher;
exports.styles = styles;
exports.scripts = scripts;
exports.browser = browser;
exports.cleaner = cleaner;
exports.build = build;

exports.default = parallel(styles, scripts, browser, watcher);

