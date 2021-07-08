const fs = require('fs').promises

const lsCommand = process.argv[2]
const fileNames = process.argv.slice(3)

async function readFile (filePath) {
  const files = await fs.readdir(filePath)
  for (const file of files) {
    console.log(file)
  }
}

async function main () {
  if (lsCommand === 'ls') {
    try {
      // List all files in the current directory
      if (!fileNames.length) {
        readFile('./')
      }
      // Show matching file name for multiple files or error message if file
      // does not exist
      for (const file of fileNames) {
        try {
          const fileStat = await fs.stat(file)
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
  } else {
    console.log('Usage: node index.js ls filename')
  }
}

main()
