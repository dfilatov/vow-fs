Vow-fs [![Build Status](https://secure.travis-ci.org/dfilatov/vow-fs.png)](http://travis-ci.org/dfilatov/vow-fs)
======

[Vow](https://github.com/dfilatov/jspromise)-based file I/O for Node.js

Getting Started
---------------
You can install Vow-fs using Node Package Manager (npm):

    npm install vow-fs


````javascript
var fs = require('vow-fs');
````

API
---
####read(path, [encoding=utf8])####
Returns a promise for the file's content at a given ````path````.
####write(path, data, [encoding=utf8])####
Write ````data```` to file at a given ````path````. Returns a promise for the completion of the operation.
####append(path, data, [encoding=utf8])####
Append ````data```` to file's content at a given ````path````. Returns a promise for the completion of the operation.
####remove(path)####
Removes a file at a given ````path````. Returns a promise for the completion of the operation.
####copy(sourcePath, targetPath)####
Copies a file from ````sourcePath```` to ````targetPath````. Returns a promise for the completion of the operation.
####move(sourcePath, targetPath)####
####stats(path)####
####exists(path)####
####link(sourcePath, targetPath)####
####symLink(sourcePath, targetPath, [type])####
####chown(path, uid, gid)####
####chmod(path, mode)####
####absolute(path)####
####isFile(path)####
Returns a promise for whether the given ````path```` is a file.
####isDir(path)####
Returns a promise for whether the given ````path```` is a directory.
####isSocket(path)####
Returns a promise for whether the given ````path```` is a socket.
####isSymLink(path)####
Returns a promise for whether the given ````path```` is a symbolic link.
####listDir(path)####
####makeDir(path, [mode=0777], [failIfExist=false])####
Makes a directory at a given ````path```` and any necessary subdirectories (like ````mkdir -p````). Returns a promise for the completion of the operation.
####removeDir(path)####
Recursively removes a directory at a given path (like ````remove -rf````). Returns a promise for the completion of the operation.
