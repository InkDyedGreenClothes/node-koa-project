/*
 * @Date: 2020-07-17 17:32:29
 * @LastEditTimes: Do not edit
 * @Descripttion: describe
 */
const config = (() => {
    var host = ''
    var env = process.env.NODE_ENV
    console.log('>>>>>>> 环境: ', env)

    // 环境切换
    // 生产
    if (env === 'production') {
        host = 'http://107.182.25.49'
    }
    // 测试
    else {
        host = 'http://172.16.10.13'
        // host = 'http://192.168.2.101'
        // host = 'http://107.182.25.49'
    }

    return {
        // 接口基本url
        baseUrl: {
            'login': `${host}:8001/`,
        },
        // socket Url
        socketUrl: `${host}:8001/`
    }
})()

export default config