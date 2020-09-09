// 空函数
function noop() { }

function ajax(options) {
  options = Object.assign({
    method: 'get',
    url: '',
    success: noop,
    onprogress: noop,
    onload: noop
  }, options)

  if (options.query) {
    options.url += '?' + queryParse(options.query);
  }


  // 创建ajax 对象
  let xhr = new XMLHttpRequest();

  // 设置ajax 请求参数 三个参数： 请求方法， url地址， 是否已异步
  xhr.open(options.method, options.url, true)

  // 请求完成以后 调用 options 的 success 方法返回数据
  xhr.onload = function () {
    options.success.call(xhr, xhr.responseText)
  }
  xhr.setRequestHeader('Authorization', localStorage.getItem('Authorization'))
  xhr.onprogress = options.onprogress;
  xhr.upload.onload = options.onload;

  let bodyData = null;
  if (options.data) {
    bodyData = bodyParse(options.data);
  }
  // 发送请求
  xhr.send(bodyData);
}

function queryParse(obj) {
  let str = '';
  let arr = [];
  for (let key in obj) {
    arr.push(`${key}=${obj[key]}`)
  }
  return arr.join('&');
}

function bodyParse(obj) {
  let fd = new FormData();
  for (let key in obj) {
    fd.append(key, obj[key]);
  }
  return fd;
}