// 获取元素
let uploadBtnEle = document.querySelector('#uploadBtn');
let uploadFileEle = document.querySelector('#uploadFile');
let taskbodyEle = document.querySelector('.task_body');
let contentListEle = document.querySelector('.content-list');
let numEle = document.querySelector('.num');
let totalNumEle = document.querySelector('.total_num');
let userNameEle = document.querySelector('#userName');
let passwordInputEle = document.querySelector('#passwordInput');
let loginEle = document.querySelector('#login');
let registeredEle = document.querySelector('#registered');
let messageEle = document.querySelector('#message');
let contentEle = document.querySelector('#content');
let taskPanelEle = document.querySelector('.task_panel');
let loginBoxEle = document.querySelector('#loginBox');
let loginOutEle = document.querySelector('#loginOut');
let allCloseEle = document.querySelector('.all-close');

let page = {
    data: {
        totalNum: 0,
        tastNum: 0
    },
    init() {
        // 判断用户是否已经登录
        if (localStorage.getItem('Authorization')) {
            contentEle.style.display = 'block'
            loginOutEle.style.display = 'block'
            loginBoxEle.style.display = 'none'
            // 获取图片
            this.methods.getPhotos();
            // 获取用户
            // this.methods.getUsers();
        } else {
            contentEle.style.display = 'none'
        }
        // 文件上传事件
        this.btnEvents();

        this.websocketIn()
    },
    btnEvents() {
        // 使用上传按钮点击出发input点击事件简介简介
        uploadBtnEle.onclick = function () {
            uploadFileEle.click();
        }
        // 选择文件事件
        uploadFileEle.onchange = function () {
            for (let file of this.files) {
                page.methods.uploadFile({
                    file
                })
            }
        }
        // 注册点击
        registeredEle.onclick = function () {
            if (!page.methods.nullChkek()) {
                alert('请输入账号或密码!')
                return
            }
            page.methods.registeredUser();
        }
        // 登录点击
        loginEle.onclick = function () {
            if (!page.methods.nullChkek()) {
                alert('请输入账号或密码!')
                return
            }
            page.methods.login();
        }
        // 退出点击
        loginOutEle.onclick = function () {
            localStorage.clear();
            loginOutEle.style.display = 'none'
            contentEle.style.display = 'none';
            loginBoxEle.style.display = 'block';
        }
        // 关闭任务窗口
        allCloseEle.onclick = function () {
            taskPanelEle.style.display = 'none';
        }
    },
    methods: {
        // 登录
        login() {
            ajax({
                method: 'post',
                url: '/login',
                data: {
                    userName: userNameEle.value,
                    password: passwordInputEle.value
                },
                success(res) {
                    let authorization = this.getResponseHeader('Authorization');
                    if (authorization) {
                        localStorage.setItem('Authorization', authorization);
                    }
                    let data = JSON.parse(res);
                    if (data.status == 200) {
                        alert(data.message)
                        contentEle.style.display = 'block';
                        loginOutEle.style.display = 'block'
                        page.methods.getPhotos();
                        loginBoxEle.style.display = 'none'
                        contentListEle.innerHTML = ''
                    } else {
                        alert(data.message)
                    }
                }
            })
        },
        // 注册用户
        registeredUser() {
            ajax({
                method: 'post',
                url: '/registeredUser',
                data: {
                    userName: userNameEle.value,
                    password: passwordInputEle.value,
                    nikeName: userNameEle.value
                },
                success(res) {
                    let data = JSON.parse(res);
                    if (data.status == 300) {
                        alert(data.message)
                    } else {
                        alert(data.message)
                    }
                }
            })
        },
        // 获取用户
        getUsers() {
            ajax({
                method: 'get',
                url: '/getUsers',
                query: {
                    userName: userNameEle.value,
                },
                success(res) {
                    let data = JSON.parse(res);
                    console.log(data);
                }
            })
        },
        // 上传图片
        uploadFile(data) {
            // console.log(this);
            taskPanelEle.style.display = 'block';
            totalNumEle.innerHTML = this.totalNum + 1;
            let li = document.createElement('li');
            li.innerHTML = `<span>${data.file.name}</span>
                    <div class="task-progress-status">上传中……</div>
                    <div class="progress"></div>`
            taskbodyEle.appendChild(li)
            let taskProgresStatusEle = li.querySelector('.task-progress-status');
            let progressEle = li.querySelector('.progress')
            ajax({
                method: 'post',
                url: '/uploadImg',
                data,
                success(res) {
                    let imgData = JSON.parse(res)
                    if (imgData.status !== 200) {
                        alert(imgData.message)
                        return;
                    } else {
                        // console.log(res);
                        taskProgresStatusEle.innerHTML = '上传完成'
                        numEle.innerHTML = this.tastNum + 1;
                        // 将上传后的图片显示到页面
                        page.methods.imgRender(imgData.data.imgPath + imgData.data.img_name);
                        setTimeout(() => {
                            taskPanelEle.style.display = 'none';
                        }, 2000)
                    }
                },
                onprogress(ev) {
                    progressEle.style.width = (ev.loaded / ev.total) * 100 + '%'
                }
            });
        },
        // 获取图片
        getPhotos() {
            ajax({
                method: 'get',
                url: '/getPhtots',
                success(res) {
                    let imgList = JSON.parse(res);
                    if (imgList.status == 200) {
                        imgList.data.forEach(img => {
                            page.methods.imgRender(img.img_path + img.img_name)
                        });
                    } else {
                        alert(imgList.message)
                    }
                }
            });
        },
        // 渲染图片列表
        imgRender(url) {
            let img = document.createElement('img');
            img.src = url;
            contentListEle.appendChild(img);
        },
        // 账号密码是否为空校验
        nullChkek() {
            if (!userNameEle.value || !passwordInputEle.value) {
                return false;
            } else {
                return true
            }
        },
        // socket连接
        websocketIn() {
            let io = io('/');
            io.on('login', data => {
                console.log(data);
                
            })
        }
    }
}

page.init();