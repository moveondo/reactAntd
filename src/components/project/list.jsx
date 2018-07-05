import React, { Component } from 'react';
import { Table, Button, Input, Form, Modal, message, Radio} from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

//import './../mock';


const FormItem = Form.Item;


  
// const url = 'http://172.20.14.36:8080/ccdbackend/api/forum/queryTopicList.htm';
// const url2 ="http://172.20.14.36:8080/ccdbackend/api/forum/modifyTopic.htm";
// const url3 ="http://172.20.14.36:8080/ccdbackend/api/forum/deleteTopic.htm";

const url = '/ccdbackend/api/forum/queryTopicList.htm';
const url2 = "/ccdbackend/api/forum/modifyTopic.htm";
const url3 = "/ccdbackend/api/forum/deleteTopic.htm";




// const rowSelection = {
//     onChange(selectedRowKeys) {
//         console.log(`selectedRowKeys changed: ${selectedRowKeys}`);
//     },
//     onSelect(record, selected, selectedRows) {
//         console.log(record, selected, selectedRows);
//     },
//     onSelectAll(selected, selectedRows) {
//         console.log(selected, selectedRows);
//     }
// };

const CollectionCreateFormupdate = Form.create()(
    (props) => {
        //console.log(props);
        const { visible, onCancel, onCreate, form, dataS} = props;
        // console.log("visibleupdate" + visible);
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="更新话题"
                okText="更新"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal" id="secondform">
                    <FormItem label="话题ID" >
                        {getFieldDecorator('topicId', { initialValue: dataS.topicId },{
                            rules: [{ required: true, message: '话题ID不能为空!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="话题名">
                        {getFieldDecorator('topicName', { initialValue: dataS.topicName }, {
                            rules: [{ required: true, message: '话题名不能为空!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>  
                    <FormItem label="话题内容">
                        {getFieldDecorator('content', { initialValue: dataS.replyContent })(<Input type="textarea" rows="3" />)}
                    </FormItem>
                    <FormItem label="图片">
                        <img style={{ width: 100 + '%' }} src={dataS.fileUrl} alt="" />
                        {getFieldDecorator('fileUrl', { initialValue: dataS.fileUrl }, {
                            rules: [{ required: true, message: '图片不可为空!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="权重">
                        {getFieldDecorator('weight', { initialValue: dataS.weight },{
                            rules: [{ required: true, message: '权重不能为空!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="是否展示" className="collection-create-form_last-form-item" style={{ marginBottom: 0 }}>
                        {getFieldDecorator('displayFlag', { initialValue:"false"})(
                            <Radio.Group>
                                <Radio value="true">是</Radio>
                                <Radio value="false">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

class BasicForms11 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ArrayData: [],
            datalength: "",
            current: '',
            pagesize: '',
            visible:false,
            visibleupdate:false,
            dataUpdate:'',
            topicId:'',
            columns:[
                { title: '话题ID', dataIndex: 'topicId', key: 'topicId' },
                { title: 'userId', dataIndex: 'userId', key: 'userId' },
                { title: '姓名', dataIndex: 'nickName', key: 'nickName' },
                { title: '话题名称', dataIndex: 'topicName', key: 'topicName' },
                { title: '浏览数量', dataIndex: 'viewCount', key: 'viewCount' },
                { title: '回复数量', dataIndex: 'replyCount', key: 'replyCount' },
                { title: '权重', dataIndex: 'weight', key: 'weight' },
                {
                    title: '操作', dataIndex: '', key: 'x', render: (text, record) => (  //塞入内容
                        <span>
                            <Button type="primary" className="edit-data" onClick={this.editSource.bind(this, text)}>编辑</Button >
                            <Button type="primary" className="delete-data" onClick={this.deletSource.bind(this, text)}>删除</Button >
                            <Link className="topo-data" to={{ pathname: '/app/project/read', query: { topicId: text.topicId} }}>查看评论</Link>
                        </span>
                    ),
                },
            ]
        };
    };
    handleSubmit = (e) => {
        e.preventDefault();
        var TopicName = this.props.form.getFieldsValue().TopicName;
        console.log(TopicName);
        this.getData(TopicName, this.state.current, this.state.pagesize);
        console.log('收到表单值:', this.props.form.getFieldsValue().TopicName);

    };

    editSource(_this,text){
        console.log(_this.key);
        this.setState({ visibleupdate: true });
        this.setState({ dataUpdate: _this });
    
    };
    //删除话题列表
    handleOk(){
        var _this=this;
        let topicId = this.state.topicId;
        this.setState({
            visible: false,
        });
        axios.post(url3, {
            topicId: topicId
        }).then(function (response) {
        
            const newData = [];
            for (const record of _this.state.ArrayData) {
                console.log(record,record.topicId, topicId, "topicId")
                if (topicId !== record.topicId) {  // 是否是被删除的记录

                    newData.push(record);
                  
                }
            }       
            _this.setState({ ArrayData: newData });
            message.success(response.data.resultMessage);

        }).catch(function (error) {
            console.log(error);
        });

    };
    handleCancel(){
        this.setState({
            visible: false,
        });
    };
    deletSource(_this, text){
        console.log(_this.key);
        this.setState({
            visible: true,
            topicId: _this.topicId
        });
       
    };
    
    updateData(values){
        axios.post(url2, {
            topicId: values.topicId,
            topicName:values.topicName,
            content: values.content,
            weight: values.weight,
            fileUrl:values.fileUrl,
            displayFlag: values.displayFlag
       }).then(function (res) {
           if(res.data.result===0){
               message.success(res.data.resultMessage);
           }else{
               message.error(res.data.resultMessage);
           }
          
       }).catch(function (error) {
           console.log(error);
       });

   };

    getData = (TopicName,Current, pagesize) => {
        const _this = this;
        if (pagesize === null || pagesize === undefined || pagesize === '') {
            pagesize = 20;
        }
        if (Current === null || Current === undefined || Current === '') {
            Current = 1;
        }
        axios.post(url, {
            queryTopicName: TopicName,
            pageNo: Current,
            pageSize: pagesize,
        }).then(function (response) {
            var Rtopics = response.data.content.topics;
             var Rlength = response.data.content.pageCount * response.data.content.rowCount;
             Rtopics.map(function (element, index) {
                 return element.key = index;
             });

            _this.setState({ ArrayData: Rtopics });
            
            _this.setState({ datalength: Rlength });
            //console.log(response.data.content.topics);

        }).catch(function (error) {
            console.log(error);
        });

    };
    handleCancelupdate = () => {
        this.setState({ visibleupdate: false });
    };
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }else{
                this.updateData(values)
            }

           // console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visibleupdate: false });
        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };


    componentDidMount() {

        this.getData();

    

    };


    render() {
        const that = this;
        const { getFieldProps } = that.props.form;
        // const { getFieldDecorator } = form;
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 2400,
                    offset: 100,
                },
                sm: {
                    span: 20,
                    offset: 8,
                },
            },
        };
        console.log("this.state.visibleupdate" + this.state.visibleupdate);
        return (
            <div>
                <Modal title="提示" visible={this.state.visible}
                    onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                >
                    <p>确定删除吗？</p>
                </Modal>
                <CollectionCreateFormupdate
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visibleupdate}
                    dataS={this.state.dataUpdate}
                    onCancel={this.handleCancelupdate.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                />     
                <Form>
                    <FormItem
                        label="文章标题："
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input placeholder="请输入文章标题"
                            {...getFieldProps('TopicName')}
                        />
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="search" htmlType="submit" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                    </FormItem>
                </Form>
                <Table 
                    pagination={{
                        total: that.state.datalength,
                        current: that.state.current,
                        pageSize: 20, 
                        onChange: (page, pageSize) => {
                            // console.log('current page: ', page)
                            // console.log('current pageSize: ', pageSize)
                            that.setState({
                                current: page
                            })
                            that.getData(that.state.TopicName, page, pageSize);
                        }
                    }}
                    columns={that.state.columns}
                    // expandedRowRender={record => <p>{record.description}</p>}
                    dataSource={that.state.ArrayData}
                    // pagination={this.pagination} 
                    size="middle"
                />
                <style>
                    {`
                    .ant-col-14{
                        width:66%;
                    }
                    .ant-form{
                        display:flex;
                        justify-content: start;
                      
                    }
                    #secondform{
                     
                        flex-direction: column;
                    }
                    .ant-modal{
                        width:61% !important;
                    }
                    .ant-form-item{
                        margin-bottom:10px;
                    }
                    .topo-data{
                        color: #fff;
                        background-color: #001529;
                        border-color: #001529;
                        line-height: 1.5;
                        display: inline-block;
                        font-weight: 400;
                        text-align: center;
                        -ms-touch-action: manipulation;
                        touch-action: manipulation;
                        cursor: pointer;
                        background-image: none;
                        border: 1px solid transparent;
                        white-space: nowrap;
                        padding: 0 15px;
                        font-size: 12px;
                        border-radius: 4px;
                        height: 24px;
                        margin-left: 15px;
                            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                        position: relative;
                    }

                    `}
                </style>
            </div>

        )
    }
}

const BasicForm1 = Form.create()(BasicForms11);

export default BasicForm1;

