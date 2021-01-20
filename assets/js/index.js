$(function() {
    // 获取layui的layer对象
    let layer = layui.layer

    // 主页一打开就调用函数获取用户信息
    getuserInfo()

    // 监听退出事件
    $('#btnLogout').on('click', function() {
        layer.confirm('确认退出吗?', { icon: 3, title: '温馨提示=V=' }, function(index) {
            // 跳转到登录页
            location.href = 'login.html'
                //清空本地存储的token
            localStorage.removeItem('token')

            //layui的layer confirm自带的语句用于关闭询问框
            layer.close(index);
        });
    })
})

//封装获取用户信息的函数
function getuserInfo() {

    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers就是请求头配置对象(根据文档要求传入token令牌内容获取访问用户信息权限)
        //在baseAPI.js中统一设置headers请求头,避免在多次访问需要权限接口时频繁设置请求头
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }

            //请求成功则调用渲染用户信息的函数
            renderUserInfo(res.data)
        },
        //控制用户权限,不经过登录直接通过输入url进入主页没得到正确的服务器返回信息则重新
        // 将页面返回至登录页
        //complete:function(res){
        //    // console.log(res);
        //    // 打印服务器返回的数据决定这里怎么写
        //    if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
        //        //重新跳转回登录页
        //        location.href = 'login.html'
        //        //清空token权限令牌
        //        localStorage.removeItem('token')
        //    }
        //}
    })
}

function renderUserInfo(data) {
    let name = data.nickname || data.username
    let firstLetter = name[0].toUpperCase()
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (data.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', data.user_pic).show()
        $('.user-img').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        $('.user-img').html(firstLetter).show()

    }
}

function listClick() {
    //layui的设计a无法被冒泡,所以不要直接通过a的点击事件,要通过i的点击事件冒泡到父级的<dd></dd>的点击
    // 使页面发生跳转
    $('#article_list').click()
}