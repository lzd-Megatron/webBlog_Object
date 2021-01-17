$(function () {

    // 点击链接显示隐藏注册登录表单
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('#link_login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    //自定义校验规则
    // 从导入的layui中获取form对象使用verify()方法自定义表单校验规则，数组回调两种形式
    let form = layui.form

    //自定义弹出窗提示消息
    let layer = layui.layer

    form.verify({
        username: function (value, item) { //value：自动获取的表单的值、item：自动获取的表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        // 密码框校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 注册表单的重新输入表单校验规则
        repwd:function(value){
            // 获取密码框中输入的内容(属性选择器获取注册表单密码框元素)
            let pwd = $('.reg_box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致'
            }
        }
    })


    //监听注册表单的提交事件
    $('#registerForm').on('submit',function(e){
        //阻止表单自带的默认提交行为而是通过ajax提交表单
        e.preventDefault()

        //使用ajax发送post请求
        $.post({
            url:'/api/reguser',
            data:{
                // 也可通过jq提供的serialize()函数快速获取表单内容
                username: $('#registerForm [name=username]').val(),
                password: $('#registerForm [name=password]').val()
            },
            success:function(res){
                if(res.status !== 0){
                    // 若返回失败信息通过return结束当前函数不再向下执行
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                //调用click()方法模拟人的点击行为注册成功后自动点击链接切换为登录表单
                $('#link_login').click()
            }
        })
    })

    // 监听登录表单的提交行为
    $('#loginForm').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            //通过jq提供的serialize()方法快速获取登录表单的填写内容
            data: $(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                // 登录成功时将返回的token令牌保存到本地localstorage中,表示进入系统后获得访问权限允许访问
                localStorage.setItem('token',res.token)
                //跳转到主页面
                location.href = 'index.html'
            }
        })
    })

    





})