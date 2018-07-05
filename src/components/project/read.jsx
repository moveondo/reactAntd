import React, { Component } from 'react';
import { Table, Button, Form, Modal, message } from 'antd';
import axios from 'axios';
import moment from 'moment'; 
// import './../mock';




// const url = "http://172.20.14.36:8080/ccdbackend/api/forum/queryTopicDetail.htm";
// const url1 = "http://172.20.14.36:8080/ccdbackend/api/forum/deleteReply.htm";
const url = "/ccdbackend/api/forum/queryTopicDetail.htm";
const url1 = "/ccdbackend/api/forum/deleteReply.htm";

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

const rowKey = function (record) {
    return record.replyId;  // 比如你的数据主键是 replyId
};

class BasicForms11 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ArrayData: [],
            datalength: "",
            current: '',
            pagesize: '',
            visible: false,
            topicId:'',
            replyId: '',
            columns: [
                { title: '回复序号', dataIndex: 'replyId', key: 'replyId' },
                { title: 'userId', dataIndex: 'userId', key: 'userId' },
                { title: '姓名', dataIndex: 'nickName', key: 'nickName' },
                { title: 'iconUrl', dataIndex: 'iconUrl', key: 'iconUrl' },
                { title: 'replyContent', dataIndex: 'replyContent', key: 'replyContent' },
                { title: 'fileUrls', dataIndex: 'fileUrls', key: 'fileUrls' },
                { title: 'replyTime', dataIndex: 'replyTime', key: 'replyTime' },
                {
                    title: 'Action', dataIndex: '', key: 'x', render: (text, record) => (  //塞入内容
                        <span>                     
                            <Button type="primary" className="delete-data" onClick={this.deletSource.bind(this, text)}>删除</Button >
                        </span>
                    ),
                },
            ]
        };
    };



    handleOk() {
        var _this = this;
        let replyId = _this.state.replyId;
 
        _this.setState({
            visible: false,
        });
        axios.post(url1, {
            replyId: replyId
        }).then(function (response) {
                   
             const newData = [];
            for (const record of _this.state.ArrayData) {
                console.log(replyId, record.replyId, replyId, "replyId")
                if (replyId !== record.replyId) {  // 是否是被删除的记录
                    newData.push(record);               
                }
            }       
            _this.setState({ ArrayData: newData });

            message.success(response.data.resultMessage);

        }).catch(function (error) {
            console.log(error);
        });

    };
    handleCancel() {
        this.setState({
            visible: false,
        });
    };
    deletSource(_this, text) {
      //  console.log("replyId"+_this.replyId);
        this.setState({
            visible: true,
            replyId: _this.replyId
        });
    };
    showTotal(){
        let total=50;
        return `共 ${total} 条`;
    }



    getData = (topicId, Current, pagesize) => {
        const _this = this;
        if (topicId === null || topicId === undefined || topicId === '') {
            topicId = "";
        }
        if (pagesize === null || pagesize === undefined || pagesize === '') {
            pagesize = 20;
        }
        if (Current === null || Current === undefined || Current === '') {
            Current = 1;
        }
        axios.post(url, {
            topicId: topicId,
            pageNo: Current,
            pageSize: pagesize,
        }).then(function (response) {
            var Replys = response.data.content.replys;
            var Rlength = response.data.content.pageCount * response.data.content.rowCount;
            Replys.map(function (element, index) {
                //moment(Time).format("YYYY-MM-DD HH:mm:ss")
                return element.replyTime = moment(element.replyTime).format("YYYY-MM-DD HH:mm:ss");
                //element.key = index;
            });
            //console.log(Replys);
            _this.setState({ ArrayData: Replys });

            _this.setState({ datalength: Rlength });
            //console.log(response.data.content.topics);

        }).catch(function (error) {
            console.log(error);
        });

    };

    componentDidMount() {
        //console.log("topicId"+this.props.location.query.topicId);
        let topicId = this.props.location.query.topicId;
        this.setState({
            topicId: topicId
        });
        this.getData(topicId);

    };


    render() {
        const that = this;
     

        return (
            <div>
                <Modal title="提示" visible={this.state.visible}
                    onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                >
                    <p>确定删除吗？</p>
                </Modal>
                <Table 
                    pagination={{
                        total: that.state.datalength,
                        current: that.state.current,
                        pageSize:20,
                        onChange: (page, pageSize) => {
                            console.log('current page: ', page)
                            that.setState({
                                current: page
                            })
                            that.getData(that.state.topicId,page,pageSize);
                        },
                        
                    }}
                    rowKey={rowKey}

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

