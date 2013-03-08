var Vow = require('vow'),
    fs = require('fs'),
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
    };

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
     * Remove file by given path
     * @param {String} path
     * @returns {Vow.promise}
     */
    remove : promisify(fs.unlink),

    /**
     * Copy file from sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {Vow.promise}
     */
    copy : function(sourcePath, targetPath) {
        var promise = Vow.promise(),
            sourceStream = fs.createReadStream(sourcePath),
            targetStream = fs.createWriteStream(targetPath),
            errFn = function(err) {
                promise.reject(err);
            };

        sourceStream.on('error', errFn);
        targetStream
            .on('error', errFn)
            .on('close', function() {
                promise.fulfill();
            });

        sourceStream.pipe(targetStream);

        return promise;
    },

    /**
     * Move file from sourcePath to targetPath
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
    exists : promisify(fs.exists),

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
     */
    chown : promisify(fs.chown),

    /**
     * Change the Unix mode for a path. Returns a promise
     * @param {String} path
     * @param mode
     */
    chmod : promisify(fs.chmod),

    /**
     * Normalizes a given path to absolute path
     * @param {String} path
     */
    absolute : promisify(fs.realpath),

    /**
     * Read the contents of a directory by given path
     * @param {String} path
     * @returns {Vow.promise}
     */
    listDir : promisify(fs.readdir),

    /**
     * Make a directory at a given path
     * @param {String} path
     * @param mode
     */
    makeDir : promisify(fs.mkdir),

    /**
     * Remove a directory at the given path
     * @param {String} path
     * @returns {Vow.promise}
     */
    removeDir : promisify(fs.rmdir)
};