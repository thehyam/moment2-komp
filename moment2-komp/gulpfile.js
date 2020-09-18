const { src, dest, watch, series, parallel } = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const concatCSS = require("gulp-concat-css");
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//Start BrowserSync
gulp.task('browser-sync', function() {
   BrowserSync.init({
      //Proxy for Mac 
      proxy: 'http://localhost:8888/'
   });
});

//Search Paths

const files = {
    htmlPath: "src/**/*.html", 
    cssPath: "src/**/*.css",
    jsPath:"src/**/*.js" 
}

//Copy HTML-files
 function copyHTML () {
     return src(files.htmlPath)
        .pipe(dest('pub')
        //Function to live stream the project
        .pipe(browserSync.stream())
    );
 }

 //Concat and minify js files  
 function jsTask(){
     return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('pub/js')
         //Function to live stream the project
         .pipe(browserSync.stream())
        );
 }
 //Concat and minify CSS files
 function cssTask(){
    return src(files.cssPath)
       .pipe(concatCSS('styles.css'))
       .pipe(cleanCSS())
       .pipe(dest('pub/css')
        //Function to live stream the project
        .pipe(browserSync.stream())
       );
}


 //Watcher 
 function watchTask(){
     watch([files.htmlPath, files.jsPath, files.cssPath],
        
        parallel(copyHTML, jsTask, cssTask));
 }

 //Default Task
 exports.default = series(
    parallel(copyHTML, jsTask, cssTask),
    watchTask
 );
