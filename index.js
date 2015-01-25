'use strict'

var fs = require('fs'),
	path = require('path')

module.exports = function () {

}

/**
 * Find the absolute path for the git folder
 * @returns {string} - '' if not found
 */
function getGitFolder() {
	// Based on logic in Module._nodeModulePaths at
	// https://github.com/joyent/node/blob/master/lib/module.js
	var from = path.resolve('.'),
		parts = from.split(process.platform === 'win32' ? /[\/\\]/ : /\//),
		tip, dir

	for (tip = parts.length - 1; tip >= 0; tip--) {
		dir = parts.slice(0, tip + 1).concat('.git').join(path.sep)
		try {
			if (fs.statSync(dir).isDirectory()) {
				// Found a valid .git directory
				return dir
			}
		} catch (e) {
			// Let for iterate
		}
	}
	return ''
}