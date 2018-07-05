
import React from 'react';



class NotFound extends React.Component {
  
    render() {
        return (
            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><i class="el-icon-setting"></i> 自述</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="ms-doc">
                    <h3>README.md</h3>

                    <h1>manage-system</h1>
                    <p>基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案</p>
                    <h2>前言</h2>
                    <p>该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于vue.js,使用vue-cli脚手架快速生成项目目录，引用Element UI组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。</p>
                    <h2>功能</h2>
                    <el-checkbox disabled checked>登录/注销</el-checkbox>
                    <br>
                        <el-checkbox disabled checked>1.查看平台列表</el-checkbox>
                        <br>
                            <el-checkbox disabled checked>2.查看平台详情</el-checkbox>
                            <br>
                                <el-checkbox disabled checked>3.创建/更新 平台信息</el-checkbox>
                                <br>
                                    <el-checkbox disabled checked>4.保存平台信息</el-checkbox>
                                    <br>

          
            </div>

            </div>
            
        )
    }
}

export default NotFound;