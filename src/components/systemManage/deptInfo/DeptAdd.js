import React,{Component,Fragment} from 'react';
import {Form,Input,Card,Button,Table,Divider,Popconfirm,Tag,Modal,Radio,DatePicker,notification} from 'antd';
import moment from 'moment';
import httpServer from '@/axios/index';

const RadioGroup = Radio.Group;
class DeptAdd1 extends Component{
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      //dataSource:[],
      modalFlag:false,
      record:{},
      // customerId:'',
      action:'',
      disFlag:false,
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

 
  //添加
  handleAdd(){
    this.setState({disFlag:false,action:'',modalFlag:true,record:{brithday:new Date(),entryTime:new Date(),status:1,sex:1}});
  }
  //修改
  handleModify(record){
    this.setState({action:'',modalFlag:true,record,disFlag:false,});
  }

  handleRead(record){
    this.setState({modalFlag:true,record,action:'read',disFlag:true,});
  }

  handleRowDelete(id){
    httpServer.deleteOperator({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
           if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              this.props.getDeptStaffList();
            } else {
              if(res.message ==='Request failed with status code 500'){
                  console.log(res.message);
               }else{
                   const args = {
                  message: '通信失败',
                  description: res.msg,
                  duration: 2,
                };
                notification.error(args);
               }
            }
        }).catch((err)=>{
          console.log(err);
        });
  }
  /*自定义手机号校验*/
  validatePhoneNumber(rule, value, callback){
    if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))){
      callback('手机号码格式不正确');
    }else{
      callback();
    }
  }
  //关闭弹出框
  handleCancel(){
    this.setState({modalFlag:false});
  }
  handleSubmit(e){
    e.preventDefault();
    const {departmentId} = this.props.selectedNode;
    const {customerId} = this.props;
    const {record,action} = this.state;
    const _this = this;
    if(action ==='read'){
      _this.handleCancel();
    }else{
      _this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        console.log(fieldsValue);
        if(!err){
          const values = {
            ...fieldsValue,
            'entryTime': fieldsValue['entryTime'].format('YYYY-MM-DD HH:mm:ss'),
            'brithday': fieldsValue['brithday'].format('YYYY-MM-DD HH:mm:ss'),
            'customerId':customerId,
            'level':1,
            'type':1,
            // 'deptId':departmentId,
          };
          if(record.id){
            values.id = record.id;
            values.deptId = record.deptId;
            httpServer.updateOperator(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
                if (res.code === 200) {
                  const args = {
                    message: '通信成功',
                    description: res.msg,
                    duration: 2,
                  };
                  notification.success(args);
                  _this.props.getDeptStaffList();
                  _this.handleCancel();
                } else {
                  if(res.message ==='Request failed with status code 500'){
                      console.log(res.message);
                   }else{
                       const args = {
                      message: '通信失败',
                      description: res.msg,
                      duration: 2,
                    };
                    notification.error(args);
                   }
                }
            }).catch((error)=>{
              console.log(error);
            });
          }else{
            values.deptId = departmentId;
            httpServer.saveOperator(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
                if (res.code === 200) {
                  const args = {
                    message: '通信成功',
                    description: res.msg,
                    duration: 2,
                  };
                  notification.success(args);
                  _this.props.getDeptStaffList();
                  _this.handleCancel();
                } else {
                  if(res.message ==='Request failed with status code 500'){
                      console.log(res.message);
                   }else{
                       const args = {
                      message: '通信失败',
                      description: res.msg,
                      duration: 2,
                    };
                    notification.error(args);
                   }
                }
            }).catch((error)=>{
              console.log(error);
            });
          }
        }
      })
    }
    
  }
  render(){
    const {selectedNode,dataSource} = this.props;
    const {modalFlag,disFlag} = this.state;
    const { getFieldDecorator } = this.props.form;
    const {account,name,sex,brithday,phone,status,jobNumber,entryTime,password,memo} = this.state.record;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
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
    const columns= [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'10%'
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width:'10%'
    },{
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width:'10%'
    },{
      title:'性别',
      dataIndex: 'sex',
      key: 'sex',
      render:(text,record)=>{
       return record.sex === 1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
      },
      width:'10%'
    },{
      title:'入职日期',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render:(text,record)=>{
        return record.entryTime && record.entryTime.substr(0,10)
      },
      width:'15%'
    },{
      title:'离职日期',
      dataIndex: 'quitTime',
      key: 'quitTime',
      render:(text,record)=>{
        return record.quitTime && record.quitTime.substr(0,10)
      },
      width:'15%'
    },{
      title:'状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
       return record.status === 1?<Tag color="green">在职</Tag>:<Tag color="red">离职</Tag>
      },
      width:'10%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record)=>{
        return(
          <span>
            <a href="javascript:;" onClick={() => { this.handleRead(record) }} style={{color:'#2ebc2e'}}>查看</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
        )
      },
    }];
    return(
      <Fragment>
        <Card
          title="部门员工信息列表"
          extra={<Button type="primary" onClick={this.handleAdd}>添加</Button>}
          style={{ width: "100%", }}
        >
          <p>当前所在部门：{selectedNode.departmentName}</p>
          <Table 
            bordered
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
            rowKey={record => record.id}
          />
        </Card>
        {
          modalFlag?
            <Modal 
              title="部门员工信息"
              visible={modalFlag}
              onCancel={()=>{this.handleCancel()}}
              maskClosable={false}
              footer={null}
            >
              <Form hideRequiredMark onSubmit={this.handleSubmit}>
                <Form.Item
                  label="登录用户名"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入登录用户名!' }],
                    initialValue:account,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="登录密码"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入登录密码!' }],
                    initialValue:password,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="姓名"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入员工姓名!' },{
                    }],
                    initialValue:name,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="工号"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('jobNumber', {
                    rules: [{ required: true, message: '请输入员工工号!' },{
                    }],
                    initialValue:jobNumber,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="电话"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入电话号码!' },{
                      validator:this.validatePhoneNumber,
                    }],
                    initialValue:phone,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="生日"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('brithday', {
                    rules: [{ required: true, message: '请选择日期!' }],
                    initialValue:brithday?moment(brithday,'YYYY-MM-DD') : null,
                  })(
                    <DatePicker format='YYYY-MM-DD' disabled={disFlag} />
                  )}
                </Form.Item>
                <Form.Item
                  label='入职时间'
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('entryTime', {
                    rules: [{ required: true, message: '请选择日期!' }],
                    initialValue:entryTime?moment(entryTime,'YYYY-MM-DD HH:mm:ss') : null,
                  })(
                    <DatePicker format='YYYY-MM-DD HH:mm:ss' showTime={true} disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label="性别"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别!' }],
                    initialValue:sex,
                  })(
                    <RadioGroup disabled={disFlag}>
                      <Radio value={1}>男</Radio>
                      <Radio value={0}>女</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
                <Form.Item
                  label="状态"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态!' }],
                    initialValue:status,
                  })(
                    <RadioGroup disabled={disFlag}>
                      <Radio value={1}>在职</Radio>
                      <Radio value={0}>离职</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
                <Form.Item
                  label="备注"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('memo', {
                    rules: [{ required: false, message: '请输入备注信息!' }],
                    initialValue:memo,
                  })(
                    <Input disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">提交</Button>
                  <Button type="default" onClick={()=>{this.handleCancel()}}>取消</Button>
                </Form.Item>
              </Form>
            </Modal>:null
        }
      </Fragment>
    )
  }
}
const DeptAdd = Form.create()(DeptAdd1);
export default DeptAdd;

/*
{
      title:'登录名',
      dataIndex: 'account',
      key: 'account',
      width:'10%'
    },{
      title:'生日',
      dataIndex: 'brithday',
      key: 'brithday',
      width:'12%'
    },{
      title:'手机',
      dataIndex: 'phone',
      key: 'phone',
      width:'10%'
    },,{
      title:'工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width:'10%'
    }
 */