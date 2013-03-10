var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    mocha = new Mocha({ reporter : 'spec' });

fs.readdirSync(__dirname)
    .filter(function(file){
        return fs.statSync(path.join(__dirname, file)).isFile() && file !== 'runner.js';
    })
    .forEach(function(file) {
        mocha.addFile(path.join(__dirname, file));
    });

mocha.run(function(failures){
    process.exit(failures);
});