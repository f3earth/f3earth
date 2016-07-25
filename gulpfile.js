const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const webpack = require('webpack');

gulp.task('lint', () =>
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    gulp.src(['gulpfile.js', 'src/**/*.js', 'plugins/**/*.js', 'examples/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({ useEslintrc: true }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
);

gulp.task('webpack', () => {
    const config = {
        entry: {
            f3earth: './src/fe.js',
            interaction: './plugins/interaction/feInteraction.js',
            control: './plugins/control/feControl.js',
            overlay: './plugins/overlay/feOverlay.js'
        },
        output: {
            libraryTarget: 'umd',
            filename: 'dist/[name].js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin('dist/common.js',
                ['f3earth', 'interaction', 'control', 'overlay'])
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                        compact: false
                    }
                }
            ],
            noParse: [/proj4/]
        }
    };

    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                console.error(err.toString());
                reject();
            } else {
                console.log(stats.toString());
                resolve();
            }
        });
    }).then(() => gulp.start('jsmin'));
});

gulp.task('jsmin', () => {
    gulp.src([
        'dist/common.js', 'dist/f3earth.js', 'dist/control.js',
        'dist/interaction.js', 'dist/overlay.js'])
        .pipe(concat('fe.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint'], () => {
    // This will only run if the lint task is successful...
    gulp.start('webpack');
});
