const fs = require('fs').promises

const lsCommand = process.argv[2]
const fileNames = process.argv.slice(3) 

async function main () {
  if (lsCommand === 'ls') {
    try {
      // List all files in the current directory
      if (!fileNames.length) {
        const files = await fs.readdir('./')
        for (const file of files) {
          console.log(file)
        }
      }
      // Show matching file name for multiple files or error message if file
      // does not exist
      try {
        if (fileNames.length) {
          for (const i in fileNames) {
            await fs.stat(fileNames[i])
            console.log(fileNames[i])
          }
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File or folder does not exist')
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
