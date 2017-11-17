'use strict';

// Подключение модулей
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	merge = require('merge-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	csslint = require('gulp-csslint'),
	imagemin = require('gulp-imagemin'),
	eslint = require('gulp-eslint'),
	htmlhint = require('gulp-htmlhint'),
	rename = require('gulp-rename'),
	spritesmith = require('gulp.spritesmith'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');

// Пути сборщика
var path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/',
		sprite: 'src/tmp/'
	},
	src: {
		html: 'src/*.html',
		js: [
			'src/js/**/*.js'
		],
		style: [],
		scss: 'src/style/style-main.scss',
		img: 'src/img/**/*.*',
		sprite: 'src/sprite/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		sprite: 'src/sprite/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	lint: {
		html: 'src/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss'
	},
	clean: './dist'
};

// Task:сборка проекта
gulp.task('sprite:build', function () {
	var spriteData =
		gulp.src(path.src.sprite)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.scss',
			padding: 2,
			imgPath: '../img/sprite.png'
		}));

	spriteData.img.pipe(gulp.dest(path.build.img));
	spriteData.css.pipe(gulp.dest('src/style'));
});

gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('style:build', function () {

	var sassStream = gulp.src(path.src.scss);
	var cssStream = gulp.src(path.src.style);

	return merge(sassStream, cssStream)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(concat('styles.css'))
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		//.pipe(imagemin())
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
	'sprite:build'
]);

// Task:проверка проекта
gulp.task('html:lint', function () {
	gulp.src(path.lint.html)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
});

gulp.task('js:lint', function () {
	gulp.src(path.lint.js)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('style:lint', function () {
	gulp.src(path.lint.style)
		.pipe(sass().on('error', sass.logError))
		.pipe(csslint())
		.pipe(csslint.formatter());
});

gulp.task('lint', [
	'html:lint',
   'js:lint',
    // 'style:lint',
]);

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './dist'
		},
		open: false,
		notify: false
	});
});

// Task:проверка изменений файлов
gulp.task('watch', function () {
	watch([path.watch.html], function (event, cb) {
		gulp.start('html:build', browserSync.reload);
		gulp.start('html:lint');
	});
	watch([path.watch.style], function (event, cb) {
		gulp.start('style:build', browserSync.reload);
		// gulp.start('style:lint');
	});
	watch([path.watch.js], function (event, cb) {
		gulp.start('js:build', browserSync.reload);
		gulp.start('js:lint');
	});
	watch([path.watch.img], function (event, cb) {
		gulp.start('image:build', browserSync.reload);
	});
	watch([path.watch.sprite], function (event, cb) {
		gulp.start('sprite:build');
	});
	watch([path.watch.fonts], function (event, cb) {
		gulp.start('fonts:build', browserSync.reload);
	});
});

// Task:очистка файлов
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

// Task:default
gulp.task('default', ['build', 'browser-sync', 'watch', 'lint']);