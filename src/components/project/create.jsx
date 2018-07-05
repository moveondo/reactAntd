
import React, { Component } from 'react';
import axios from 'axios';
import draftToHtml from 'draftjs-to-html';
import { Card, Form, Input, Icon, Select, Row, Col, Button, Upload, Radio, InputNumber, message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import Wysiwyg from '../ui/Wysiwyg1';
import { Redirect } from 'react-router-dom';  
const FormItem = Form.Item;
const Option = Select.Option;
// const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const url='/ccdbackend/api/forum/publishTopic.htm';
//const url = 'http://172.20.14.36:8080/ccdbackend/api/forum/publishTopic.htm';



var imgURl;

const propsload = {
    name: 'file',
    action: '/IUploadFilesService/upload.htm',
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功。`);
            imgURl = info.file.response.content;
            console.log(info.file.response.content)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    }
};

class BasicForms extends Component {
    state = {
        confirmDirty: false,
        editContent:'',  
        redirect:false,    
    };
    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        _this.props.form.validateFieldsAndScroll((err, values) => {
            if (values.userId === undefined || values.userId===""){
                message.error("userID不可为空");
                return false;
            }
            if (!err) {
                console.log('Received values of form: ', values);
               // console.log(this.state.editContent);
                _this.getPros(values, _this.state.editContent);
            }
        });
    };
    getPros = (values, editContent) => {
        const _this = this;
        axios.post(url, {
            userId: values.userId,
            topicName: values.topicName,
            content: editContent,
            weight: values.weight,
            displayFlag: values.displayFlag,
            fileUrl: imgURl,
        }).then(function (res) {
          
            if(res.data.result===0){
                _this.setState({ redirect: true });

                message.success(res.data.resultMessage);

            }
           

            //return response.data;
        }).catch(function (error) {
            message.error(error);
            console.log(error);
        });


    }
    // handleChange=(value)=> {
    // console.log(`selected ${value}`);
    //  };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    handleEdit=(event) =>{
       // console.log(draftToHtml(event));
        this.setState({ editContent: draftToHtml(event) });
    };
    render() {

        if (this.state.redirect) {
            return <Redirect push to="/app/project/list" />; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数  
        }  
        //const { getFieldDecorator } = this.props.form;
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 8,
                },
            },
        };
        const selectProps = getFieldProps('userId', {
            rules: [
                { required: false, message: '请选择您的国籍' }
            ],
        });
        console.log({ ...formItemLayout });
        return (

            <div className="gutter-example">
                <BreadcrumbCustom first="文章" second="文章创建" />
                <Row gutter={16}>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="文章创建" bordered={false}>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem   
                                        {...formItemLayout}
                                        label="来源:"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 10 }} 
                                    >
                                        <span className="ant-form-text">曹操贷</span>
                                    </FormItem>
                                    <FormItem  
                                        {...formItemLayout}
                                        label="模块:"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 10 }} 
                                    >
                                        <span className="ant-form-text" >贷友交流</span>
                                    </FormItem>                           
                                    <FormItem 
                                        {...formItemLayout}
                                        id="select"
                                        label="发布人："
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 10 }} 
                                    >
                                    <Select {...selectProps} size="large" defaultValue="10001" style={{ width: 200 }}>
                                        <Option value="10001">机器人一</Option>
                                        <Option value="10002">机器人二</Option>
                                        <Option value="10003" >机器人三</Option>
                                        <Option value="10004">机器人四</Option>
                                        <Option value="10005">机器人五</Option>
                                    </Select>
                                    </FormItem>
                                    <FormItem 
                                        {...formItemLayout}
                                        label="标题"   
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 10 }} 
                                    > 
                                        <Input placeholder="请输入标题"
                                            {...getFieldProps('topicName')} 
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="封面图片："
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        help="png,jpeg"
                                    >
                                        <Upload {...propsload}>
                                            <Button type="ghost">
                                                <Icon type="upload" /> 点击上传
                                            </Button>
                                        </Upload>
                                        {/* <Upload name="logo" action="http://172.20.14.41:8080/IUploadFilesService/upload.htm" listType="picture" 
                                            {...getFieldProps('fileUrl', {
                                                valuePropName: 'fileList',
                                                normalize: this.normFile
                                            })}
                                        >
                                            <Button type="ghost">
                                                <Icon type="upload" /> 点击上传
                                            </Button>
                                        </Upload> */}
                                    </FormItem>
                                    {/* <FormItem   {...formItemLayout}
                                        label="Checkbox 多选框："
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }} >
                                        <label className="ant-checkbox-inline">
                                            <Checkbox  {...getFieldProps('eat1', {
                                                valuePropName: 'checked',
                                            })} />现金贷
                                        </label>
                                        <label className="ant-checkbox-inline">
                                            <Checkbox {...getFieldProps('eat2', {
                                                valuePropName: 'checked',
                                            })} />口子
                                        </label>
                                        <label className="ant-checkbox-inline">
                                            <Checkbox {...getFieldProps('eat3', {
                                                valuePropName: 'checked',
                                            })} />下数
                                        </label>
                                    </FormItem> */}
                                    <FormItem  
                                        {...formItemLayout}
                                        label="是否在前台展示"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }} 
                                    >
                                        <RadioGroup {...getFieldProps('displayFlag', { initialValue: 'true' })} >
                                            <Radio value="true">是</Radio>
                                            <Radio value="false">否</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem 
                                        {...formItemLayout}
                                        label="文章权重："
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        <InputNumber min={0} max={10} style={{ width: 100 }}
                                            {...getFieldProps('weight', { initialValue: 0 })} 
                                        />                         
                                    </FormItem>
                                    <Wysiwyg handleEdit={this.handleEdit.bind(this)} />
          
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" size="large">发布</Button>
                                    </FormItem>
                                </Form>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <style>
                    {`
                    @media (min-width: 768px){
                        .ant-col-md-12 {
                        display: block;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        width: 100% ;
                      }
                      .ant-form label {
                            font-size: 16px;
                      }
                      .ant-form-item{
                          font-size:16px;
                      }

                    }

                    `}
                </style>
            </div>
        )
    }
}

const BasicForm = Form.create()(BasicForms);

export default BasicForm;