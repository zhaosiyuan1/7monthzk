// 引入插件
var gulp = require('gulp');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var webServer = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var path = require('path');
var uglify = require('gulp-uglify');
// 开发环境

// 编译scss
gulp.task('devScss', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >=4.0']
        }))
        .pipe(concat('all.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('src/css'))
});
// 启服务
gulp.task('server', ['devScss'], function() {
    gulp.src('./src')
        .pipe(webServer({
            port: 8888,
            host: "169.254.96.149",
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false;
                }
                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
            }
        }))
});

// 监听scss的变化
gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['devScss']);
});

// 用一个来代替 watch 和 server
gulp.task('dev', ['server', 'watch']);

// 线上环境

// 线上 编译scss
gulp.task('buildScss', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >=4.0']
        }))
        .pipe(concat('all.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('build/css'))
});
// 线上编译js
gulp.task('buildJs', function() {
    gulp.src(['./src/js/*.js', '!./src/js/*.min.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
});
// 用一个命令来代替 buildScss 和 buildJs
gulp.task('build', ['buildScss', 'buildJs']);