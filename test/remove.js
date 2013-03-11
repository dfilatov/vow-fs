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

    'should remove file' : function(test) {
        var file = path.join(TEST_DIR, 'file');
        fs.writeFileSync(file, 'file');
        vfs.remove(file).then(function() {
            test.ok(!fs.existsSync(file));
            test.done();
        });
    },

    'should remove empty directory' : function(test) {
        var dir = path.join(TEST_DIR, 'dir');
        fs.mkdirSync(dir);
        vfs.remove(dir).then(function() {
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
        vfs.remove(dir).then(function() {
            test.ok(!fs.existsSync(dir));
            test.done();
        });
    }
};