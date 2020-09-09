// 关于用户的接口址
const db = require('../mysql');

module.exports = {
    // 注册用户
    registeredUser(data) {
        db.query('insert into users (user_name, password, nike_name) values (?,?,?)', [data.userName, data.password, data.nikeName])
    },
    // 获取用户
    getUsers(userName) {
        let getUserSql = 'select * from `users`';
        if (userName) {
            getUserSql = 'select * from `users` where `user_name` = ?'
        }
        return new Promise((resolve, reject) => {
            db.query(getUserSql, [userName], function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }
};
