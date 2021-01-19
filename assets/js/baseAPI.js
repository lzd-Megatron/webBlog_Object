$(function() {
    // 该方法为jq提供,在每次发送ajax请求之前会被自动调用,用于拦截发送的ajax请求
    // options为发送的ajax中传入的配置对象,可在该函数中对ajax请求的配置对象进行一些处理或统一管理
    $.ajaxPrefilter(function(options) {
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url

        //以 /my/开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        if (options.url.indexOf('/my/') !== -1) {
            // 根据文档要求为请求配置对象options添加headers对象属性,属性名为Authorization,值为localStorage中的token
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }

        //统一为每次发送的ajax请求的配置对象挂在complete()函数,验证用户权限
        options.complete = function(res) {
            // console.log(res);
            // 打印服务器返回的数据决定这里怎么写
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清空token权限令牌
                localStorage.removeItem('token')
                    //重新跳转回登录页
                location.href = 'login.html'

            }
        }

    })














})