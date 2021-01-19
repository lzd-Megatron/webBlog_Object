$(function() {

    let layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比( 4/3 16/9... )
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //监听上传按钮的点击事件
    $('#uploadBtn').on('click', function() {
        //调用文件上传输入框的点击事件模拟人为点击
        $('#selectImg').click()
    })

    //监听文件上传输入框的改变选择的文件的change事件
    $('#selectImg').on('change', function(e) {
        // 事件对象e的target下的files是文件列表,可通过其长度判断用户是否选择了图片文件
        let fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('你还没选择文件')
        }

        // 1. 拿到用户选择的文件
        var file = fileList[0]
            // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
            // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 监听确定按钮发动请求上传头像
    $('#confirmUpload').on('click', function(e) {
        e.preventDefault()

        // 将裁剪后的头像图片转化为base64路径
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            // 发送请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                //调用iframe父页面的获取用户信息并渲染页面的函数
                window.parent.getuserInfo()
            }
        })

    })

})