const fs = require('fs').promises

const lsCommand = process.argv[2]
const fileName = process.argv[3]

async function main () {
  if (lsCommand === 'ls') {
    try {
      const files = await fs.readdir('./')
      for (let i = 0; i < files.length; i++) {
        // Show matching file name or an error if file does not exist
        if (fileName) {
          if (files[i] === fileName) {
            return console.log(files[i])
          } else if (i === files.length - 1) {
            console.log('File name does not exist')
          }
        } else {
          console.log(files[i])
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
