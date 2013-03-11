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
####read(path, [encoding])####
####write(path, data, [encoding])####
####append(path, data, [encoding])####
####remove(path)####
####copy(sourcePath, targetPath)####
####move(sourcePath, targetPath)####
####stats(path)####
####exists(path)####
####link(sourcePath, targetPath)####
####symLink(sourcePath, targetPath, [type])####
####chown(path, uid, gid)####
####chmod(path, mode)####
####absolute(path)####
####isFile(path)####
####isDir(path)####
####isSocket(path)####
####listDir(path)####
####makeDir(path, [mode], [failIfExist=false])####
