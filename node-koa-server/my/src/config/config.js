/*
 * @Date: 2020-07-17 17:32:29
 * @LastEditTimes: Do not edit
 * @Descripttion: describe
 */
const config = (() => {
    var host = ''
    var hostUpload = '' // 文件上传
    var hostImg = ''
    var env = process.env.NODE_ENV
    console.log('>>>>>>> 环境: ', env)

    // 环境切换
    // 生产
    if (env === 'production') {
        host = 'http://107.182.25.49'
        hostUpload = host // pc
        hostImg = host
    }
    // 测试
    else {
        host = 'http://172.16.10.13'
        // host = 'http://107.182.25.49'
        hostUpload = 'http://47.111.175.231'
        hostImg = 'http://39.104.133.145'
    }

    return {
        // 接口基本url
        baseUrl: {
            'login': `${host}:8002/`,
        },
        // 场所图片存放路径
        imgBaseUrl2: `${host}/mnt/attachment/shelter/`,
        // 图片存放路径
        imgBaseUrl: `${hostImg}/mnt/attachment/standardName/`,
        // 图片上传api
        uploadApiUrl: `${hostUpload}:9101/api/1.0/file/upload`,
        // socket Url
        socketUrl: `${host}:8002/`
    }
})()

export default config