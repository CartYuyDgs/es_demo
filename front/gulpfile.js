var gulp = require('gulp');
var cssnano = require('gulp-cssnano');//压缩css文件
var rename = require('gulp-rename');//重命名包
var uglify = require('gulp-uglify');//压缩js文件
var concat = require('gulp-concat');//合并多个文件
var imagemin = require('gulp-imagemin');//图片压缩
var cache = require('gulp-cache');//图片缓存
var bs = require('browser-sync').create();
var sass = require('gulp-sass');

var path = {
    'html':'./templates/**/',
    'css':'./src/css/',
    'js':'./src/js/',
    'images':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images/'
};

//定义任务
gulp.task('html',function () {
    gulp.src(path.html+'*.html')
        .pipe(bs.stream())
});

gulp.task("css",function () {
    gulp.src(path.css+'*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(cssnano())
        .pipe(rename({"suffix":'.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});

gulp.task('js',function () {
    gulp.src(path.js+'*.js')
        .pipe(uglify({
            'toplevel':true,//顶部变量进行压缩
		    'compress':{//取消所有console打印
			'drop_console':true
        }}))
        .pipe(rename({"saffix":'.min'}))
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

gulp.task("images",function () {
    gulp.src(path.images+'*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});

gulp.task('watch',function () {
    gulp.watch(path.css+'*.scss',['css']);
    gulp.watch(path.html+'*.html',['html']);
    gulp.watch(path.js+'*.js',['js']);
    gulp.watch(path.images+'*.*',['images'])
});

gulp.task('bs',function () {
    bs.init({
        'server':{
            'baseDir':'./'
        }
    });
});

gulp.task('default',['bs','watch']);