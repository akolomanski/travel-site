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
svgSprite = require('gulp-svg-sprite'),
config = {
    mode:{
        css:{
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

function copySpriteGraphic (){
    return src('./app/temp/sprite/css/**/*.svg')
        .pipe(dest('./app/assets/images/sprites'));
}

function copySpriteCSS (){
    return src('./app/temp/sprite/css/*.css')
        .pipe(rename('_sprite.css'))
        .pipe(dest('./app/styles/modules'));
}



exports.default = function (){

    browserSync.init({
        server:{
            baseDir: "app"
        }
    });

    watch(['app/index.html'], html);
    watch(['app/styles/**/*.css'], series(styles, cssInject));
    watch(['app/scripts/**/*.js'], series(scripts, scriptsRefresh));
};
exports.createSprite = createSprite;
exports.copySpriteCSS = copySpriteCSS;
exports.icons = series(beginClean, createSprite, parallel(copySpriteGraphic, copySpriteCSS), endClean);
