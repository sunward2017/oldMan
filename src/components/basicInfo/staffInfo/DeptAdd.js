import React,{Component,Fragment} from 'react';
import {Form,Input,Card,Button,Table,Divider,Popconfirm,Tag,Modal,Radio,DatePicker,notification,Upload,Icon,message,Avatar,Row,Col} from 'antd';
import moment from 'moment';
import httpServer from '@/axios/index';
import {host} from '@/axios/config'

const RadioGroup = Radio.Group;
class DeptAdd1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalFlag:false,
      record:{},
      action:'',
      disFlag:false,
      loading:false,
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
    httpServer.deleteEmployeeInfo({id}).then((res)=>{
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
        if(!err){
          const values = {
            ...fieldsValue,
            'entryTime': fieldsValue['entryTime'].format('YYYY-MM-DD HH:mm:ss'),
            'brithday': fieldsValue['brithday'].format('YYYY-MM-DD HH:mm:ss'),
            'customerId':customerId,
            'level':1,
            'type':1,
            'faceUrl':record.faceUrl?record.faceUrl:null
          };
          if(fieldsValue['quitTime'])values.quitTime = fieldsValue['quitTime'].format('YYYY-MM-DD HH:mm:ss');
          if(record.id){
            values.id = record.id;
            values.deptId = record.deptId;
            httpServer.updateEmployeeInfo(values).then((res)=>{
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
                      message: '失败',
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
            httpServer.addEmployeeInfo(values).then((res)=>{
                if (res.code === 200) {
                  const args = {
                    message: '成功',
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
  handleChange=(info)=>{
  	const { response } = info.file;
    if(response&&response.data){
    	this.setState(state=>{
    		let  rec = state.record;
    	       state.record= {...rec,faceUrl:response.data};
    		return state;
    	})
    }
  }
  render(){
    const {selectedNode,dataSource} = this.props;
    const {modalFlag,disFlag} = this.state;
    const { getFieldDecorator } = this.props.form;
    const {email,name,sex,brithday,phone,status,jobNumber,entryTime,qq,memo,quitTime,faceUrl} = this.state.record;
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
      width:'5%'
    },{
    	title:'头像',
    	dataIndex:'faceUrl',
    	width:'8%',
    	render:(text,r)=>{
    		return text? <Avatar src={`/upload/${text}`} />:null
    	}
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width:'10%',
    },{
      title:'性别',
      dataIndex: 'sex',
      key: 'sex',
      render:(text,record)=>{
       return record.sex === 1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
      },
      width:'10%'
    },{
      title: '生日',
      dataIndex: 'brithday',
      key: 'brithday',
      width:'10%',
      render:(text,record)=>{
        return text && moment(text).format("YYYY-MM-DD") 
      },
    },{
      title:'入职日期',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render:(text,record)=>{
        return record.entryTime && moment(record.entryTime).format("YYYY-MM-DD") 
      },
      width:'15%'
    },{
      title:'离职日期',
      dataIndex: 'quitTime',
      key: 'quitTime',
      render:(text,record)=>{
        return record.quitTime && moment(record.quitTime).format("YYYY-MM-DD") 
      }
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
      fixed: 'right',
      width: 200,
      align:'center',
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">图片拖入上传</div>
      </div>
    );
    const beforeUpload=(file)=>{
		  const isJPG = file.type === 'image/jpeg';
		  if (!isJPG) {
		    message.error('只能上传图片');
		  }
		  const isLt2M = file.size / 1024 / 1024 < 2;
		  if (!isLt2M) {
		    message.error('图片太大了');
		  }
		  return isJPG && isLt2M;
		}
    return(
      <Fragment>
        <Card
          title={<span>所属部门:&emsp;<span style={{color:"#e43975"}}>{selectedNode.departmentName}</span></span>}
          extra={<Button type="primary" onClick={this.handleAdd} icon="plus" title="新增"></Button>}
          style={{ width: "100%", }}
        >
          <Table 
            size="small"
            scroll={{ x: 1300 }}
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
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
              onOk={this.handleSubmit}
            > 
              <Form>
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
                  label="性别"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别!' }],
                    initialValue:sex,
                  })(
                    <RadioGroup disabled={disFlag} buttonStyle="solid">
                      <Radio.Button value={1}>男</Radio.Button>
                      <Radio.Button value={0}>女</Radio.Button>
                    </RadioGroup>
                  )}
                </Form.Item>
                <Form.Item
                  label="QQ"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('qq', {
                    rules: [{ required: false, message: '不可为空' }],
                    initialValue:qq,
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
                  label="邮箱"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('email', {
                    rules: [{ required:false, message: '请输入登录密码!' }],
                    initialValue:email,
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
                    initialValue:brithday?moment(brithday) : null,
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
                    initialValue:entryTime?moment(entryTime) : null,
                  })(
                    <DatePicker format='YYYY-MM-DD' showTime={true} disabled={disFlag}/>
                  )}
                </Form.Item>
                <Form.Item
                  label='离职时间'
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >
                  {getFieldDecorator('quitTime', {
                    rules: [{ required: false, message: '请选择日期!' }],
                    initialValue:quitTime?moment(quitTime) : null,
                  })(
                    <DatePicker format='YYYY-MM-DD' showTime={true} disabled={disFlag}/>
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
                <Form.Item
                  label="头像上传"
                  {...formItemLayout}
                  style={{marginBottom:'4px'}}
                >  
                  <Row gutter={16}>
                    <Col span={12}>
                     {faceUrl ? <Avatar src={"/upload/"+faceUrl} alt="avatar" size={102}  shape="square"/>:null}
                    </Col>
                    <Col span={12}> 
	                   <Upload
	                      drag
								        name="file"
								        listType="picture-card"
								        className="avatar-uploader"
								        showUploadList={false}
								        action={host.api+'/uploadFile'}
								        beforeUpload={beforeUpload}
								        onChange={this.handleChange}
								      >
	                      {uploadButton}
								      </Upload>
							      </Col>
							    </Row>  
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