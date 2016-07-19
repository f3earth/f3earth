const gulp = require('gulp');
const eslint = require('gulp-eslint');
const webpack = require('webpack');

gulp.task('lint', () =>
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    gulp.src(['gulpfile.js', 'src/**/*.js', 'examples/**/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint({
        useEslintrc: true
    }))
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
            f3Earth: './src/earth.js',
            mouseWheelZoomInteraction: './src/interaction/mouseWheelZoomInteraction.js',
            dragInteraction: './src/interaction/dragInteraction.js',
            doubleClickZoomInteraction: './src/interaction/doubleClickZoomInteraction.js',
            // control: './src/control/control.js'
            attributionControl: './src/control/attributionControl.js',
            zoomControl: './src/control/zoomControl.js'
        },
        output: {
            libraryTarget: 'umd',
            filename: 'dist/[name].js'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    compact: false
                }
            }],
            noParse: [/proj4/]
        }
    };
    webpack(config, (err, stats) => {
        if (err) {
            console.error(err.toString());
        } else {
            console.log(stats.toString());
        }
    });
});

gulp.task('default', ['lint'], () => {
    // This will only run if the lint task is successful...
    gulp.start('webpack');
});
