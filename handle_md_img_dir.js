const osHomedir      = require('os-homedir')
const { dlog, Info } = require('../lib/dlog')
const execa          = require('execa')
const fs             = require('fs')
const path           = require('path')
const rimraf         = require('rimraf')
const util           = require('util')

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

// 马克飞象导出的 Markdown 文档, 如果有图片, 会导出 zip 压缩包
// 如果没有图片, 那么就直接是一个 md 文档.
/*
* 使用说明: Gitbook 里面会有分类.
* 在马克飞象里面, 正文的标题一定要符合 #[xxx]yyyy
* xxx 是 gitbook 分类标题, 就是 SUMMARY.md 文件里面的文件夹名称.
* yyyy 就是文章的标题
* */

var program           = require('commander')
//文件根目录
let rootDir           = '/Users/lirenqiang/Desktop/MarkElephantExportFiles/'
let booksourceRootDir = '/Users/lirenqiang/git_repository/booksource/'
;(async function () {

  // 先进行解压, 如果有.zip 就解压, 没有就不解压.
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

  // 修改正文内容标题.
  await modifyFileContentTitle(filePath)

  // 判断图片文件数组个数, 如果为0, 说明文档没有图片
  let containImage = imageFiles.length > 0

  if (containImage) {
    // 新的图片存放路径
    var imageFolderName = fileName.toString().split('.md')[0]
    imageFolderName     = imageFolderName.substring(5, imageFolderName.toString().length)
    var newImageDir     = rootDir + imageFolderName + '/'

    // 创建存放图片的文件
    if (!fs.existsSync(newImageDir)) {
      await pMakeDir(newImageDir)
    }

    // 替换文件内容里面的图片路径
    // fileContent = fileContent.toString().replace('![Alt text](./', '![Alt text](../' + imageFolderName + '/')
    await replaceFileContentImagePath(filePath, imageFolderName)

    // 将图片文件移动到新的图片文件存储路径
    for (let key in imageFiles) {
      let imageName = imageFiles[key]
      await moveFile(rootDir + imageName, newImageDir)
    }
    //判断是否有同名的文件夹.
    dlog(bookDir + imageFolderName, new Info(`bookDir`), 0)
    if (fs.existsSync(bookDir + imageFolderName)) {
      dlog('删除' + bookDir + imageFolderName, new Info(`'删除'+bookDir+imageFolderName`), 0)
      rimraf.sync(bookDir + imageFolderName)
    }
    // 将图片文件夹移动到 booksource 里面
    moveFile(newImageDir, bookDir)
  }

  // 将md文档和图片都移动到 book source 文件里面
  // 移动文档
  dlog(bookDir + fileName, new Info(`bookDir`), 0)
  if(fs.existsSync(bookDir + fileName)){
    dlog('删除' + bookDir + fileName, new Info(`'删除'+bookDir+fileName`), 0)
    rimraf.sync(bookDir + fileName)
  }
  moveFile(filePath, bookDir)

  // 处理 Summary File
  await handleSummaryFile(bookName, fileName)
})()

async function getBookName(filepath) {
  let fileContent = await pReadTextFile(filepath)

  let bookname = fileContent.toString().match(/^#\[.*\]/)[0]

  return bookname.substring(2, bookname.toString().length - 1)
}

async function handleSummaryFile(bookName, filename) {
  dlog(bookName, new Info(`bookName`), 0)
  dlog(filename, new Info(`filename`), 0)
  let smfile    = booksourceRootDir + 'SUMMARY.md'
  let smdata    = await pReadTextFile(smfile)
  let smContent = smdata.toString()

  // 提取 title
  var title = filename.toString().split('.md')[0]
  let indexOf = title.indexOf(']')
  title      = title.substring(indexOf+1, title.toString().length)

  // 判断是否已经有同名的文档.
  // dlog(smContent, new Info(`smContent`), 0)
  let searchString = `* [${bookName}](${bookName}/README.md)`
  dlog(searchString, new Info(`searchString`), 0)
  let index = smContent.indexOf(searchString) + searchString.length
  dlog(index, new Info(`index`), 0)
  let cate = `\n\t* [${title}](${bookName}/${filename})`
  dlog(cate, new Info(`cate`), 0)
  // dlog(smContent, new Info(`smContent`), 0)
  if(smContent.includes(cate)){
    dlog('包含 cate', new Info(`'包含 cate'`), 0)
  } else {
    smContent = [smContent.slice(0, index), cate, smContent.slice(index)].join('')
    dlog(smContent, new Info(`smContent`), 0)
    pWriteTextFile(smfile, smContent)
  }



}

async function unzip() {
  var filename
  let files = await pReadDir(rootDir)
  for (let key in files) {
    if (files[key].toString().includes('.zip')) {
      filename = files[key]
    }
  }

  if (filename) {
    await execa('bash', [
      path.resolve(__dirname, 'unzip.sh'),
      rootDir + filename,
      rootDir,
    ])
  }
}

// 因为正文里面的标题是 '[iOS]NSOperation自定义子类' 这样子的
// 为了不显得奇怪, 我要把 '[iOS]' 这个去掉
async function modifyFileContentTitle(filePath) {
  let fileContent = await pReadTextFile(filePath)
  fileContent     = fileContent.toString().replace(/^#\[.*\]/, '# ')
  await pWriteTextFile(filePath, fileContent)
}

async function replaceFileContentImagePath(filePath, imageFolderName) {
  // 读取文件内容
  let fileContent = await pReadTextFile(filePath)
  // 改进版本,采用 正则表达式 来进行全局替换
  fileContent     = fileContent.toString().replace(/\!\[Alt text\]\(\./g, '![Alt text](' + imageFolderName)
  dlog(fileContent, new Info(`fileContent`), 0)
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



