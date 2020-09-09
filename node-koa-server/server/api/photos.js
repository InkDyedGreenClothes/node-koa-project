const db = require('../mysql');

module.exports = {
    // 上传图片
    uploadImg(data) {
        const { imgName, imgPath, owner } = data
        db.query('insert into photos (img_name,img_path, owner) values (?,?,?)', [imgName, imgPath, owner])
    },
    // 获取图片
    getPhtot(userName) {
        let getPhtotSql = 'select * from `photos`'
        if (userName) {
            getPhtotSql = 'select * from `photos` where `owner` = ?'
        }
        return new Promise((resolve, reject) => {
            db.query(getPhtotSql, [userName], function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res);
                }
            })
        })
    }
}