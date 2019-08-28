const {series, parallel, watch, src, dest} = require('gulp'),
cssFiles = "app/styles/style.css",
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
browserSync = require('browser-sync').create(),
mixins = require('postcss-mixins'),
rename = require('gulp-rename'),
hexrgba = require('postcss-hexrgba'),
del = require('del'),
webpack = require('webpack'),
svg2png = require('gulp-svg2png'),
modernizr = require('gulp-modernizr'),
svgSprite = require('gulp-svg-sprite'),
imageMin = require('gulp-imagemin'),
usemin = require('gulp-usemin'),
cssnano = require('gulp-cssnano'),
rev = require('gulp-rev'),
uglify = require('gulp-uglify'),
config = {
    shape: {
        spacing: {
            padding: 1
        }
    },
    mode:{
        css:{
            variables: {
                replaceSvgWithPng: function(){
                    return function(sprite, render){
                        return render(sprite).split('.svg').join('.png');
                    }
                }
            },
            sprite: 'sprite.svg',
            render:{
                css:{
                    template: './gulp/templates/sprite.css'
                }
            }
        }
    }
};


function beginClean (){
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
}

function endClean (){
    return del(['./app/temp/sprite']);
}

function html(cb){
    browserSync.reload();
    cb();
}

function styles(){
    return src(cssFiles)
        .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
        .pipe(dest('app/temp/styles'));
}

function scripts(cb){
    webpack(require('./webpack.config'), (err, stats)=>{
        if(err){
            console.log(err.toString());
        }
        console.log(stats.toString());
        cb();
    });
}

function scriptsRefresh(cb){
    browserSync.reload();
    cb();
}

function cssInject(){
    return src('app/temp/styles/style.css')
        .pipe(browserSync.stream());
    
}

function createSprite (){
    return src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(dest('./app/temp/sprite'));
    
}

function createPngCopy () {
    return src('./app/temp/sprite/css/*.svg')
        .pipe(svg2png())
        .pipe(dest('./app/temp/sprite/css'))
}

function copySpriteGraphic (){
    return src('./app/temp/sprite/css/**/*.{svg,png}')
        .pipe(dest('./app/assets/images/sprites'));
}

function copySpriteCSS (){
    return src('./app/temp/sprite/css/*.css')
        .pipe(rename('_sprite.css'))
        .pipe(dest('./app/styles/modules'));
}

function modernizer (){
    return src(['./app/styles/**/*.css', './app/scripts/**/*.js'])
        .pipe(modernizr({
            "options": [
                "setClasses"
            ]
        }))
        .pipe(dest('./app/temp/scripts'));
}

function deletedocsFolder(){
    return del("./docs");
}

function copyGeneralFiles(){
    const pathsToCopy = [
        "./app/**/*",
         "!./app/index.html",
         "!./app/assets/images/**",
         "!./app/styles/**",
         "!./app/scripts/**",
         "!./app/temp",
         "!./app/temp/**"
    ]

    return src(pathsToCopy)
        .pipe(dest("./docs"));
}

function optimizeImages (){
    return src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
        .pipe(imageMin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(dest("./docs/assets/images"));
}

function useMin (){
    return src("./app/index.html")
        .pipe(usemin({
            css: [function(){return rev()}, function(){return cssnano()}],
            js:[function(){return rev()}, function(){return uglify()}]
        }))
        .pipe(dest("./docs"));
}




exports.default = function (){

    browserSync.init({
        server:{
            baseDir: "app"
        }
    });

    watch(['app/index.html'], html);
    watch(['app/styles/**/*.css'], series(styles, cssInject));
    watch(['app/scripts/**/*.js'], series(modernizer, scripts, scriptsRefresh));
};
exports.createSprite = createSprite;
exports.copySpriteCSS = copySpriteCSS;
exports.icons = series(beginClean, createSprite, createPngCopy, parallel(copySpriteGraphic, copySpriteCSS), endClean);
exports.modernizr = modernizer;
exports.build = series(deletedocsFolder,parallel(series(beginClean, createSprite, createPngCopy, parallel(copySpriteGraphic, copySpriteCSS), endClean), styles, scripts), parallel(optimizeImages, useMin, copyGeneralFiles));
exports.previewDist = function(){
    browserSync.init({
        server:{
            baseDir: "docs"
        }
    });
}
 