const fs = require('fs').promises

const lsCommand = process.argv[2]

async function main () {
  if (lsCommand === 'ls') {
    try {
      // List all files in the current directory
      const files = await fs.readdir('./')
      for (const file of files) {
        console.log(file)
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log('Usage: node index.js ls')
  }
}

main()
