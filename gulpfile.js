var gulp = require('gulp')

// commenting out sass as we've moved onto PostCSS
// css scripts
// var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var cleanCss = require("gulp-clean-css")
var sourcemaps = require("gulp-sourcemaps")
var concat = require("gulp-concat")

// image minifier script
var imagemin = require("gulp-imagemin")

// github scripts
var ghpages = require("gh-pages")

// browser reload script
var browserSync = require("browser-sync").create()


// sass.compiler = require('node-sass')

gulp.task("css", function(){
    //we want to run "sass css/app.scss app/css --watch"
    // no longer using sass, instead opt for postcss
    return gulp.src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/app.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                require("autoprefixer"),
                require("postcss-preset-env")({
                    stage: 1,
                    browsers: ["IE 11", "last 2 versions"]
                })
            ])
        )
        .pipe(concat("app.css"))
        // .pipe(sass())
        .pipe(
            cleanCss({
                compatibility:'ie8'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream())
})

gulp.task("html", function(){
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
})

gulp.task("fonts", function(){
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function(){
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
})


gulp.task("watch", function(){
// initialize browserSync on watch
    browserSync.init({
        server:{
            baseDir:"dist"
        }
    })
// initialize gulp to watch our sass file
    gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
    gulp.watch("src/css/*", ["css"])
    gulp.watch("src/fonts/*", ["fonts"])
    gulp.watch("src/img/*", ["images"])
})

gulp.task("deploy", function(){
    ghpages.publish("dist")
})

gulp.task('default', ["html", "fonts", "images", "css", "watch"])