const jwt = require('jsonwebtoken');
const seccessDefaultData = {
    code: 200,
    status: 200,
    success: true,
    data: []
}
const jwtSecret = 'myl';
module.exports = {
    async jwtVerify(ctx, next) {
        let token = ctx.request.header.authorization;
        let user;
        let urlList = ctx.url.split('/');

        // 过滤掉登录以及注册接口 不进行鉴权
        if (urlList.includes('public') || ctx.url == '/login' || ctx.url == '/registered') { } else {
            if (token == 'null') {
                return {
                    ...seccessDefaultData,
                    ...{
                        status: 401,
                        message: '未登录,请登录'
                    }
                }
            } else {
                user = jwt.verify(token, jwtSecret)
                if (!user) {
                    return {
                        ...seccessDefaultData,
                        ...{
                            status: 401,
                            message: '未登录,请登录'
                        }
                    }
                }
            }
            ctx._user = user;
        }
        await next();
    },
    jwtSing (data, jwtSecret) {
        console.log(jwt.sign(data, jwtSecret));
        return jwt.sign(data, jwtSecret);
    }
}