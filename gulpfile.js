const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");

//compile scss to css
function style() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}
//compile tailwind css
function css() {
  return gulp
    .src("./scss/tailwind.css")
    .pipe(postcss([require("tailwindcss"), require("autoprefixer")]))
    .pipe(gulp.dest("./css"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch("./scss/**/*.scss", style);
  gulp.watch("./*html").on("change", browserSync.reload);
  gulp.watch("./scss/**/*.js").on("change", browserSync.reload);
}

exports.style = gulp.series([style, css]);
exports.watch = watch;
