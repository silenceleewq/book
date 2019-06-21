const { watch } = require('gulp');
const fs        = require('fs');
const path      = require('path');
const watcher = watch(['./*']);

watcher.on('change', function (path, stats) {
  console.log(`File ${path} was changed`);
  console.log('file change 什么也不做 ===');
});

watcher.on('add', function (path, stats) {
  console.log(`File ${path} was added`);
  foo();
});

watcher.on('unlink', function (path, stats) {
  console.log(`File ${path} was removed`);
  foo();
});


// watcher.close();

exports.default = function (cb) {
  foo();
  cb();
};

function foo () {
  // return 1;
  fs.readdir(path.resolve(__dirname, '.'), function (err, files) {
    console.log(files);

//     var ss = `# records
// * [records](README.md)
// `;
//     files.sort(function (a, b) {
//       return a.length - b.length;
//     });
//
//     for (let i = 0; i < files.length; ++i) {
//
//       let file = files[i];
//
//       if (file === '.DS_Store') {continue;}
//
//       ss += `    - [${file}](records/${file}/${file}.md)\n`;
//
//     }
//     let filepath = path.resolve(__dirname, 'SUMMARY123.md');
//     let content  = ss;
//     fs.writeFile(filepath, content, function (err) {
//       if (err) {return console.error(err);}
//       console.log('数据写入成功！');
//     });
  });
}
