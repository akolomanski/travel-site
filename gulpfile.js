const {series, watch, src, dest} = require('gulp'),
cssFiles = "app/styles/style.css",
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
browserSync = require('browser-sync').create(),
mixins = require('postcss-mixins');


async function print(){
    
    return await Promise.resolve(console.log("It Works!"));
} 

function html(cb){
    browserSync.reload();
    cb();
}

function styles(){
    return src(cssFiles)
    .pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
    .pipe(dest('app/temp/styles'));
}

function cssInject(){
    return src('app/temp/styles/style.css')
        .pipe(browserSync.stream());
    
}





exports.default = function (){

    browserSync.init({
        server:{
            baseDir: "app"
        }
    });

    watch(['app/index.html'], html);
    watch(['app/styles/**/*.css'], series(styles, cssInject));
};
exports.haha = series(html);
