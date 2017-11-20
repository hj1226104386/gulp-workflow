# gulp-workflow
gulp构建前端自动化工作流
> 根据gulp的文档，它努力实现的主要特性是：
> * 易于使用：采用代码优于配置策略，gulp让简单的事情继续简单，复杂的任务变得可管
> * 高效：通过利用node.js强大的流，不需要往磁盘写中间文件，可以更快地完成构建。*
> * 高质量：gulp严格的插件指导方针，确保插件简单并且按你期望的方式工作。*
> * 通过把API降到最少，你能在很短的时间内学会gulp*

## 打包构建的几个步骤
> * css、js、image的合并压缩
> * 给css、js、image合并后添加版本号（hash），生成对应的manifest文件，**这一步非常重要**
> * 根据manifest文件来替换HTML文件和css文件中的对应资源路径

## 使用方法（usage)
- clone 
> git clone https://github.com/hj1226104386/gulp-workflow.git
- dependencies installation
> npm install
- run in terminal
> gulp
