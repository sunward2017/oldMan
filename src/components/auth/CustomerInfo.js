import React ,{Component} from 'react';
import {Table,Tag,Divider,Popconfirm,Button,Modal,Form,Input,Radio,notification} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
//import moment from 'moment';
import httpServer from '../../axios';

const RadioGroup = Radio.Group;
class CustomerInfo1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      modalFlag:false,
      record:'',
    }
  }

  componentDidMount(){
    this.initialization();
  }

  initialization(){
    httpServer.listCustomerInfo().then(res => {
      if (res.code === 200) {
        res.data ? this.setState({ dataSource: res.data }) : this.setState({ dataSource: [], });
      } else {
        const args = {
          message: '通信失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  /*修改操作*/
  handleModify(record){
    this.setState({modalFlag:true,record});
  }
  /*删除操作*/
  handleRowDelete(id,record){
    const _this = this;
    httpServer.deleteCustomer({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.initialization();
      } else {
        console.log(res.message);
      }
      this.setState({modalFlag:false,record:''});
    }).catch(
      err => { console.log(err) }
    )
  }
  /*添加按钮*/
  handleAdd(){
    this.setState({modalFlag:true,record:''});
  }
  /*关闭弹框*/
  handleCancel(){
    this.setState({modalFlag:false,record:''});
  }
  /*提交完成添加客户信息*/
   handleSubmit = (e) => {
    e.preventDefault();
    const _this = this;
    const {record} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(record.id){
          const data = Object.assign({},record,values);
          httpServer.updateCustomer(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
            if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              _this.initialization(); 
              this.setState({modalFlag:false,record:''});
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
         
        }else{
          httpServer.saveCustomer(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
            if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              _this.initialization(); 
              this.setState({modalFlag:false,record:''});
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
      }
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

  handleInitialize(record){
     httpServer.systemIni({customerId:record.customerId},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.initialization();
      } else {
        console.log(res.message);
      }
      this.setState({modalFlag:false,record:''});
    }).catch(
      err => { console.log(err) }
    )
  }
  
 
  render(){
    const { getFieldDecorator } = this.props.form;
    const {dataSource,modalFlag} = this.state;
    const {customerName,phone,email,postcode,contact,status,memo,address} = this.state.record;
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

    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'index',
      width:'5%'
    },{
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width:'10%'
    },{
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
      width:'5%'
    },{
      title:'地址',
      dataIndex: 'address',
      key: 'address',
      width:'18%'
    },{
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width:'10%'
    },{
      title: '邮编',
      dataIndex: 'postcode',
      key: 'postcode',
      width:'5%'
    },{
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width:'5%'
    },{
      title: '添加日期',
      dataIndex: 'addtime',
      key: 'addtime',
      width:'10%'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 1?<Tag color="green">正常</Tag>:<Tag color="red">注销</Tag>
      },
      width:'5%'
    },{
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width:'12%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record)=>{
        return(
          <span>
            <span onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</span>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <span style={{color:'#2ebc2e'}}>删除</span>
              </Popconfirm>
              <Divider type="vertical" />
              {
                record.flag === 0? <span onClick={() => { this.handleInitialize(record) }} style={{color:'#007bff'}}>数据初始化</span>:<span style={{color:'#2ebc2e'}}>已初始化</span>
              }
          </span>
        )
      },
    }];
    return(
      <div>
        <BreadcrumbCustom first="系统管理" second="客户信息" />
        <Button type="primary" onClick={()=>{this.handleAdd()}} style={{marginBottom:'20px'}} >点击添加</Button>
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
            rowKey={record => record.id}
          />
        {
          modalFlag?
          <Modal 
            title="客户信息添加"
            // width='60%'
            okText="提交"
            visible={modalFlag}
            onOk={()=>{this.handleOk()}}
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item
                label="客户名称"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('customerName', {
                  rules: [{ required: true, message: '请输入客户名称!' }],
                  initialValue:customerName,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label="电话号码"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: '请输入电话号码!' },{
                    validator:this.validatePhoneNumber,
                  }],
                  initialValue:phone,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label="地址信息"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('address', {
                  rules: [{ required: false, message: '请输入地址信息!' }],
                  initialValue:address,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label="邮箱信息"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('email', {
                  rules: [{ required: false, message: '请输入邮箱!' }],
                  initialValue:email,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label="邮编信息"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('postcode', {
                  rules: [{ required: false, message: '请输入邮编!' }],
                  initialValue:postcode,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label="联系人"
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('contact', {
                  rules: [{ required: false, message: '请输入联系人!' }],
                  initialValue:contact,
                })(
                  <Input />
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
                  <RadioGroup>
                    <Radio value={1}>正常</Radio>
                    <Radio value={0}>注销</Radio>
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
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
      </div>
    )
  }
}
const CustomerInfo = Form.create()(CustomerInfo1);
export default CustomerInfo;