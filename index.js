#!/usr/bin/env node
// The above shebang command is used to make the file executable using node

const fs = require('fs')
const fsp = fs.promises

// The process.argv property returns the path of the command, for example: /Users/username/nls
// So lastIndexOf and slice method can be used to extract the command
const index = process.argv[1].lastIndexOf('/')
const command = process.argv[1].slice(index + 1)
const fileNames = process.argv.slice(2)

async function readFile (filePath) {
  const files = await fsp.readdir(filePath)
  for (const file of files) {
    console.log(file)
  }
}

async function main () {
  if (command === 'nls') {
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
  } else if (command === 'ncat') {
    if (!fileNames.length) {
      console.log('Please add file name')
    }
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
    console.log('Usage: nls filename')
    console.log('Usage: ncat filename')
  }
}

main()
