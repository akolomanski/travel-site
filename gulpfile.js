const {series, watch, src, dest} = require('gulp'),
cssFiles = "app/styles/style.css",
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import');


async function print(){
    
    return await Promise.resolve(console.log("It Works!"));
} 

function html(cb){
    console.log("imagine all the htmls")
    cb();
}

function styles(){
    return src(cssFiles)
    .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
    .pipe(dest('app/temp/styles')
    );
}





exports.default = function (){
    watch(['app/index.html'], html);
    watch(['app/styles/**/*.css'], styles);
};
exports.haha = series(html);
