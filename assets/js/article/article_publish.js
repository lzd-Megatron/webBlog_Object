$(function() {

    let layer = layui.layer
    let form = layui.form

    //调用渲染获取文章下拉框选择类别的函数
    renderCate()

    // 初始化富文本编辑器
    initEditor()

    //渲染获取文章下拉框选择类别的函数
    function renderCate() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                let cateStr = template('tpl-cate', res)
                $('[name=cate_id]').html(cateStr)
                form.render()
            }
        })
    }

    $('#selectImg').on('click', function() {
        $('#hiddenInput').click()
    })


    //监听隐藏的文件选择输入框的change事件监听选择的文件改变事件
    $('#hiddenInput').on('change', function(e) {
        // 拿到用户选择的文件数组
        var files = e.target.files

        //判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('你还没选择图片')
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //为存为草稿按钮绑定点击事件处理函数修改文章发布状态
    //定义文章发布状态,默认为发布
    let state = '已发布'

    $('#saveBtn2').on('click', function() {
        state = '草稿'
    })

    // 监听表单的submit 提交事件
    $('#form-publish').on('submit', function(e) {
        e.preventDefault()

        // 基于表单DOM元素创建FormData对象提交表单
        let fd = new FormData($(this)[0])

        //将发布状态添加到FormData对象中
        fd.append('state', state)

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，保存到FormData对象中
                fd.append('cover_img', blob)
                    //调用方法发送ajax数据请求并跳转页面
                publishArticle(fd)
            })
            // 检查FormData对象中是否保存了表单内容
        fd.forEach(function(v, k) {
            console.log(k + ':' + v);
        })

    })

    // 定义发布文章的方法
    function publishArticle(fd) {

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //若向服务器提交的是formData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布文章成功')
                    // 跳转到文章列表页面
                    // 调用父窗口的index.js中声明的函数手动触发文章列表的点击事件跳转到文章列表页
                window.parent.listClick()
            }
        })
    }

})