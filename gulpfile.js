var path  	= require('path');

var gulp  	= require('gulp');
var gutil 	= require('gulp-util');

var gless 	= require('gulp-less');
var gminify = require('gulp-minify-css');

var gcoffee = require('gulp-coffee');
var guglify = require('gulp-uglify');

gulp.task('default', function () {
	gulp.watch('src/less/*.less', ['less']);
	gulp.watch('src/coffee/*.coffee', ['coffee']);
});

gulp.task('less', ['minify'], function () {
	console.log('LESS files compiled and minified')
});

gulp.task('compile-less', function () {
	return gulp.src('src/less/*.less')
		.pipe(gless({
			paths: [ path.join(__dirname, 'src', 'less', 'includes') ]
		}).on('error', gutil.log))
		.pipe(gulp.dest('src/stylesheets'))
});

gulp.task('minify', ['compile-less'], function () {
	return gulp.src('src/stylesheets/*.css')
		.pipe(gminify())
		.pipe(gulp.dest('build/stylesheets'))
});

gulp.task('coffee', ['uglify'], function () {
	console.log('coffee files compiled and uglified')
});

gulp.task('compile-coffee', function () {
	return gulp.src('src/coffee/*.coffee')
		.pipe(gcoffee({ bare: true }).on('error', gutil.log))
		.pipe(gulp.dest('src/javascript'))
});

gulp.task('uglify', ['compile-coffee'], function () {
	return gulp.src('src/javascript/*.js')
		.pipe(guglify())
		.pipe(gulp.dest('build/javascript'))
});