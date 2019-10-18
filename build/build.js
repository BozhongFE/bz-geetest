const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const uglify = require('uglify-js');
const builds = require('./config').getAllBuilds();
build(builds);

function build (builds) { // 对拿到的builds 进行一个简单的遍历
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => { // builds数组从0到最后一个元素执行buildEntry方法
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };

  next();
}

function buildEntry (config) { // 真正开始执行rollup，对返回的builds进行编译，然后生成对应的文件
  const isProd = !/debug\.js$/.test(config.output.file) && !/(\w+\.){2}js$/.test(config.output.file); // 匹配文件
  return rollup.rollup(config)
    .then(bundle => bundle.generate(config.output))
    .then((code) => {
      var { code } = code.output[0];
      if (isProd) {
        var minified = uglify.minify(code, { // 判断生成的js是否需要压缩
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code;
        return write(config.output.file, minified, true);
      } else {
        return write(config.output.file, code);
      }
    });
}

// 输出文件并显示文件大小
function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) { // 必要的时候，在文件中加入console.log
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
      resolve();
    }

    fs.writeFile(dest, code, err => { // 写文件操作
      if (err) return reject(err);
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err);
          report(' (gzipped: ' + getSize(zipped) + ')');
        });
      } else {
        report();
      }
    });
  });
}

// 获取生成的文件大小
function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError (e) {
  console.log(e);
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
