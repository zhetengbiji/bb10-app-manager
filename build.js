var NwBuilder = require('nw-builder')

var nw = new NwBuilder({
  files: './src/**/*',
  platforms: ['osx64', 'win32', 'win64'],
  version: '0.60.0',
  flavor: 'normal',
  macIcns: './icon.icns',
  winIco: './icon.ico'
})

nw.on('log', console.log)

nw.build().then(function () {
  console.log('all done!')
}).catch(function (error) {
  console.error(error)
})
