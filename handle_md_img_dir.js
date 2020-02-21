const osHomedir      = require('os-homedir')
const { dlog, Info } = require('../lib/dlog')
const execa          = require('execa')
const fs             = require('fs')
const path           = require('path')

const util = require('util')

const promiseFinally = require('promise.prototype.finally')

// 向 Promise.prototype 增加 finally()
promiseFinally.shim()



/*
*
CSAPP
Essay
Git
HTML
Image
JailBreak
Linux
Mac
Shell
Swift
VPN
iOS
node
node_modules
source
ssr
terminal*/

var program = require('commander')
//文件根目录
let rootDir = '/Users/lirenqiang/Desktop/MarkElephantExportFiles/'
let booksourceRootDir = '/Users/lirenqiang/git_repository/booksource/'
;(async function () {

  // dlog('hello', new Info(`'hello'`), 0)
  // return

  // let bookName          = process.argv[2]

  // 处理 Summary File
  // await handleSummaryFile(bookName, '实例文档')

  await unzip()

  // 读取文件目录
  let files = await pReadDir(rootDir)

  var fileName
  var imageFiles = []
  // 分别获取 文件名称 和 图片文件 列表
  for (let key in files) {
    let fn = files[key]
    if (fn.includes('.md')) {
      fileName = fn
    }

    if (fn.includes('.png')) {
      imageFiles.push(fn)
    }
  }

  var filePath = rootDir + fileName
  dlog(filePath, new Info(`filePath`), 0)

  // 从文档中获取 bookname
  let bookName = await getBookName(filePath)

  let bookDir = booksourceRootDir + bookName + '/'

  // 新的图片存放路径
  var imageFolderName = fileName.toString().split('.md')[0]
  imageFolderName = imageFolderName.substring(5, imageFolderName.toString().length)
  var newImageDir     = rootDir + imageFolderName + '/'

  // 创建文件
  if (!fs.existsSync(newImageDir)) {
    await pMakeDir(newImageDir)
  }


  // 替换文件内容里面的图片路径
  // fileContent = fileContent.toString().replace('![Alt text](./', '![Alt text](../' + imageFolderName + '/')
  await modifyFileContent(filePath, imageFolderName)

  dlog(imageFiles, new Info(`imageFiles`), 0)

  // 将图片文件移动到新的图片文件存储路径
  for (let key in imageFiles) {
    let imageName = imageFiles[key]
    await moveFile(rootDir + imageName, newImageDir)
  }

  dlog(fileName, new Info(`fileName`), 0)
  dlog(newImageDir, new Info(`newImageDir`), 0)
  dlog('移动完毕', new Info(`'移动完毕'`), 0)

  // 将md文档和图片都移动到 book source 文件里面
  // 移动文档
  moveFile(filePath, bookDir)
  moveFile(newImageDir, bookDir)


  // 处理 Summary File
  await handleSummaryFile(bookName, fileName)

})()

async function getBookName(filepath) {
  let fileContent = await pReadTextFile(filepath)

  let bookname = fileContent.toString().match(/^#\[.*\]/)[0]

  return bookname.substring(2, bookname.toString().length-1)
}

async function handleSummaryFile(bookName, filename) {
  dlog(bookName, new Info(`bookName`), 0)
  dlog(filename, new Info(`filename`), 0)
  let smfile = booksourceRootDir + 'SUMMARY.md'
  let smdata = await pReadTextFile(smfile)
  let smContent = smdata.toString()

  // 提取 title
  var title = filename.toString().split('.md')[0]
  title = title.substring(5, title.toString().length)

  // dlog(smContent, new Info(`smContent`), 0)
  let searchString = `* [${bookName}](${bookName}/README.md)`
  dlog(searchString, new Info(`searchString`), 0)
  let index = smContent.indexOf(searchString) + searchString.length
  dlog(index, new Info(`index`), 0)
  let cate = `\n\t* [${title}](${bookName}/${filename})`
  dlog(cate, new Info(`cate`), 0)
  smContent = [smContent.slice(0, index), cate, smContent.slice(index)].join('')
  dlog(smContent, new Info(`smContent`), 0)
  pWriteTextFile(smfile, smContent)
}

async function unzip() {
  var filename
  let files = await pReadDir(rootDir)
  for (let key in files) {
    if (files[key].toString().includes('.zip')) {
      filename = files[key]
    }
  }

  await execa('bash', [
    path.resolve(__dirname, 'unzip.sh'),
    rootDir + filename,
    rootDir,
  ])

}

async function modifyFileContent(filePath, imageFolderName) {
  // 读取文件内容
  let fileContent = await pReadTextFile(filePath)
  fileContent     = fileContent.toString().replace('![Alt text](./', '![Alt text](' + imageFolderName + '/')

  await pWriteTextFile(filePath, fileContent)

}

async function moveFile(src, dst) {
  const { stdout } = await execa('bash', [
    path.resolve(__dirname, 'mvfile.sh'),
    src,
    dst,
  ])
  dlog(stdout, new Info(`stdout`), 0)
}

function pMakeDir(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}

function pReadDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, function (err, files) {
      if (err) {reject(err)} else {resolve(files)}
    })
  })
}

function pReadTextFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', function (err, data) {
      if (err) {reject(err)} else {resolve(data)}
    })
  })
}

function pWriteTextFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}



