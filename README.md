# DRY project log


This document will log the process of developing a node.js project to demonstrate the implementation of the DRY principle


## Implement `ls` in Node.js

As an example project to demonstrate the use of DRY principle implement the command line programme `ls` in Node.js. Following are the instructions


* ignores any command line options like `ls -la` etc. and just make the basic invocation of `ls` work:
    * `ls` (without any files, lists all files in the current directory)
    * `ls filename` (shows matching file name, or an error if that file does not exist)
    * `ls filename1` filename2 … filenameN (same as before, but multiple files
    * `ls dirname/` (show all files inside dirname)

### `ls` (without any files, lists all files in the current directory)

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/1_ls/index.js)

For initial setup a node project is created and the file system module is imported. Functions of the `fs` can directly return promises so the following is used for promises

`        const fs = require('fs').promises` 

Since `ls` is meant to list all the files, [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) module is used to read the content of a directory. Each file is looped through and file name is logged.


### `ls filename` (shows matching file name, or an error if that file does not exist) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/2_ls_filename/index.js)

The File system modules were reviewed to decide which module would be relevant to provide the status of a file to ensure if it exists or not. [f.stat](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback) module provides file metadata and throws an error if file does not exist. So this module is used to show the name of the file that is passed and show an error message if file name does not exist.


```
        await fs.stat(`./${fileName}`)
        console.log(fileName)
```



### `ls filename1` filename2 … filenameN (same as before, but multiple files 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/3_ls_file1_file2/index.js)

To capture multiple file names `.slice()` method is used to get all the files names entered.


```
        const fileNames = process.argv.slice(3)
```


A `for/in` loop is used to go over all the file names and do a status check using the `fs.stat` module. The `for/in` loop returned the keys of the files, since we required the file names to log, this is later updated to `for/of` loop.


```
        for (const file of fileNames) {
	     …
        }
```



### `ls dirname/` (show all files inside dirname) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/4_ls_dirname/index.js)

To identify if the name entered is a file or a folder name, different options were explored. At first it was assumed that for folders a folder path will be entered and regular expression can be used to identify if the text entered is a name or a path. However if the folder name is not entered as a path then the regex will not be helpful in identifying the type.

The file system modules were further looked into to see if there is any module that identifies a file and folder. After reading up further on [f.stat](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback) it was found that `f.stat` has a method `isDirectory()` which runs a check to see if the name entered is a directory or not and returns a boolean. If the name is directory the same `fs.readdir` module is used to read the content of the directory and log the file names.


```
        if (fileStat.isDirectory()) {
          const dirFiles = await fs.readdir(file)
          for (const file of dirFiles) {
            console.log(file)
          }
        }
```



### Abstraction of `fs.readdir` and file log 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/5_readdir_abstraction/index.js)

In the code the `fs.readdir` module was called twice, once for reading the files in the current directory and then reading the files in the second level of directory (directory inside the current directory). Instead of writing the code to read the files using `fs.readdir` and logging the file names twice, this is extracted in a separate function `readFile` and this is used when it is required to read files from a directory and log their names.


```
        async function readFile (filePath) {
          const files = await fs.readdir(filePath)
          for (const file of files) {
        	console.log(file)
          }
        }
```



### `cat filename `(show file content) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/6_cat_filename/index.js)

The <code>[fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)</code> file system module is used to read the content of a file. Initially only <code>fs.readfile</code> was used and it returned a raw buffer which is not easily readable. To show the string content of the file, encoding <code>utf8</code> was specified.


```
        const readFile = await fs.readFile(fileNames, 'utf8')
          	console.log(readFile)
```



### `cat filename `(use stream to show large file content) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/7_cat_readStream/index.js)

The [fs.createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options) module is used to reduce memory usage when reading large files. The readFile module buffers the entire file which can reduce performance. So the streaming module is preferred. On the ‘data’ event, the stream will display the data in chunks. The default stream settings are kept.


```
        const readStream = await fs.createReadStream(fileNames)
          	readStream.on('data', (chunk) => {
            	console.log(chunk.toString())
          	})
```


Initially `require('fs').promises` was used for `createReadStream()` module. However this did not work as the `createReadStream()` is on the regular `require('fs')` object and does not return a promise. So separate constants are created for `fs` and `fs.promises`, where `fsp` is used for modules like `readFile` where promises are returned and `fs` for `createReadStream.`


```
        const fs = require('fs')
        const fsp = fs.promises
```



### `cat file1 file2 `(read content from multiple files) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/8_cat_file1_file2/index.js)

The fileNames variable is changed to capture all the file names and a for-loop is added to read through multiple files.


```
        const fileNames = process.argv.slice(3)
```


An error message is also added to display when a directory is passed instead of a file.


```
        if (err.code === 'EISDIR') {
           console.log(`${file} is a directory. Add a file to read.`)
        }
```



### `./nls / ./ncat `(symlink file to use `nls` and `ncat`) 

[Code example](https://github.com/ninetteadhikari/ls-node-project/blob/9_executable_script/index.js)

Currently the script is run by calling `node index.js commandname arguments`. In this step the way the script is run is changed to just say `nls` or `ncat`.

To do so, some research is done on how to use [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) to make the script executable using node. Shebang is the first line of the file which tells the OS which interpreter to use. In this case `node` is being used. We are using `/usr/bin/env node`, which means we’re telling OS to run `env` and `env` will run `node` and `node` will in turn execute the script.


```
        #!/usr/bin/env node
```


After the shebang script is set up, a link is created for the `index.js` file so that it can be accessed using a custom name like `nls` and `ncat`. `man ln` is used in the terminal to get details on using `ln` to link files. Specifically `ln -s` is reviewed to see how to create a symbolic link of a file in a different location.


```
        ln -s index.js nls
        ln -s index.js ncat
```


Once the links are set up, the `index.js` file can run by using `./nls` or `./ncat`. 

The `process.argv` property returns the path of the command, for example: `/Users/username/nls`. So `lastIndexOf` and `slice` methods are used to extract the command `nls` and `ncat` to run the script to list and read file content.


```
        const index = process.argv[1].lastIndexOf('/')
        const command = process.argv[1].slice(index + 1)
