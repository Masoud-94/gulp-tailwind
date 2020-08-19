const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const options = require("./package.json").options;
const tailwindcss = require("tailwindcss");
const cleanCSS = require("gulp-clean-css");
const merge = require("merge-stream");
const concat = require("gulp-concat");
const webpack = require("webpack-stream");
const plumber = require("gulp-plumber");
const gutil = require("gulp-util");

//all style file compile in one file
function styles() {
  //compile sass file to css and concat all in one file
  var sassStream = gulp
    .src("./src/styles/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("scss-files.css"));
  //compile all css file to one file
  var cssStream = gulp
    .src("./src/styles/css/**/*.css")
    .pipe(concat("css-files.css"));
  //compile tailwind using tailwind config
  var tailwindStream = gulp
    .src("./src/styles/tailwind/tailwind.css")
    .pipe(
      postcss([tailwindcss(options.config.tailwindjs), require("autoprefixer")])
    );
  //merge all three files in one file
  return (mergedStream = merge(sassStream, cssStream, tailwindStream)
    .pipe(concat("styles.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true })));
}

//compiling our Javascripts
function scripts() {
  //this is where our dev JS scripts are
  return (
    gulp
      .src(["./src/js/_include/**/*.js", "./src/js/scripts/**/*.js"])
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())
      .pipe(
        webpack({
          watch: false,
          mode: "development",
          module: {
            rules: [
              {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "@babel/preset-env",
                        {
                          targets: "> 0.25%, not dead",
                          useBuiltIns: "usage",
                        },
                      ],
                    ],
                  },
                },
              },
            ],
          },
        })
      )
      //this is the filename of the compressed version of our JS
      .pipe(concat("app.js"))
      //catch errors
      .on("error", gutil.log)
      //where we will store our finalized, compressed script
      .pipe(gulp.dest("dist/"))
      //notify browserSync to refresh
      .pipe(browserSync.reload({ stream: true }))
  );
}

//open browser and watch for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch("./src/styles/**/*.*", styles).on("change", styles);
  gulp.watch("./*html").on("change", browserSync.reload);
  gulp.watch("./src/js/**/*.js").on("change", scripts);
}

exports.build = gulp.series([styles, scripts]);
exports.watch = watch;
