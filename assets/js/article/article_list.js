$(function() {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    //定义美化时间格式的过滤器
    template.defaults.imports.dateFormat = function(date) {
            let myDate = new Date(date)
            let y = myDate.getFullYear()
            let m = addZero(myDate.getMonth() + 1)
            let d = addZero(myDate.getDate())
            let h = addZero(myDate.getHours())
            let minutes = addZero(myDate.getMinutes())
            let s = addZero(myDate.getSeconds())
            return `${y}年${m}月${d}日  ${h}:${minutes}:${s}`
        }
        //声明补零函数
    function addZero(date) {
        return date > 9 ? date : '0' + date
    }

    //定义一个请求参数对象(看文档定义相关属性)
    let q = {
            pagenum: 1, //默认显示页码为1的数据
            pagesize: 3, //默认每页显示2条数据
            cate_id: '', //文章分类id(可选)
            state: '' //文章发布状态
        }
        // 调用函数获取文章列表数据并渲染到页面
    initTable()
        // 调用函数获取文章类别数据并渲染到筛选区分类下拉列表
    initCate()

    //声明获取表格数据并渲染页面的函数
    function initTable() {
        // 发送请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                //通过模板引擎获取元素字符串
                let tableStr = template('tpl-table', res)
                    //渲染数据到页面
                $('tbody').html(tableStr)

                // 成功渲染表格就调用渲染分页的函数并将总文章数传入方便分页计算页数
                renderPage(res.total)
            }
        })
    }

    //声明获取所有文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let cateStr = template('tpl-cate', res)
                $('[name=cate_id]').html(cateStr)
                    //由于layui的渲染机制,<select name="cate_id"></select>中的元素都被抽离出去到模板中了
                    //所以后来动态渲染出来的元素<option></option>元素layui.js并没有监听到,因此可通过layui提供的
                    //form.render()函数再次手动渲染一次页面
                form.render();
            }
        })
    }


    //监听筛选表单的提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        //获取各表单项选中的值
        let id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 将获取到的值保存到请求参数q中
        q.cate_id = id,
            q.state = state

        //调用函数再次发送请求,根据最新设置的请求参数q通过筛选表单获取数据渲染到表格中展示
        initTable()
    })

    //声明渲染分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //存放分页的容器为?
            count: total, //一共多少条数据?
            limit: q.pagesize, //每页显示多少条数据?
            curr: q.pagenum, //默认被选中哪一页?(起始页)
            limits: [2, 3, 5, 10], //改变下面的layout属性的'limit'的每页几条
            layout: ['count', 'limit', 'refresh', 'prev', 'page', 'next', 'skip'], //自定义排版
            // layui的回调函数,在切换页码时触发
            // jump被触发的场景:
            //     1.点击页码
            //     2.调用laypage.render()函数
            // jump()回调中可传入第二个参数first
            // 当通过第一种方式触发jump()回调时first为undefined
            // 当通过第二种方式触发jump()回调时first为true

            // 解决死循环问题的思路: 判断我们是通过什么方式触发的jump回调,
            // 应该只允许点击页码进行切换时
            // 再调用initTable(),若是通过第二种方式触发的jump()回调就不让initTable()被调用
            // 即点击了页码切换时再调用initTable(),页面一打开laypage.render()调用时不使initTable()被调用
            jump: function(obj, first) {
                // 通过obj.curr获取点击的页码值,将页码值保存到请求参数对象的pagenum属性中
                q.pagenum = obj.curr
                    //通过点击获取到页码保存到请求参数对象中后就可以再次发送请求获取对应页码的
                    // 数据并渲染到页面中
                    //注: 在这里调用该函数会导致死循环,initTable()函数中调用了 renderPage()函数,renderPage()函数中
                    // 调用了laypage.render()函数,laypage.render()函数中的jump回调中又在这里调用了initTable()函数,就会形成死循环
                    // 所以在这里不能直接调用initTable()函数
                    // initTable()

                // n条/页的下拉选择框的改变也能触发jump()回调,获取选择的下拉框的值保存到请求参数对象q中
                // 再重新发送请求渲染下拉选择框中被选择的对应条数的数据
                q.pagesize = obj.limit //obj.limit就是用户选择的每页显示多少条数据的下拉框的值

                // 通过jump()回调的第二个参数first的值判断是什么情况触发的jump()回调被执行
                if (!first) {
                    // 再次发送请求并渲染表格中的数据
                    initTable()
                }
                // laypage分页组件通过用户点击不同页码获取当前被点击的页码,我们再通过该组件修改我们定义的
                // 请求参数对象中属性的参数(包括数据总数,一页显示多少数据,被点击的页码等...),在发送请求时
                //就能动态获取对应数据并渲染到页面中
            }
        })
    }

    // 为列表区的删除按钮绑定点击事件
    //删除按钮是通过模板引擎后期动态生成的,为该类元素绑定事件要通过其固有的父级元素来为动态的子类元素代理事件的触发
    $('tbody').on('click', '#delBtn', function() {

        // 获取被点击的按钮对应的文章的id属性
        let id = $(this).attr('data-id')
            // 发送请求根据id删除后台的数据,并重新将删除后的数据渲染到页面

        layer.confirm('确认删除这篇文章?', { icon: 3, title: '删除文章' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    // 删除文章的小bug: 
                    //     该页的最后一篇文章被删除后应该自动选中前一页并展示前一页的数据,但是在删除完
                    //     该页最后一条数据后页码依然没有发生变化,当发送请求时依然是请求的当前页码的数据
                    //     所以展示的还是空白,正确思路为判断当前页中的数据是否存在,若不存在就是页码减一
                    //     并重新根据减一后的页码数重新发送请求并渲染数据到页面中

                    //判断该页还有几条数据的思路:
                    // 可判断有几个删除按钮就代表该页还存在几条数据,若该页不存在删除按钮了
                    // 就代表该页已经将所有数据删除完了,是时候将页码数减一展示前一页的数据了

                    // 在这里就说明前面的删除操作都已经执行完毕了,这时再来判断页面中所剩删除按钮的个数是否为0

                    //获取页面中删除按钮的个数
                    let delBtnNum = $('.btn-delete').length
                        //判断删除完文章后页面中是否还有删除按钮
                    if (delBtnNum === 1) {
                        // 页面中不存在删除按钮(无文章内容),使页码减一
                        //注意: 页码值减一的前提是当前页码值至少为2大于1
                        //否则本来就只有一页数据就不能再使页码数减一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    //重新发送请求并渲染数据到页面
                    initTable()
                    layer.msg(res.message)
                }
            });
            // 关闭提示弹窗
            layer.close(index);
        })
    })
})