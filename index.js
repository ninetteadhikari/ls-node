const fs = require('fs').promises

const lsCommand = process.argv[2]
const path = process.argv[3]

async function main () {
  if (lsCommand === 'ls') {
    try {
      let files
      if (path) {
        files = await fs.readdir(path)
      } else {
        files = await fs.readdir('./')
      }
      for (const file of files) {
        console.log(file)
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log('Usage: node index.js ls /path/to/list/file')
  }
}

main()
