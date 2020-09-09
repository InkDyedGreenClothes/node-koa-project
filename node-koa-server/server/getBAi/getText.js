// 百度api
const https = require('https');
let qs = require('querystring');
const fs = require('fs')

const param = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': 'GRSKoWacVTrF5NUmb8rlDLdo',
  'client_secret': 'jyVGWvfbgHUkTtDa8Y5qFAxaDYiwVFQN'
})

module.exports = {
  getBAiToken() {
    return new Promise((resolve, reject) => {
      https.get({
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + param,
        agent: false
      },
        function (res) {
          // 在标准输出中查看运行结果
          // console.log(res);
          res.pipe(process.stdout);
          // 写入文件
          // res.pipe(fs.createWriteStream('./baidu-token.json'))
          // fs.writeFile('./baidu-token.json')
          if (res.error) {
            reject(res)
          } else {
            resolve(res)
          }
        })
    })
  }
};



