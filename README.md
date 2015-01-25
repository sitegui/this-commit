# This Commit

Return the current commit name

## Install
`npm install this-commit --save`

## Usage

```js
var commit = require('this-commit')()
// commit is a string like '5cdb9922ab793900847a3c3801831f1f242be11b'
// or '' if could not found

var commit = require('this-commit').asBuffer()
// commit is a Buffer instance (or null)
```

## Features
* Read from `.git` folder on disk, do not execute `git`
* Work from sub-dirs, will look for `.git` on parent directories
* Support for detached head
* Support for packed refs