#!/usr/bin/env node
// The above shebang command is used to make the file executable using node

const fs = require('fs')
const fsp = fs.promises

const command = process.argv[2]
const fileNames = process.argv.slice(3)

async function readFile (filePath) {
  const files = await fsp.readdir(filePath)
  for (const file of files) {
    console.log(file)
  }
}

async function main () {
  if (command === 'ls') {
    try {
      // List all files in the current directory
      if (!fileNames.length) {
        readFile('./')
      }
      // Show matching file name for multiple files or error message if file
      // does not exist
      for (const file of fileNames) {
        try {
          const fileStat = await fsp.stat(file)
          // List files inside a directory
          if (fileStat.isDirectory()) {
            readFile(file)
          } else {
            console.log(file)
          }
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.log(`'${file}' does not exist`)
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  } else if (command === 'cat') {
    for (const file of fileNames) {
      // Stream content of large files in chunks
      const readStream = fs.createReadStream(file)
      // Read file data
      readStream.on('data', (chunk) => {
        console.log(chunk.toString())
      })
      readStream.on('error', (err) => {
        if (err.code === 'EISDIR') {
          console.log(`${file} is a directory. Add a file to read.`)
        } else {
          console.log(err)
        }
      })
    }
  } else {
    console.log('Usage: node index.js ls filename')
    console.log('Usage: node index.js cat filename')
  }
}

main()
