### 待处理问题

1. artDialog的引用 和 MessageBox1，MoAlert 耦合在一起，最终是移除 $.dialog，MoAlert 这样的使用，直接使用 前端组件库里的弹窗

2. 将原来零散的组件使用，统一整改成 前端组件库的，并且前端组件库做到无需手动引入相应的css ，缩减入口index.js里的import引用，防止入口多混乱

3. ajax请求修整

4. css样式整改，通用样式修整，行内样式提取

5. tpl/password-dialog.art，以及pserver-dialog.art，页面对应为password-dialog.jsp和pserverIpSelect-dialog.jsp，js内容未引入

7. easyui引入方式

8. resetpassword页面，多语言使用

9. plat页面，头像上传报错，估计是后台ajax调用。

