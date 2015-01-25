/*globals it*/
'use strict'

var thisCommit = require('../'),
	target = '1d6f5f98a254578e19b5eb163077170d45448c26'
require('should')

it('should work for this repo', function () {
	thisCommit().should.match(/^[a-f0-9]{40}$/)
	thisCommit.asBuffer().should.have.length(20)
})

it('should work for detached head', function () {
	thisCommit('test/detached-head/fake.git').should.be.equal(target)
})

it('should work for simple ref', function () {
	thisCommit('test/simple-ref/fake.git').should.be.equal(target)
})

it('should work for packed ref', function () {
	thisCommit('test/packed-ref/fake.git').should.be.equal(target)
})