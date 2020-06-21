const { dest, src, series } = require('gulp')
const babel = require('gulp-babel')

function bulid(cb) {
    src('./src/**/*.js')
        .pipe(babel())
        .pipe(dest('dist'))

    cb()
}

function copy(cb) {
    src('./src/**/*.json')
        .pipe(dest('dist'))

    cb()
}

exports.dist = series(bulid, copy)
