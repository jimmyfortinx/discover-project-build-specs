const gulp = require('gulp');
const ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('test', ['build'], function () {
    return gulp.src([
        'tmp/**/*.spec.js',
    ])
        .pipe(jasmine());
});

gulp.task('build', function () {
    return gulp.src([
        'typings/index.d.ts',
        'src/**/*.ts'
    ])
        .pipe(ts(tsProject))
        .pipe(gulp.dest('tmp'));
});

gulp.task('test:watch', ['test'], function () {
   gulp.watch('src/**/*.ts', ['test']);
});