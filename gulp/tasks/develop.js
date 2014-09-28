var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('develop', function() {
    nodemon({
        script: 'app.js',
        ext: 'html js styl handlebars',
        ignore: ['client/public/**', 'node_modules/**'],
        legacyWatch: true
    })
        .on('restart', ['build']);
});
