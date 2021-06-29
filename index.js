const fs = require('fs').promises

const lsCommand = process.argv[2]
const fileName = process.argv[3]

async function main () {
  if (lsCommand === 'ls') {
    try {
      // List all files in the current directory
      if (!fileName) {
        const files = await fs.readdir('./')
        for (const file of files) {
          console.log(file)
        }
      }
      // Show matching file name or an error if file does not exist
      if (fileName) {
        await fs.stat(`./${fileName}`)
        console.log(fileName)
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File or folder does not exist')
      } else {
        console.error(err)
      }
    }
  } else {
    console.log('Usage: node index.js ls filename')
  }
}

main()
