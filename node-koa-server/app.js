const koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const KoaStaticCache = require('koa-static-cache');
const KoaJwt = require('koa-jwt');
const app = new koa();
const router = new KoaRouter();
const server = require('http').createServer(app.callback())
const cors = require('koa-cors');
const io = require('socket.io')(server, { origins: '*:*' })
const jwt = require('jsonwebtoken');

const util = require('./utils/util')
const UploadImg = require('./middlewares/upload');
const { getUsers, registeredUser } = require('./server/api/users');
const { getPhtot, uploadImg } = require('./server/api/photos');
const { registered, login } = require('./middlewares/user');
// 百度api
const https = require('https');
let qs = require('querystring');
const fs = require('fs');
const { Socket } = require('dgram');
const user = require('./middlewares/user');

const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'GRSKoWacVTrF5NUmb8rlDLdo',
    'client_secret': 'jyVGWvfbgHUkTtDa8Y5qFAxaDYiwVFQN'
})

// ~async function () {
//     https.get({
//         hostname: 'aip.baidubce.com',
//         path: '/oauth/2.0/token?' + param,
//         agent: false
//     },
//         function (res) {
//             // 在标准输出中查看运行结果
//             // console.log(res);
//             res.pipe(process.stdout);
//             // 写入文件
//             res.pipe(fs.createWriteStream('./baidu-token.json'))
//         })
// }()


app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}))
//解决跨域处理
app.use(cors());

// 注册
router.post('/registeredUser', KoaBody({
    multipart: true // 默认为false 是否支持 multipart-formdate 的表单解决:
}), async (ctx, next) => {
    await registered(ctx, next);
    await next();
})
// 登录 
router.post('/login', KoaBody({
    multipart: true // 默认为false 是否支持 multipart-formdate 的表单解决:
}), async (ctx, next) => {
    await login(ctx, next);
    await next()
})

// 用户鉴权  使用jsonwebtoken
app.use(async (ctx, next) => {
    await authentication(ctx, next)
    await next();
})

// 中间件对token进行验证
app.use(async (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: err.message,
                message: '未登录,请登录'
            }
        } else {
            throw err;
        }
    })
});

// 使用koa-jwt 鉴权
app.use(KoaJwt({ secret: util.jwtSecret, passthrough: true }).unless({
    // 登录，注册接口不需要验证
    path: [/^\/login/, /^\/registeredUser/, /^\//, /^\/public/]
}));

// 获取用户
router.get('/getUsers', KoaBody(), async ctx => {
    const res = await getUsers(ctx.query.userName);
    let data = {
        ...util.seccessDefaultData,
        ...{
            data: res
        }
    }
    ctx.body = data;
})

// 上传图片
router.post('/uploadImg', UploadImg(), async ctx => {
    let file = ctx.request.files.file;
    let path = file.path;
    let pathIndexOf = path.lastIndexOf('\\');
    let imgName = path.substring(pathIndexOf + 1, path.length);
    let owner = ctx.state.userName

    uploadImg({ imgName, imgPath: util.imgPath, owner })
    ctx.body = {
        ...util.seccessDefaultData,
        ...{
            data: {
                img_name: imgName,
                imgPath: util.imgPath
            }
        }
    }
})

// 获取图片
router.get('/getPhtots', KoaBody(), async ctx => {
    const res = await getPhtot(ctx.state.userName);
    let data = {
        ...util.seccessDefaultData,
        ...{
            data: res
        }
    }
    // console.log(res);

    ctx.body = data

})
// 在线用户
let onLineUsers = {}
// 在线人数
let onLineCount = 0;

io.on('connection', socket => {
    console.log('有人连接了');
    onLineCount++;
    if (socket.id) {

    }
    socket.on('login', (data) => {
        socket.name = data.userid;
        if (!onLineUsers.hasOwnProperty(data.userid)) {
            onLineUsers[data.userid] = data.username;
            // 在线人数累加
            onLineCount++;
        }
        // 向所有用户广播新用户加入
        io.emit('login', { onLineUsers, onLineCount, user: data });
        console.log(`${data.username}加入了聊天室`);
    })
    socket.on('message', (data) => {
        console.log(data);
    })
})


// 鉴权函数
async function authentication(ctx, next) {
    const token = ctx.request.header.authorization;
    let user;
    // 过滤掉登录以及注册接口 不进行鉴权  使用jsonwebtoken 这个的时候需要使用这段代码
    // let urlList = ctx.url.split('/');
    // if (urlList.includes('public') || ctx.url == '/login' || ctx.url == '/registered') { } else {
    if (token == 'null' || token == undefined) {
        return {
            ...util.seccessDefaultData,
            ...{
                status: 401,
                message: '未登录,请登录'
            }
        }
    } else {
        user = jwt.verify(token, util.jwtSecret)
        if (!user) {
            return {
                ...util.seccessDefaultData,
                ...{
                    status: 401,
                    message: '未登录,请登录'
                }
            }
        }
    }
    ctx.state = user
    // }

}
app.use(router.routes())

server.listen(8888, () => {
    console.log('服务器开启成功，请访问：http://localhost:8888/public/index.html');
})