$(function() {

    let form = layui.form
    let layer = layui.layer
        // 设置密码校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位,且不能出现空格'],
        newPwd: function(value) {
            let oldPwd = $('[name=oldPwd]').val()
            if (value === oldPwd) {
                return '新旧密码相同,请重新输入'
            }
        },
        rePwd: function(value) {
            let newPwd = $('[name=newPwd]').val()
            if (value !== newPwd) {
                return '两次密码不一致,请重新输入'
            }
        }
    })


    // 监听修改密码表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldPwd]').val(),
                newPwd: $('[name=newPwd]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
            }
        })
    })




})