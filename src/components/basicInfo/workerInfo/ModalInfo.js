import React,{Component} from 'react';
import {Modal, Form, Input, DatePicker,  Radio, notification, Button} from 'antd';
import httpServer from '../../../axios';
import moment from 'moment';
// import PicturesWall from './UploadImg'

const RadioGroup = Radio.Group;
const { TextArea } = Input;
class ModalInfo1 extends Component{
  constructor(props){
    super(props);
    console.log(props.record);
    this.state = {
      dataList:props.record,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleDeleteUrl = this.handleDeleteUrl.bind(this);
  }

   handleChangeUrl(url){
        const newDataList = this.state.dataList;
        const url1 = {};
        url1.faceUrl = url;
        this.setState({
            dataList:Object.assign(newDataList,url1)
        });
    }
    handleDeleteUrl(){
        const newDataList = this.state.dataList;
        delete newDataList.faceUrl;
         this.setState({
            dataList:newDataList
        });
    }

  handleIptText(target,e) {
    let dataList = Object.assign({},this.state.dataList);
    dataList[target] = e.target ? e.target.value : e;
    this.setState({dataList});
  }

  handleSubmit(e){
    e.preventDefault();
    const {action} = this.props;
    const _this = this;
    const {customerId} = this.props;
    if(action!=='read'){
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        if(!err) {
          const values = {
            ...fieldsValue,
            'workerName':fieldsValue.workerName.replace(/\s/g,""),
            'entryTime': fieldsValue['entryTime'].format('YYYY-MM-DD HH:mm:ss'),
            'customerId':customerId
          };
          if(values.quitTime){values.quitTime=values.quitTime.format('YYYY-MM-DD HH:mm:ss')}
          const { id }= this.state.dataList;
          if(id){
            values.id = id;
            httpServer.updateWorkerInfo(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
               if (res.code === 200) {
                  const args = {
                    message: '通信成功',
                    description: res.msg,
                    duration: 2,
                  };
                  notification.success(args);
                  _this.props.getWorkerList();
                  _this.props.handleCancel();
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
              httpServer.saveWorkerInfo(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
               if (res.code === 200) {
                  const args = {
                    message: '通信成功',
                    description: res.msg,
                    duration: 2,
                  };
                  notification.success(args);
                  _this.props.getWorkerList();
                  _this.props.handleCancel();
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
          })  
        }else{
         this.props.handleCancel(); 
        }
    
    

  }

  /*自定义手机号校验*/
  validatePhoneNumber(rule, value, callback) {
    if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
      callback('手机号码格式不正确');
    } else {
      callback();
    }
  }
  /*自定义姓名校验*/
  validateWorkerName(rule, value, callback){
    const value1 = value && value.replace(/\s/g,'');
    if(value1 &&(value1.length<2 || value1.length>20)) {
      callback('用户名不能包含空格，且长度在2---20个字符之间');
    } else {
      callback();
    }
  }
  render(){
    const {handleCancel,disFlag} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {workerName, sex=1, phone, jobNumber, entryTime, status=1, memo,faceUrl,quitTime} = this.state.dataList;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
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
    return(
      <Modal 
        title="护工信息"
        visible={true}
        onOk={this.handleSubmit}
        onCancel={handleCancel}
        maskClosable = {false}
      >
        {
          /*<PicturesWall changUrl={this.handleChangeUrl} deleteUrl={this.handleDeleteUrl} A01={faceUrl}/>*/
        }
        <Form>
	        <Form.Item
	            label='工号'
	            {...formItemLayout}
	            style={{marginBottom:'4px'}}
	          >
	            {getFieldDecorator('jobNumber', {
	              rules: [{ required: false, message: '请输入工号!' }],
	              initialValue:jobNumber,
	            })(
	              <Input disabled={disFlag}/>
	            )}
          </Form.Item>
          <Form.Item
            label='姓名'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('workerName', {
              rules: [{ required: true, message: '请输入护工姓名!' },{
                 validator:this.validateWorkerName,
              }],
              initialValue:workerName,
            })(
              <Input disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='性别'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('sex', {
              rules: [{ required: true, message: '请选择性别!' }],
              initialValue:sex,
            })(
              <RadioGroup buttonStyle="solid" disabled={disFlag}>
                <Radio.Button value={1}>男</Radio.Button>
                <Radio.Button value={0}>女</Radio.Button>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item
            label='手机号码'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号码!' },{
                validator:this.validatePhoneNumber,
              }],
              initialValue:phone,
            })(
              <Input disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='密码'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('passwd', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='入职日期'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('entryTime', {
              rules: [{ required: false, message: '请选择入职日期!' }],
              initialValue:entryTime?moment(entryTime,'YYYY-MM-DD HH:mm:ss'):null,
            })(
              <DatePicker format='YYYY-MM-DD' showTime  allowClear={false} disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='离职日期'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('quitTime', {
              rules: [{ required: false, message: '请选择日期!' }],
              initialValue:quitTime?moment(entryTime,'YYYY-MM-DD HH:mm:ss'):null,
            })(
              <DatePicker format='YYYY-MM-DD' showTime  allowClear={false} disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='状态'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('status', {
              rules: [{ required: false, message: '请选择状态!' }],
              initialValue:status,
            })(
              <RadioGroup buttonStyle="solid" disabled={disFlag}>
                <Radio.Button value={1}>在职</Radio.Button>
                <Radio.Button value={0}>离职</Radio.Button>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item
            label='备注'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('memo', {
              rules: [{ required: false, message: '请输入备注!' }],
              initialValue:memo,
            })(
              <TextArea disabled={disFlag}/>
            )}
            
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const ModalInfo = Form.create()(ModalInfo1);
export default ModalInfo;