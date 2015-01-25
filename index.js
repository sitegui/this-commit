'use strict'

var fs = require('fs'),
	path = require('path')

module.exports = function (gitFolder) {
	var HEAD

	gitFolder = gitFolder || getGitFolder()
	if (!gitFolder) {
		// No .git folder found
		return ''
	}

	try {
		HEAD = fs.readFileSync(path.join(gitFolder, 'HEAD'), 'utf8').trim()
	} catch (e) {
		// Do not throw errors
		return ''
	}

	if (isSHA1(HEAD)) {
		// Detached HEAD
		return HEAD
	} else if (HEAD.substr(0, 5) === 'ref: ') {
		// Attached to another ref (eg, a branch)
		return readRef(gitFolder, HEAD.substr(5))
	}

	// Could not understand HEAD file
	return ''
}

module.exports.asBuffer = function (gitFolder) {
	var asStr = module.exports(gitFolder)
	return asStr ? new Buffer(asStr, 'hex') : null
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
			// Let 'for' iterate
		}
	}
	return ''
}

/**
 * Return the commit name for the given ref name
 * @param {string} gitFolder
 * @param {string} refName
 * @returns {string} - '' if not found
 */
function readRef(gitFolder, refName) {
	var ref
	try {
		ref = fs.readFileSync(path.join(gitFolder, refName), 'utf8').trim()
		return isSHA1(ref) ? ref : ''
	} catch (e) {
		// Last chance: read from packed-refs
		return readPackedRef(gitFolder, refName)
	}
}

/**
 * Return the commit name for the given ref name from packed-refs file
 * @param {string} gitFolder
 * @param {string} refName
 * @returns {string} - '' if not found
 */
function readPackedRef(gitFolder, refName) {
	var packedRefs, i, each, match

	try {
		packedRefs = fs.readFileSync(path.join(gitFolder, 'packed-refs'), 'utf8').split(/\r?\n/)
	} catch (e) {
		return ''
	}

	for (i = 0; i < packedRefs.length; i++) {
		each = packedRefs[i].trim()

		// Look for lines like:
		// 1d6f5f98a254578e19b5eb163077170d45448c26 refs/heads/master
		match = each.match(/^(.{40}) (.*)$/)
		if (match && match[2] === refName && isSHA1(match[1])) {
			return match[1]
		}
	}
	return ''
}

/**
 * @param {string} str
 * @returns {boolean}
 */
function isSHA1(str) {
	return /^[0-9a-f]{40}$/.test(str)
}