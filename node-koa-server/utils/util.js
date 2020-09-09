const util = {
  // 成功通用返回值
  seccessDefaultData: {
    code: 200,
    status: 200,
    success: true,
    message: '请求成功',
    data: []
  },
  // 鉴权key
  jwtSecret: 'myl',
  imgPath: '/public/upload/'
}

module.exports = util;
