var
  gulp =        require('gulp'),
  pkg =         require('./package.json'),
  changed =     require('gulp-changed'),
  concat =      require('gulp-concat'),
  filesize =    require('gulp-filesize'),
  jade =        require('gulp-jade'),
  jest =        require('gulp-jest'),
  jshint =      require('gulp-jshint'),
  less =        require('gulp-less'),
  livereload =  require('gulp-livereload'),
  cssmin =      require('gulp-minify-css'),
  notify =      require('gulp-notify'),
  plumber =     require('gulp-plumber'),
  rename =      require('gulp-rename'),
  shell =       require('gulp-shell'),
  uglify =      require('gulp-uglify'),
  gutil =       require('gulp-util'),
  watch =       require('gulp-watch'),
  source =      require('vinyl-source-stream'),
  watchify =    require('watchify'),
  browserify =  require('browserify'),
  del =         require('del'),
  path =        require('path'),
  reactify =    require('reactify'),
  browserifyShim = require('browserify-shim'),
  merge =       require('merge-stream'),
  filesConfig = require('./config/files.config');

// main tasks
gulp.task('core', ['watchify', 'concat:css', 'copy:assets']);
gulp.task('dev',  ['core', 'jade:dev']);
gulp.task('prod', ['core', 'jade:prod', 'uglify']);

// server tasks
gulp.task('serve:dev', function () {
  nodemon({
    script: './api/server.js',
    env: {'NODE_ENV': 'development'}
  });
});

gulp.task('serve:prod', function () {
  nodemon({
    script: './api/server.js',
    env: {'NODE_ENV': 'production'}
  });
});

gulp.task('debug', shell.task([pkg.scripts.debug]));

// setup the global watches
gulp.task('watch:dev', function () {
  gulp.watch([client('/less/**/*.less'), './semantic-ui/src/**/*'], ['concat:css']);
  gulp.start('dev');
});

gulp.task('watch:prod', function () {
  gulp.watch([client('/less/**/*.less'), './semantic-ui/src/**/*'], ['concat:css']);
  gulp.watch([dist('/js/app.js')], ['uglify']);
  gulp.start('prod');
});

// run tests
gulp.task('jest', function () {
  return gulp.src('./client/test/unit/**')
    .pipe(plumber())
    .pipe(watch('./client/test/unit/**/*.js'))
    .pipe(jest(pkg.jest));
});

// Build index.html
gulp.task('clean:index', function (cb) {
  return del(['./client/dist/index.html'], cb);
});

gulp.task('jade:dev', ['clean:index'], function () {
  return gulp.src('./api/src/views/index.jade')
    .pipe(plumber())
    .pipe(watch('./api/src/views/index.jade'))
    .pipe(jade({
      pretty: true,
      data: {
        env: 'development'
      }
    }))
    .pipe(gulp.dest('./client/dist'))
    .pipe(livereload());
});

gulp.task('jade:prod', ['clean:index'], function () {
  return gulp.src('./api/src/views/index.jade')
    .pipe(plumber())
    .pipe(watch('./api/src/views/index.jade'))
    .pipe(jade({
      pretty: true,
      data: {
        env: 'production',
        debug: false
      }
    }))
    .pipe(gulp.dest('./client/dist'))
    .pipe(livereload());
});

// clean and copy assets
gulp.task('clean:assets', function (cb) {
  return del([
    dist('/font'),
    dist('/img')], cb);
});

gulp.task('copy:assets', ['clean:assets'], function () {
  var fa = gulp.src(client('/js/font-awesome/fonts/**'))
    .pipe(gulp.dest(dist('/font/font-awesome')));

  var img = gulp.src(client('/img/**'))
    .pipe(gulp.dest(dist('/img')));

  return merge(fa, img);
});

// semantic ui tasks
gulp.task('semantic:copy', function (cb) {
  var src = gulp.src('./node_modules/semantic-ui/src/**')
    .pipe(gulp.dest('./semantic-ui/src'));

  var tasks = gulp.src('./node_modules/semantic-ui/tasks/**')
    .pipe(gulp.dest('./semantic-ui/tasks'));

  var files = gulp.src([
    './node_modules/semantic-ui/gulpfile.js',
    './node_modules/semantic-ui/package.json',
    './node_modules/semantic-ui/semantic.json.example'
  ])
    .pipe(gulp.dest('./semantic-ui'));

  return merge(src, tasks, files);
});

gulp.task('semantic:install', ['semantic:copy'], shell.task(['cd semantic-ui && npm install && gulp install']));
gulp.task('semantic:build',   shell.task(['cd semantic-ui && gulp build']));

// Compile and concatenate less into css
gulp.task('concat:css', ['semantic:build'], function () {
  return gulp.src([
      './node_modules/select2/select2.css',
      './node_modules/nprogress/nprogress.css',
      './semantic-ui/dist/semantic.css'
    ])
    .pipe(concat('style.css'))
    .pipe(gulp.dest(dist('/css')))
    .pipe(cssmin())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(dist('/css')))
    .pipe(livereload())
    .on('error', gutil.log.bind(gutil, 'Error concatenating CSS'));
});

// Compile and minify the Javascripts
gulp.task('watchify', function() {
  var bundler = watchify(browserify('./client/src/main.js', watchify.args));

  bundler.transform('browserify-shim');
  bundler.transform('reactify');
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest(dist('/js')))
      .pipe(livereload());
  }

  return rebundle();
});

gulp.task('uglify', ['watchify'], function () {
  return gulp.src(dist('/js/app.js'))
    .pipe(gulp.dest(dist('/js')))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist('/js')))
    .pipe(livereload())
    .on('error', gutil.log.bind(gutil, 'Error during minification.'));
});

// helper to navigate to the dist assets dir
function dist(dest) {
  return './client/dist/assets' + dest;
}

// helper to navigate to the client assets dir
function client(dest) {
  return './client/assets' + dest;
}
