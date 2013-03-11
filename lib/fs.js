/**
 * Vow-fs
 *
 * Copyright (c) 2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.4
 */

var Vow = require('vow'),
    fs = require('fs'),
    path = require('path'),
    slice = Array.prototype.slice,
    promisify = function(nodeFn) {
        return function() {
            var promise = Vow.promise(),
                args = slice.call(arguments);
            args.push(function(err) {
                err? promise.reject(err) : promise.fulfill(arguments[1]);
            });
            nodeFn.apply(fs, args);
            return promise;
        };
    },
    makeDir = promisify(fs.mkdir),
    remove = promisify(fs.unlink),
    removeDir = promisify(fs.rmdir),
    undef;

module.exports = {
    /**
     * Read file by given path
     * @param {String} path
     * @param {String} [encoding=utf8]
     * @returns {Vow.promise}
     */
    read : promisify(fs.readFile),

    /**
     * Write data to file by given path
     * @param {String} path
     * @param {String|Buffer} data
     * @param {String} [encoding=utf8]
     * @returns {Vow.promise}
     */
    write : promisify(fs.writeFile),

    /**
     * Append data to file by given path
     * @param {String} path
     * @param {String|Buffer} data
     * @param {String} [encoding=utf8]
     * @returns {Vow.promise}
     */
    append : promisify(fs.appendFile),

    /**
     * Remove given path
     * @param {String} pathToRemove
     * @returns {Vow.promise}
     */
    remove : function(pathToRemove) {
        var _this = this;
        return _this.isDir(pathToRemove).then(function(isDir) {
            return isDir?
                _this.listDir(pathToRemove)
                    .then(function(list) {
                        return list.length && Vow.all(
                            list.map(function(file) {
                                var fullPath = path.join(pathToRemove, file);
                                return _this.isDir(fullPath).then(function(isDir) {
                                    return isDir?
                                        _this.remove(fullPath) :
                                        remove(fullPath);
                                });
                            }));
                    })
                    .then(function() {
                        return removeDir(pathToRemove);
                    }) :
                remove(pathToRemove);
        });
    },

    /**
     * Copy file from sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {Vow.promise}
     */
    copy : function(sourcePath, targetPath) {
        return this.isFile(sourcePath).then(function(isFile) {
            if(!isFile) {
                var err = Error();
                err.errno = 28;
                err.code = 'EISDIR';
                err.path = sourcePath;
                throw err;
            }

            var promise = Vow.promise(),
                sourceStream = fs.createReadStream(sourcePath),
                errFn = function(err) {
                    promise.reject(err);
                };

            sourceStream
                .on('error', errFn)
                .on('open', function() {
                    var targetStream = fs.createWriteStream(targetPath);
                    sourceStream.pipe(
                        targetStream
                            .on('error', errFn)
                            .on('close', function() {
                                promise.fulfill();
                            }));
                });

            return promise;
        });
    },

    /**
     * Move from sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {Vow.promise}
     */
    move : promisify(fs.rename),

    /**
     * Extract fs.Stats about a given path
     * @param {String} path
     * @returns {Vow.promise}
     */
    stat : promisify(fs.stat),

    /**
     * Test whether or not the given path exists
     * @param {String} path
     * @returns {Vow.promise}
     */
    exists : function(path) {
        var promise = Vow.promise();
        fs.exists(path, function(exists) {
            promise.fulfill(exists);
        });
        return promise;
    },

    /**
     * Create a hard link from the sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {Vow.promise}
     */
    link : promisify(fs.link),

    /**
     * Create a relative symbolic link from the sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @param {String} [type=file] can be either 'dir', 'file', or 'junction'
     * @returns {Vow.promise}
     */
    symLink : promisify(fs.symlink),

    /**
     * Change the owner for a given path using Unix user-id and group-id numbers
     * @param {String} path
     * @param uid
     * @param gid
     * @returns {Vow.promise}
     */
    chown : promisify(fs.chown),

    /**
     * Change the Unix mode for a path. Returns a promise
     * @param {String} path
     * @param mode
     * @returns {Vow.promise}
     */
    chmod : promisify(fs.chmod),

    /**
     * Normalizes a given path to absolute path
     * @param {String} path
     * @returns {Vow.promise}
     */
    absolute : promisify(fs.realpath),

    /**
     * Check whether the given path is a file
     * @param {String} path
     * @returns {Vow.promise}
     */
    isFile : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isFile();
        });
    },

    /**
     * Check whether the given path is a directory
     * @param {String} path
     * @returns {Vow.promise}
     */
    isDir : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isDirectory();
        });
    },

    /**
     * Check whether the given path is a socket
     * @param {String} path
     * @returns {Vow.promise}
     */
    isSocket : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isSocket();
        });
    },

    /**
     * Read the contents of a directory by given path
     * @param {String} path
     * @returns {Vow.promise}
     */
    listDir : promisify(fs.readdir),

    /**
     * Make a directory at a given path, recursively creating any branches that doesn't exist
     * @param {String} dirPath
     * @param [mode=0777]
     * @param [failIfExist=false]
     * @returns {Vow.promise}
     */
    makeDir : function(dirPath, mode, failIfExist) {
        if(typeof mode === 'boolean') {
            failIfExist = mode;
            mode = undef;
        }

        var _this = this,
            dirName = path.dirname(dirPath);

        return _this.exists(dirName).then(function(exists) {
            return exists?
                makeDir(dirPath, mode).fail(function(e) {
                    if(e.code !== 'EEXIST' || failIfExist) {
                        throw e;
                    }

                    return _this.isDir(dirPath).then(function(isDir) {
                        if(!isDir) {
                            throw e;
                        }
                    });
                }) :
                _this.makeDir(dirName, mode).then(function() {
                    return makeDir(dirPath, mode);
                });
        });
    }
};