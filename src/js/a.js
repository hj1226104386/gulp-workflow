/**
 * @author:huangjin
 * @parameter:
 * @description:
 * @Date:2017/10/16
 */

$(function () {
    var a = '我是a.js文件';
    console.log(a);
    let scope = '我是es6语法声明的变量';
    console.log(scope);
    let f1 = ()=>{
        console.log('啊哈');
    }
    f1();
});