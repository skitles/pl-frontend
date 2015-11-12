'use strict';

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
	minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
	imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
});

gulp.task('build', ['clean', 'views', 'styles', 'browserify'], function () { });

gulp.task('clean', function () {
	gulp.src('./dist', { read: false })
		.pipe(rimraf({ force: true }));
});

gulp.task('styles', function () {
	gulp.src('./app/**/assets/*.scss')
		.pipe(sass({ onError: function (e) { console.log(e); } }))
		.pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
		.pipe(gulp.dest('./dist/css/'))
		.pipe(browserSync.stream());
});

gulp.task('browserify', function () {
	gulp.src(['./build/*.js', './build/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());

	gulp.src('./dist/js/app.js')
		.pipe(browserify({
			insertGlobals : true,
			debug : false
		}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('views', function () {
	var opts = {
        conditionals: true,
        spare:true
    };
	
	gulp.src('./app/index.html')
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());

	gulp.src('./app/**/views/**/*.html')
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest('./dist/views/'))
		.pipe(browserSync.stream());
});

gulp.task('imagemin', function(){
    return gulp.src('./app/**/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function () {

	gulp.watch(['./build/*.js', './build/**/*.js'], [
		'browserify'
	], browserSync.reload);
	gulp.watch(['./app/**/assets/**/*.scss'], [
		'styles'
	], browserSync.reload);
	gulp.watch(['./app/*.html','./app/**/views/**/*.html'], [
		'views'
	], browserSync.reload);
	gulp.watch(['./app/**/images/**/*..+(png|jpg|gif|svg)'], [
		'imagemin'
	], browserSync.reload);

	//gulp.watch(['./dist/**']).on('change', browserSync.reload);
});

gulp.task('default', ['clean', 'build', 'browser-sync', 'watch']);

/*** TESTS ***/
var jasmine = require('gulp-jasmine'),
    jshint = require('gulp-jshint');

gulp.task('unit-test', function () {
    return gulp.src('./app/**/test/unit/**/*-unit.js')
        .pipe(jasmine());
});

gulp.task('lint-test', function() {
    return gulp.src(['./app/*.js', './app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', ['unit-test', 'lint-test']);