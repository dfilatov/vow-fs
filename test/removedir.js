var fs = require('fs'),
    path = require('path'),
    vfs = require('../lib/fs'),
    TEST_DIR = path.join(__dirname, 'test-dir');

module.exports = {
    setUp : function(done) {
        fs.mkdirSync(TEST_DIR);
        done();
    },

    tearDown : function(done) {
        fs.rmdirSync(TEST_DIR);
        done();
    },

    'should remove empty directory' : function(test) {
        var dir = path.join(TEST_DIR, 'dir');
        fs.mkdirSync(dir);
        vfs.removeDir(dir).then(function() {
            test.ok(!fs.existsSync(dir));
            test.done();
        });
    },

    'should remove directory tree' : function(test) {
        var dir = path.join(TEST_DIR, 'dir');
        fs.mkdirSync(dir);
        fs.mkdirSync(path.join(dir, 'a'));
        fs.writeFileSync(path.join(dir, 'a', 'file'), 'file');
        fs.mkdirSync(path.join(dir, 'a', 'b'));
        fs.writeFileSync(path.join(dir, 'a', 'b', 'file1'), 'file1');
        fs.writeFileSync(path.join(dir, 'a', 'b', 'file2'), 'file2');
        vfs.removeDir(dir).then(function() {
            test.ok(!fs.existsSync(dir));
            test.done();
        });
    },

    'should not remove file' : function(test) {
        var filePath = path.join(TEST_DIR, 'file');
        fs.writeFileSync(filePath, 'file');
        vfs.removeDir(filePath).fail(function(err) {
            test.equal(err.code, 'ENOTDIR');
            test.ok(fs.existsSync(filePath));
            fs.unlinkSync(filePath);
            test.done();
        });
    }
};