var gulp            = require('gulp'),
    jst             = require('gulp-jst-concat'),
    browserify      = require('gulp-browserify'),
    sass            = require('gulp-ruby-sass'),
    browserSync     = require('browser-sync'),
    autoprefixer    = require('gulp-autoprefixer'),
    svgstore        = require('gulp-svgstore');

var paths = {
  sourceRoot: 'source/',
  buildRoot:  'build/',
  source: {
    scss:       'source/style/scss/**/*.scss',
    fonts:      'source/style/fonts/**/*',
    icons:      'source/style/icons/*.svg',
    script:     'source/scripts/main.js',
    scripts:    'source/scripts/**/*.js',
    scriptRoot: 'source/scripts/',
    images:     'source/images/**/*',
    index:      'source/index.html'
  },
  build: {
    style:      'build/style/css',
    fonts:      'build/style/fonts',
    icons:      'build/style/icons',
    script:     'build/scripts',
    images:     'build/images',
  }
};

var bs;


gulp.task('scripts', function() {

  gulp.src( paths.source.script )
    .pipe( browserify({
      insertGlobals: true
    }))
    .pipe( gulp.dest( paths.build.script ) );

});


gulp.task('style', function() {
  
  return gulp.src( paths.source.scss )
    .pipe( sass() )
    .pipe( autoprefixer("last 2 versions", "> 1%", "ie 8", "ie 7") )
    .pipe( gulp.dest( paths.build.style ) )
    .pipe( browserSync.reload({ stream:true }) );
});


gulp.task('copy', function () {

  gulp.src( paths.source.fonts )
    .pipe( gulp.dest( paths.build.fonts ) );

  gulp.src( paths.source.images )
    .pipe( gulp.dest( paths.build.images ) );

  gulp.src( paths.source.scriptRoot + 'masonry.js' )
    .pipe( gulp.dest( paths.build.script ) );

  gulp.src( paths.source.scriptRoot + 'modernizr.js' )
    .pipe( gulp.dest( paths.build.script ) );

  gulp.src( paths.source.scriptRoot + 'detect-device.js' )
    .pipe( gulp.dest( paths.build.script ) );

});


gulp.task('icons', function () {

  return gulp.src( paths.source.icons )
    .pipe(svgstore({ 
      fileName: 'icons.svg', 
      prefix: 'icon-', 
      inlineSvg: false
    }))
    .pipe(gulp.dest( paths.build.icons ));

});


// gulp.task('templates', function () {
  
//   gulp.src( paths.source.templates )
//     .pipe( jst('templates.js', {
//       renameKeys: ['^.*templates/(.*).ejs', '$1'] // Removes file path from key
//     }))
//     .pipe( gulp.dest( paths.build.template ) );
// });


gulp.task('browser-sync', function() {
    bs = browserSync.init(null, {
      server: {
        baseDir: paths.buildRoot
      },
      open: false
    });
});








// Rerun the task when a file changes
gulp.task('watch', ['browser-sync'], function() {
  
  gulp.watch(paths.source.scripts, ['scripts']);
  gulp.watch(paths.source.scss, ['style']);
  // gulp.watch(paths.source.templates, ['templates', 'scripts']);
  gulp.watch(paths.source.index, ['copy']);

  gulp.watch([ paths.build.style + '/**/*.css', paths.build.script + '**/*.js' ], function (file) {
    if (file.type === "changed") {
      bs.events.emit("file:changed", {path: file.path});
    }
  });
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'style', 'copy', 'browser-sync']);
