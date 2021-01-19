$(function() {
    let layer = layui.layer
    let form = layui.form

    form.verify({
        nicknames: function(value) {
            if (value.length > 6) {
                return '昵称必须为1到6个字符长度，且不能出现空格';
            }
        }
    })

    initUserInfo()

    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 快速为表单赋值
                form.val("userInfo-form", res.data);
            }
        })

    }

    // 监听重置按钮的重置表单功能
    $('#resetChange').on('click', function(e) {
        // 阻止默认的表单重置行为
        e.preventDefault()
            // 调用初始化用户信息函数重新为表单项赋值
        initUserInfo()
    })

    // 监听表单提交事件(会自动对表单项中填写的内容进行校验)发送请求修改用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 调用父页面index.html的js文件index.js中的重新获取并渲染数据的函数
                window.parent.getuserInfo()
            }

        })
    })







})