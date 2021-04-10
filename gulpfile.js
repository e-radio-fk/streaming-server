// gulpfile.js
// Heavily inspired by Mike Valstar's solution:
//   http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/
//
// npyl: patched for multiple configs & removed coffeeify
"use strict";

var     babelify   = require('babelify'),
        browserify = require('browserify'),
        buffer     = require('vinyl-buffer'),
        gulp       = require('gulp'),
        livereload = require('gulp-livereload'),
        merge      = require('merge'),
        rename     = require('gulp-rename'),
        source     = require('vinyl-source-stream'),
        watchify   = require('watchify');

var sirv_config = {
    js: {
        src: './docs/_browserify/_sirv.js',             // Entry point
        outputDir: './docs/scripts',                    // Directory to save bundle to
        outputFile: 'sirv.js'                           // Name to use for bundle
    },
};

var settings_config = {
    js: {
        src: './docs/_browserify/_settings.js',         // Entry point
        outputDir: './docs/scripts',                    // Directory to save bundle to
        outputFile: 'settings.js'                       // Name to use for bundle
    },
}

var streaming_client_config = {
    js: {
        src: './docs/_browserify/_streaming-client.js', // Entry point
        outputDir: './docs/scripts',                    // Directory to save bundle to
        outputFile: 'streaming-client.js'               // Name to use for bundle
    },
}

// configs array
var configs = [sirv_config, settings_config, streaming_client_config]

// This method makes it easy to use common bundling options in different tasks
function bundle (bundler, config) {

    // Add options to add to "base" bundler passed as parameter
    bundler
      .bundle()                                                     // Start bundle
      .pipe(source(config.js.src))                                  // Entry point
      .pipe(buffer())                                               // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile))                           // Rename output from 'main.js'
                                                                    //   to 'bundle.js'
      .pipe(gulp.dest(config.js.outputDir))                         // Save 'bundle' to build/
      .pipe(livereload());                                          // Reload browser if relevant
}

gulp.task('bundle', function () {

    // for each config
    configs.forEach(function(config) {
        var bundler = browserify(config.js.src).transform(babelify, { presets : [ '@babel/preset-env' ] });
        bundle(bundler, config);
    });

    return new Promise(function(resolve, reject) {
        console.log("HTTP Server Started");
        resolve();
    });
})