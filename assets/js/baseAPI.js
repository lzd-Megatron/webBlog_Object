$(function(){
    // 该方法为jq提供,在每次发送ajax请求之前会被自动调用,用于拦截发送的ajax请求
    // options为发送的ajax中传入的配置对象,可在该函数中对ajax请求的配置对象进行一些处理或统一管理
    $.ajaxPrefilter(function(options){
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    })














})