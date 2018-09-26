#!/usr/bin/env node
require('babel-core/register')()

require('require-all')({
  dirname: process.cwd() + '/test',
  filter: process.argv[2] || /.spec\.js$/,
  recursive: true
})
