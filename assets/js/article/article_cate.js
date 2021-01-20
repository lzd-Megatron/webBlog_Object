$(function() {

    let layer = layui.layer
    var form = layui.form

    // 调用函数获取文章分类列表
    initArtCateList()

    // 获取文章分类列表的函数
    function initArtCateList() {

        //发送请求获取文章分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                //调用模板引擎的template()方法
                let tempStr = template('tpl-artCate', res)

                //将template()方法生成的模板字符串添加填充到表格元素中
                $('tbody').html(tempStr)
            }
        })

    }

    //为添加类别按钮绑定点击事件
    $('#addCate').on('click', function() {
        // 获取<script>模板内部的html表单代码
        let formStr = $('#tpl-addCate').html()

        //展示弹出组件
        layer.open({
            title: '添加类别',
            area: ['500px', '250px'],
            type: 1,
            content: formStr
        })

        //为弹出层的添加类别表单设置提交事件(该表单为点击添加按钮动态生成的,要在添加按钮的点击事件内部书写代码,
        // 或者通过代理为表单添加提交事件)
        $('#layer-addCate').on('submit', function(e) {
            e.preventDefault()

            $.ajax({
                    method: 'POST',
                    url: '/my/article/addcates',
                    data: $(this).serialize(),
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg(res.message)
                            // 调用函数重新获取数据并渲染到页面
                        initArtCateList()
                    }
                })
                // 调用layer的close传入最近弹出的弹层组件关闭最近弹出的弹层窗口
            layer.close(layer.index)
        })

    })

    //通过编辑按钮的父级元素为编辑按钮设置代理点击事件
    $('tbody').on('click', '.editBtn', function() {

        // 获取<script>模板内部的html表单代码
        let editFormStr = $('#tpl-editCate').html()
            //设置弹出层
        layer.open({
            title: '编辑分类',
            area: ['500px', '250px'],
            type: 1,
            content: editFormStr
        });

        // 获取为编辑按钮设置的自定义属性作为发送请求时的id值获取对应数据填充到弹出窗表单内
        let id = $(this).attr('data-id');

        //发送ajax请求获取对应id的数据
        $.ajax({
            method: 'GET',
            // 在url后面拼接要请求的id获取对应数据
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 快速将获取到的数据写入到表单项中
                form.val('form-edit', res.data);
            }
        })

        //为编辑弹窗的表单绑定表单提交事件实现更新数据
        $('#layer-editCate').on('submit', function(e) {

            e.preventDefault()

            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //重新获取并渲染修改后的数据到页面
                    initArtCateList()
                        // 关闭当前修改弹窗
                    layer.close(layer.index)
                    layer.msg(res.message)
                }
            })
        })

    })

    // 通过代理为动态生成的删除按钮绑定点击事件
    $('tbody').on('click', '#delBtn', function() {
        let id = $(this).attr('data-id')

        // 弹出确认框
        layer.confirm('确认删除?', { icon: 3, title: '警告' }, function(index) {
            //发送ajax发送请求删除id对应数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                data: id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        //重新获取并渲染删除后的数据到页面
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })









})