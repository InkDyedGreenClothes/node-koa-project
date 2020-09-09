const KoaBody = require('koa-body');
const jwt = require('jsonwebtoken');

const { getUsers, registeredUser } = require('../server/api/users');
const util = require('../utils/util')
// 注册
const registered = async (ctx, next) => {
  let data = ctx.request.body
  // 获取用户 看用户是否已经存在 不存在 就可以注册
  const res = await getUsers(data.userName);

  if (res.length > 0) {
    data = {
      ...util.seccessDefaultData,
      ...{
        status: 300,
        message: '用户已经存在'
      }
    }
  } else {
    registeredUser(data);
    data = {
      ...util.seccessDefaultData,
      ...{
        message: '注册成功'
      }
    }
  }
  ctx.body = data;
}
// 登陆
const login = async (ctx, next) => {
  let { userName, password } = ctx.request.body
  // 获取用户 看用户是否已经存在 
  const [res] = await getUsers(userName);
  // console.log(res);

  if (res) {
    // registeredUser(data);
    // console.log(res[0]);
    // 判断用户密码 是否账号密码正确
    if (userName != res.user_name || password != res.password) {
      data = {
        ...util.seccessDefaultData,
        ...{
          message: '账号或密码错误！',
          status: 404
        }
      }
    } else {
      let token = 'Bearer ' + jwt.sign({
        id: res.id,
        userName: res.user_name,
        password: res.password,
        nikeName: res.nikeName
      }, util.jwtSecret)

      ctx.set('Authorization', token)
      // 通过此header设置允许前端访问
      ctx.set('Access-Control-Expose-Headers', 'Authorization')

      res.token = token;
      data = {
        ...util.seccessDefaultData,
        ...{
          message: '登录成功',
          data: res
        }
      }
    }
  } else {
    data = {
      ...util.seccessDefaultData,
      ...{
        status: 404,
        message: '用户不存在'
      }
    }
  }
  ctx.body = data;
}

module.exports = {
  registered,
  login
};

