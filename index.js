'use strict'

let typescriptFilterGenerator = require('typescript-filter-generator');
let through = require('through2');
let gulpUtil = require('gulp-util');

let PLUGIN_NAME = 'gulp-typescript-filter-generator';

module.exports = function(options) {
    let stream = through.obj(function(file, enc, callback) {
        if (file.isStream()) {
            this.emit('error', new gulpUtil.gulpUtil(PLUGIN_NAME, 'Streams not supported yet!'));
            return callback();
        }
		
        if (file.isBuffer()) {
            if (file.contents) {
                let input = file.contents.toString();
                let result = typescriptFilterGenerator(input, options);

                file.contents = new Buffer(result);

                file.path = file.path.substring(0, file.path.length - 2) + 'ts';
                file.path = file.path.replace(/\\(?![\s\S]*\\)/, '');
    		}
		}

    	this.push(file);
		callback();
    });

    return stream;
};
