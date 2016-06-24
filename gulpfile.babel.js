// const fs = require('fs');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
// const json = JSON.parse(fs.readFileSync('./package.json'));
const browserSync = require('browser-sync');
const merge = require('merge-stream');
const reload = browserSync.reload;
const args = require('yargs').argv;


const config = (function config() {
  // const appName = json.name;

  const path = {
    bower: './bower_components/',
    assets: './assets',
    static: './static',
  };

  return {
    path,
    scss: {
      input: [`${path.assets}/scss/style.scss`],
      include: [
        `${path.bower}/bootstrap-sass/assets/stylesheets`,
        `${path.bower}/font-awesome/scss`,
        `${path.assets}/scss/`,
      ],
      output: `${path.static}/css`,
      watch: [`${path.assets}/scss/**.scss`],
    },
    fonts: {
      input: [
        `${path.bower}/font-awesome/fonts/**.*`,
        `${path.assets}/fonts/**/*.*`,
      ],
      output: `${path.static}/fonts`,
    },
    script: {
      input: [`${path.assets}/js/*.js`],
      vendor: [
        `${path.bower}/jquery/dist/jquery.js`,
        `${path.bower}/imagesloaded/imagesloaded.pkgd.js`,
        `${path.bower}/masonry/dist/masonry.pkgd.js`,
        `${path.bower}/bootstrap-sass/assets/javascripts/bootstrap.js`,
      ],
      output: {
        dir: `${path.static}/js`,
        filename: 'script.js',
      },
      watch: [`${path.assets}/js/*.js`],
    },
    images: {
      input: [`${path.assets}/images/**/*`],
      output: `${path.static}/images`,
      watch: [`${path.assets}/images/**/*`],
    },
  };
}());

gulp.task('bower', () =>
  plugins.bower(config.path.bower)
);

gulp.task('fonts', () =>
  gulp.src(config.fonts.input)
    .pipe(gulp.dest(config.fonts.output))
);

gulp.task('js', () => {
  const project = gulp.src(config.script.input)
    .pipe(plugins.babel());
  const vendor = gulp.src(config.script.vendor);

  return merge(project, vendor)
    .pipe(plugins.concat(config.script.output.filename))
        .pipe(gulp.dest(config.script.output.dir))
        .pipe(reload({ stream: true }))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.script.output.dir))
        .pipe(reload({ stream: true }));
});

gulp.task('scss', () =>
  gulp.src(config.scss.input)
    .pipe(plugins.sass({
      style: 'expanded',
      includePaths: config.scss.include,
    }))
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(config.scss.output))
    .pipe(reload({ stream: true }))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(config.scss.output))
    .pipe(reload({ stream: true }))
);

gulp.task('images', () =>
  gulp.src(config.images.input)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.images.output))
    .pipe(reload({ stream: true }))
);

gulp.task('serve', () => {
  browserSync({
    proxy: args.host || 'localhost:8000',
  });
});

gulp.task('watch', ['serve'], () => {
  config.scss.watch.forEach(path =>
    gulp.watch(path, ['scss'])
  );

  config.script.watch.forEach(path =>
    gulp.watch(path, ['js'])
  );

  config.images.watch.forEach(path =>
    gulp.watch(path, ['images'])
  );
});

gulp.task('build', ['bower', 'fonts', 'js', 'scss', 'images']);
gulp.task('default', ['js', 'scss', 'watch']);
