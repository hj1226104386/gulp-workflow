/**
 * @author: huangjin
 * @parameter:
 * @description: 自动化构建配置
 *
 * 1、添加统一配置项
 * 2、压缩、合并、混淆
 * 3、替换html、css中的资源引用路径
 *
 * @Date:2017/11/17
 */
"use strict";

var gulp = require('gulp');
var rev = require('gulp-rev'); // 创建版本号（hash）值
var revCollector = require('gulp-rev-collector'); // 将版本号添加到文件后
var sequence = require('run-sequence'); // 让gulp任务同步运行
var clean = require('gulp-clean'); // 清除dist构建目录
var htmlmin = require('gulp-htmlmin'); // 压缩html
var cssnano = require('gulp-cssnano'); // css压缩
var autoprefixer = require('gulp-autoprefixer'); // 自动处理css兼容后缀
var babel = require('gulp-babel'); // es6转es5
var concat = require('gulp-concat'); // 文件合并
var uglify = require('gulp-uglify'); // js混淆
var imagemin = require('gulp-imagemin'); // 图片压缩
var browserSync = require('browser-sync').create(); // 启动本地服务，修改免F5刷新
var useref = require('gulp-useref'); // 替换HTML中资源的引用路径

// 路径配置
var path = {
    // 静态资源输入路径
    input: {
        html: ['./src/*.html'],
        css: ['./src/css/*.css'],
        js: ['./src/js/*.js'],
        images: ['./src/images/*'],
        lib: ['./src/lib/**/*']
    },
    // 静态资源输出路径
    output: {
        html: './dist',
        css: './dist/css',
        js: './dist/js',
        images: './dist/images',
        lib: './dist/lib',
    },
    // manifest文件保存路径
    rev: {
        baseRev: './rev',
        css: './rev/css',
        js: './rev/js',
        images: './rev/images'
    }
};

// 1、统一将html中的资源替换成压缩合并后的文件名并将HTML特定标签中的文件合并
gulp.task('html', function() {
        var options = {
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        };
        return gulp.src(path.input.html)
            .pipe(useref())
            .pipe(htmlmin(options))
            .pipe(gulp.dest(path.output.html))
    })
    // 2、删除掉上一步操作生成的css、js合并文件(因为在后面的添加版本号过程中也会生成，避免重复)
gulp.task('del', function() {
    return gulp.src([path.output.css, path.output.js])
        .pipe(clean());
});
// 2、css合并压缩并加版本号
gulp.task('css', function() {
    return gulp.src(path.input.css)
        .pipe(concat('all.min.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest(path.output.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.rev.css))
});
// 3、js合并压缩并加版本号
gulp.task('js', function() {
    return gulp.src(path.input.js)
        .pipe(concat('all.min.js')) // 合并
        .pipe(babel({ // 转es5
            presets: ['es2015']
        }))
        .pipe(uglify()) // 混淆
        .pipe(rev())
        .pipe(gulp.dest(path.output.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.rev.js))
});
// 4、图片压缩并加版本号
gulp.task('img', function() {
    return gulp.src(path.input.images)
        // .pipe(imagemin())           // 压缩图片
        .pipe(rev())
        .pipe(gulp.dest(path.output.images))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.rev.images))
});
// 5、给文件添加版本号，针对于已经替换引用路径的HTML文件，在dist目录下
gulp.task('rev', function() {
    return gulp.src([path.rev.baseRev + '/**/*.json', path.output.html + '/**/*.html', path.output.html + '/**/*.css'])
        .pipe(revCollector({
            replaceReved: true, // 一定要添加，不然只能首次能成功添加hash
            dirReplacements: {
                'css': 'css/',
                'js': 'js/',
                'images': 'images/',
                'lib': 'lib/',
            }
        }))
        .pipe(gulp.dest('dist'));
});

// 6、复制其他库到构建目录(只要保持html和库的相对路径一致，就可以不用替换路径)
gulp.task('copy', function() {
    return gulp.src(path.input.lib)
        .pipe(gulp.dest(path.output.lib))
});

// 7、移除rev目录和dist构建目录
gulp.task('clean', function() {
    return gulp.src(['./dist', './rev'])
        .pipe(clean());
});
// 8、监控文件的改变，页面动态刷新
/*gulp.task('serve', function() {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: ['./src/'],  // 启动服务的目录 默认 index.html
            index: 'index.html'   // 自定义启动文件名
        }
    });
});*/
// 9、监控文件变化，自动重新构建
/*gulp.task('watch',function () {
    gulp.watch('./src/!**!/!*', ['clean','html','del','css','js','img','rev','copy']);
})*/
// 9、build
gulp.task('default', function(callback) {
    // sequence的作用是让所有任务同步执行，gulp默认的是异步执行
    sequence('clean', 'html', 'del', 'css', 'js', 'img', 'rev', 'copy', function() {
        console.log('构建完成');
    })
})