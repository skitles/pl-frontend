'use strict';

var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();

var options = {
	path: {
		dev: {
			js: {
				source: [
					'./app/code/**/source/**/*.js',
					'./app/code/*.js',
				]
			},
			ts: [
				'./app/code/*.ts',
				'./app/code/**/*.ts'
			],
			scss: {
				source: './app/template/**/assets/style/*.scss'
			},
			css: {
				source: './app/template/**/assets/style/*.css'
			},
			views: {
				source: './app/template/**/view/*.html'
			},
			vendors: {
				js: [
					'./app/vendor/**/*.js',
					'./app/vendor/**/*.js.map'
				]
			},
			index: './app/index.html'
		}
	}
};
  
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});
});

gulp.task('inject', ['scss'], function () {
	gulp.src(options.path.dev.index)
		.pipe(inject(gulp.src(options.path.dev.js.source, { read: false }), {relative: true}))
		.pipe(inject(gulp.src(options.path.dev.css.source, { read: false }), {relative: true}))
		.pipe(inject(gulp.src(options.path.dev.vendors.js, { read: false }), {starttag: '<!-- inject:head:{{ext}} -->', relative: true}))
		.pipe(gulp.dest('./app'));
});

gulp.task('scss', function () {
	gulp.src(options.path.dev.scss.source)
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('./app/template'));
});

gulp.task('watch-js', function() {
	gulp.watch(
		options.path.dev.js.source,
		['inject'],
		browserSync.reload
	);
});

gulp.task('watch-js-vendor', function() {
	gulp.watch(
		options.path.dev.vendors.js,
		['inject'],
		browserSync.reload
	);
});

gulp.task('watch-scss', function() {
	gulp.watch(
		options.path.dev.scss.source,
		['scss']
	);
});

gulp.task('watch-css', function() {
	gulp.watch(
		options.path.dev.css.source,
		['inject']
	);
});

gulp.task('build', [
	'scss',
	'inject',
	'watch-js',
	'watch-js-vendor',
	'watch-scss',
	'watch-css',
	'browser-sync'
]);

/*** TESTS ***/
var jasmine = require('gulp-jasmine'),
    jshint = require('gulp-jshint');

gulp.task('unit-test', function () {
    return gulp.src('./app/code/**/test/unit/**/*-unit.js')
        .pipe(jasmine());
});

gulp.task('lint-test', function() {
    return gulp.src(['./app/code/*.js', './app/code/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', ['unit-test', 'lint-test']);