import React, {
  Component,
  Fragment
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, Radio, Select, notification } from 'antd';
import moment from 'moment';
 
import httpServer from '../../../axios/index';
import EditableTable from './editTable'

const RadioGroup = Radio.Group;
class EstimateLib extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      modalFlag: false,
      record: '',
      editFlag: false,
      uuid:'',
    }
  }
  
  componentDidMount(){
    if(this.props.classId){this.List()}
  }
  
  componentWillUnmount(){
    this.setState = (state,callback)=>{
          return;
       }
  }
  List() {
    const classId = this.props.classId;
    httpServer.listEstimateLib({
      classId
    }).then(res => {
      if(res.data) {
        this.setState({
          dataSource: res.data
        })
      }
    })
  }
  

  /*修改操作*/
  handleModify(record) {
    this.setState({
      modalFlag: true,
      record,
      uuid:record.uuid,
      editFlag:true,
    });
  }
  /*删除操作*/
  handleRowDelete(id, record) {
    const _this = this;
    httpServer.deleteEstimateLib({
      id
    }).then(res => {
      if(res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.List();
      } else {
        console.log(res.message);
      }
      this.setState({
        modalFlag: false,
        record: ''
      });
    }).catch(
      err => {
        console.log(err)
      }
    )
  }
  /*添加按钮*/
  handleAdd() {
    this.setState({
      record:{
        title:'',
        type:1,
        mode:1,
        content:'',
        status:1,
      },
      modalFlag: true,
      editFlag:false,
      uuid:'',
    });
  }
    
    
  /*关闭弹框*/
  handleCancel=()=>{
    this.setState({
      modalFlag: false,
      record: ''
    });
  }
  /*提交完成添加客户信息*/
  handleSubmit = (e) => {
    const form = this.props.form;
    const _this = this;
        form.validateFields((err, fieldsValue) => {
      if(!err) {
        const values = {
          ...fieldsValue,
        };
        const {id} = this.state.record;
        if(id){
                    values.id = id;
          httpServer.updateEstimateLib(values).then((res)=>{
                 
                const args = {
              message: '保存成功',
              description: res.msg,
              duration: 2,
            };
            notification.success(args);
            this.setState({
              modalFlag: false,
              record: ''
            });
            _this.List()
              })
          }else{
            notification.error({
              message: '提示',
            description: '没有配置选项',
            duration: 2,
            })
          }
      }
    });
  }
  getUuid=()=>{
    const _this = this;
    const classId = this.props.classId;
    let falg = false;
    this.props.form.validateFields((err, fieldsValue) => {
      if(!err) {
        falg= false;
        const values = {
          ...fieldsValue,
          classId,
          type:1,
          mode:1
        };
        httpServer.saveEstimateLib(values).then((res) => {
          if(res.data){
                  const record = this.state.record;
                  record.id = res.data.id;
              this.setState({record,uuid:res.data.uuid})
              _this.List()  
          }
          
        });
      }else{
        falg= true;
      }
      
    })
    return falg
  }
    checkTitle(rule,value,cb){
       if(!value){
            cb('不可为空')
       }else{
            const id = this.state.record.id;
            if(!id){
              httpServer.checkEestimateLib({title:value}).then(res=>{
            if(res.code!==200){
              cb('评估项目已存在')
            this.setState({editFlag:false}) 
          }else{
              cb()
              this.onBlur()
          }
          })
            }else{
              cb()
            }
       }
    }
  onBlur=()=>{
    let _this = this;
    setTimeout(()=>{
      _this.props.form.validateFields((err,value)=>{
        if(!err){
          _this.setState({editFlag:true}) 
        }else{ 
          _this.setState({editFlag:false})
        }
      })  
    },500)
    
  }
  componentWillUnmount(){
    this.setState = (state,callback)=>{
          return;
       }
  }
  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      dataSource,
      modalFlag,
      customers,
      editFlag,
      uuid,
    } = this.state;
    const {
      id,
      type,
      title,
      content,
      status,
      mode,
    } = this.state.record;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        },
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 20
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
          span: 4,
          offset: 20,
        },
      },
    };

    const columns = [{
      title: '序号',
      render: (text, record, index) => `${index+1}`,
      width: '10%',
      key: 'index',
    }, {
      title: '评估项',
      dataIndex: 'title',
      key: 'title',
      width: '15%'
    }, {
      title: '简要描述',
      dataIndex: 'content',
      key: 'content',
     
    }, {
      title: '是否启用',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return record.status === 1 ? < Tag color = "green" >启用< /Tag>:<Tag color="red">禁用</Tag >
      },
      width: '15%'
    },  {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
      align:'center',
      render: (text, record) => {
        return(
          			<span>
                  <Button size="small" icon="edit" title="编辑" type="primary" onClick={() => { this.handleModify(record) }}></Button>
		              <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
		                 <Button size="small" icon="delete" title="删除" type="primary" ></Button>
		              </Popconfirm>
                </span>
        )
      },
    }];
    return(
      <div>
        <Card 
	          title="评估库"
	          bordered={false} 
	          extra={<Button type="primary" onClick={()=>{this.handleAdd()}}  disabled={!this.props.classId}>新增</Button>}
	        >
         
          <Table 
            size="middle"
            rowKey="id"
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
          />
          </Card>
        
        {
          modalFlag?
          <Modal 
            title="评估信息输入"
            width='60%'
            onOk= {this.handleSubmit}
            onCancel={this.handleCancel}
            visible={modalFlag}
           >
            <Form hideRequiredMark>
              <Form.Item
                label='评估项'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '请输入评估项名称' },{
                     validator:this.checkTitle.bind(this)
                  }],
                  initialValue:title,
                })(
                  <Input placeholder="请输入评估项名称"/>
                )}
              </Form.Item>
              <Form.Item
                label='简要描述'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('content', {
                  rules: [{ required: false, message: 'XXXXX' }],
                  initialValue:content,
                })(
                  <Input onChange={()=>this.onBlur()}/>
                )}
              </Form.Item>
             
              <Form.Item
                label="分值选项"
                {...formItemLayout}
              >
                 <EditableTable  uuid={uuid} sendEstimate={this.getUuid}  editFlag={editFlag}/>
              </Form.Item>
              <Form.Item
                label='标志集合'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态!' }],
                  initialValue:status||1,
                })(
                  <Radio.Group buttonStyle="solid"> 
                    <Radio.Button value={1}>启用</Radio.Button>
                    <Radio.Button value={2}>禁用</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
               
                
              
            </Form>
          </Modal>:null
        } 
      </div>
      )
  }
}
const Lib = Form.create()(EstimateLib);
export default Lib;