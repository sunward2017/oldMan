import React from 'react';
import { Row, Col, Card, Button, notification, Icon, Spin ,Divider,Popconfirm,Table,Modal,Form,Input,InputNumber,Select,Radio} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import Tree from '../../../common/tree';
import httpServer from '../../../axios/index';

const Option = Select.Option;
class PayItem1 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            zNodes :[],
            payItem:[],
            selectedNode:null,
            data:[],
            modalFlag:false,
            record:{},
            unitList:null,
        };
        this.handleCancel =this.handleCancel.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.fetchTreeData();
    }
    fetchTreeData() {
        this.postSever('getPayItemTree',{customerId:this.props.auth.customerId}).then(res => {
            if(res.code === 200 ) {
                res.data ? this.setState({ zNodes : [{...res.data, open:true}]}) : this.setState({ zNodes : []})
            }
        })
    }
    fetchPayItem(data) {
        const { id, customerId } = data;
        this.postSever('lisPayItemChild',{pid:id, customerId}).then(res => {
            if(res.code === 200) {
                res.data ? this.setState({data : res.data}):this.setState({data:[]});
            }
        })
    }
    nodeEditHandler = (nodeData, cb) => {
        const { customerId,id,name,pid } = nodeData;
        this.postSever('updatePayItem',{ customerId,id,name,pid}).then(res => {
            if(res.code ===200) {
                cb(true);
                this.fetchTreeData();
                this.setState({data:[],selectedNode:null});
                this.notice('success',res.msg);
            }else{
                cb(false);
                this.notice('error',res.msg);
            }
        });
    };
    nodeDeleteHandler = (nodeData, cb) => {
        const { customerId,id ,pid} = nodeData;
        this.postSever('deletePayItem',{customerId,id,pid}).then(res => {
            if(res.code === 200) {
                cb(true,nodeData);
                this.fetchTreeData();
                this.setState({data:[],selectedNode:null});
                this.notice('success', res.msg);
            }else {
                this.notice('error', res.msg);
            }
        });
    };
    nodeAddHandler = (pNode, cb) => {
        const { customerId ,id} = pNode;
        this.postSever('savePayItem',{name:'new', customerId, pid:id}).then(res => {
            if(res.code ===200) {
                cb(true,res.data);
                this.fetchTreeData();
                this.setState({data:[],selectedNode:null});
                this.notice('success', res.msg);
            }else {
                this.notice('error', res.msg);
            }
        }).catch(err => {});
    };
    nodeClickHandler = (nodeData) => {
        const { selectedNode } = this.state;
        if(nodeData.pid ===0 || (selectedNode && selectedNode.id === nodeData.id)) return;
        this.setState({selectedNode:nodeData,payItem : []});
        this.fetchPayItem(nodeData);
    };  
    postSever(url,data){
        return new Promise((resolve, reject) => {
            httpServer[url](data).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }

     
    handleCancel(){
        this.setState({modalFlag:false});
    }
    handleClickAdd(){
        const {selectedNode} = this.state;
        if(!selectedNode){
            const args = {
              message: '提示',
              description: "请先单击选择收费类别",
              duration: 2,
            };
            notification.info(args);
            return;
        }
        this.setState({modalFlag:true,record:{days:0}});
    }
    saveModifyHandler(record){
        this.setState({modalFlag:true,record});
    }
    rowDeleteHandler(record){
        const _this = this;
        const {id} = record;
        const {customerId} = _this.state.selectedNode;
        httpServer.deletePayItemChild({id,customerId}).then(res => {
          if (res.code === 200) {
            const args = {
              message: '通信成功',
              description: res.msg,
              duration: 2,
            };
            notification.success(args);
            _this.fetchPayItem(_this.state.selectedNode);
          } else {
            const args = {
              message: '通信失败',
              description: res.msg,
              duration: 2,
            };
            notification.error(args);
          }  
        }).catch(
          err => { console.log(err) }
        )
    }

    validateDays(rule, value, callback){ 
       if(value && !(/^([1-9]\d*|[0]{1,1})$/.test(value))) {
            callback('只能为正整数');
        } else {
            callback();
        } 
    }
    handleModify=(r)=>{
    	 this.setState({modalFlag:true,record:{...r}});
    }
    handleSubmit(){
        const { customerId } = this.state.selectedNode;
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if(!err) {
                const values = {
                    ...fieldsValue,
                    'unit':'1',
                    'pid': _this.state.selectedNode.id,
                    'customerId': customerId
                };
              const { id }= _this.state.record;
              if(id){
                    values.id = id;
                    httpServer.updatePayItemChild(values).then((res)=>{
                        if(res.code === 200){
                            const args = {
                                message: '通信成功',
                                description: res.msg,
                                duration: 2,
                            };
                            notification.success(args);
                            _this.setState({modalFlag: false,record: {},});
                            _this.fetchPayItem(_this.state.selectedNode);
                        }else{
                            const args = {
                                message: '通信失败',
                                description: res.msg,
                                duration: 2,
                            };
                            notification.error(args);
                        }   
                    }).catch(
                          err => { console.log(err) }
                        )
               }else{
                   httpServer.savePayItemChild(values).then((res) => {
                        if(res.code === 200){
                            const args = {
                                message: '通信成功',
                                description: res.msg,
                                duration: 2,
                            };
                            notification.success(args);
                            _this.setState({modalFlag: false,record: {},});
                            _this.fetchPayItem(_this.state.selectedNode);
                        }else{
                            const args = {
                                message: '通信失败',
                                description: res.msg,
                                duration: 2,
                            };
                            notification.error(args);
                        }   
                    }).catch(
                          err => { console.log(err) }
                        )   
               }
            }
        });
    }
    render() {
        const { zNodes, payItem, selectedNode ,data ,modalFlag,unitList} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {
            name,
            price,
            unit,
            days,
        } = this.state.record;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 6
                },
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 18
                },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const columns = [{
            title: '收费项目',
            dataIndex: 'name',
            key:'name',
            width:'20%'
        }, {
            title: '收费价格',
            dataIndex: 'price',
            width: '20%',
            key:'price',
        }, {
            title:'收费周期',
            dataIndex: 'unit',
            key: 'unit',
            width: '20%',
            render:(t,r)=>{
               return '月'
            }
        },{
            title: '退费起始天数',
            dataIndex: 'days',
            key: 'days',
            width:'25%'
        }, {
            title: '操作',
            dataIndex: 'action',
            key:'action',
            width:'10%',
            align:'center',
            render: (text, record) => {
                return (
                     record.price?<Button size="small" onClick={() => { this.handleModify(record) }} title="修改" type="primary" icon="edit"></Button>:null
                );
            }
        }];
        return (
            <div>
                <BreadcrumbCustom first="财务管理" second="收费项目" />
                <Row gutter={16}>
                    <Col  md={8} lg={5} style={{background:'#fff'}}>
                        <Card bordered={false}  title="收费类别:">
                            <Tree id={'payItemTree'} zNodes={zNodes}
                                  onEdit={this.nodeEditHandler}
                                  onDelete={this.nodeDeleteHandler}
                                  onAddNew={this.nodeAddHandler}
                                  onNodeClick={this.nodeClickHandler}
                                  editableTree="true"
                                  levelMax={1}
                            />
                        </Card>
                    </Col>
                    <Col  md={16} lg={19}>
                        <Card 
                            title="收费项目"
                            bordered={false} 
                            extra={<Button type="primary" onClick={this.handleClickAdd}  title="新增" icon="plus"></Button>}
                        > 
                            <Table size="middle" columns={columns} dataSource={data} pagination={{ pageSize: 50 }} rowKey={record => record.id} />
                        </Card>
                    </Col>
                </Row>
                {
                    modalFlag?
                   <Modal 
                    title="收费项目内容编辑"
                    visible={true}
                    onCancel={this.handleCancel}
                    maskClosable = {false}//点击遮罩层不允许关闭
                    footer = {null}
                  >
                    <Form hideRequiredMark onSubmit={this.handleSubmit}>
                      <Form.Item
                        label='收费项目'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入收费项目名称!' }],
                          initialValue:name,
                        })(
                          <Input />
                        )}
                      </Form.Item>
                      <Form.Item
                        label='收费价格'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        {getFieldDecorator('price', {
                          rules: [{ required: true, message: '请输入收费价格!' }],
                          initialValue:price,
                        })(
                          <InputNumber min={0} step="0.001" style={{width:'100%'}}/>
                        )}
                      </Form.Item>
                      <Form.Item
                        label='收费周期'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        {getFieldDecorator('unit', {
                          rules: [{ required: true, message: '请选择收费周期!' }],
                          initialValue: '月',
                        })(
                          <Input disabled/>
                        )}
                      </Form.Item>
                      <Form.Item
                        label='退费起始天数'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        {getFieldDecorator('days', {
                          rules: [{ required: true, message: '请输入退费起始天数!' },{
                            validator:this.validateDays,}],
                          initialValue:days,
                        })(
                          <InputNumber min={0} style={{width:'100%'}}/>
                        )}
                      </Form.Item>
                      <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" >确认提交</Button>
                      </Form.Item>
                    </Form>
                  </Modal>:null
                }
            </div>
        )
    }
}
const PayItem = Form.create()(PayItem1);
export default PayItem;