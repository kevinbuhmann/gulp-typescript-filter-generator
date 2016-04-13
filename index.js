'use strict'

let typescriptFilterGenerator = require('typescript-filter-generator');
let pluralize = require('pluralize');
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

                if (result) {
                    file.contents = new Buffer(result);

                    let folderMatch = file.relative.match(new RegExp(`([A-Za-z0-9]+)`));
                    let folder = pluralize(folderMatch[1]);

                    let filenameMatch = file.relative.match(new RegExp(`([A-Za-z0-9]+)\.cs`));
                    let filename = filenameMatch[1][1].endsWith('Filter') ?
                    filenameMatch[1] : `${filenameMatch[1]}Filter`;

                    file.path = `${file.base}${folder}${filename}.ts`;

          					this.push(file);
                }
            }
        }

        callback();
    });

    return stream;
};
