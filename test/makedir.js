describe('makeDir', function() {
    var TEST_DIR = path.join(__dirname, 'test-dir');

    before(function() {
        fs.mkdirSync(TEST_DIR);
    });

    it('should make directory', function(done) {
        var dir = path.join(TEST_DIR, 'a');
        vfs.makeDir(dir).then(function() {
            fs.existsSync(dir).should.be.true;
            fs.statSync(dir).isDirectory().should.be.true;
            done();
        });
    });

    it('should make directory if exists', function(done) {
        var dir = path.join(TEST_DIR, 'a');
        fs.existsSync(dir).should.be.true;
        vfs.makeDir(dir).then(function() {
            fs.existsSync(dir).should.be.true;
            fs.statSync(dir).isDirectory().should.be.true;
            done();
        });
    });

    it('should be failed if directory exists', function(done) {
        var dir = path.join(TEST_DIR, 'a');
        fs.existsSync(dir).should.be.true;
        vfs.makeDir(dir, true).fail(function() {
            done();
        });
    });

    it('should be failed if file with same name exists', function(done) {
        var dir = path.join(TEST_DIR, 'test-file');
        fs.writeFileSync(dir, 'test');
        vfs.makeDir(dir).fail(function() {
            done();
        });
    });

    it('should make directory tree', function(done) {
        var dir = path.join(TEST_DIR, 'a/b/c');
        vfs.makeDir(dir).then(function() {
            fs.existsSync(dir).should.be.true;
            fs.statSync(dir).isDirectory().should.be.true;
            done();
        });
    });

    it('should make directory tree if exists', function(done) {
        var dir = path.join(TEST_DIR, 'a/b/c');
        vfs.makeDir(dir).then(function() {
            done();
        });
    });

    after(function() {
        fs.rmdirSync(path.join(TEST_DIR, 'a/b/c'));
        fs.rmdirSync(path.join(TEST_DIR, 'a/b'));
        fs.rmdirSync(path.join(TEST_DIR, 'a'));
        fs.unlink(path.join(TEST_DIR, 'test-file'));
        fs.rmdirSync(path.join(TEST_DIR));
    });
});