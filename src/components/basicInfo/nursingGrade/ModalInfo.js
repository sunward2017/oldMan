import React,{Component} from 'react';
import {Modal, Form, Input, Radio, notification, Button,InputNumber} from 'antd';
import httpServer from '../../../axios';

const RadioGroup = Radio.Group;
class ModalInfo1 extends Component{
  constructor(props){
    super(props);
    console.log(props.record);
    this.state = {
      dataList:props.record,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIptText(target,e) {
    let dataList = Object.assign({},this.state.dataList);
    dataList[target] = e.target ? e.target.value : e;
    this.setState({dataList});
  }

  handleSubmit(){
    const _this = this;
    const {customerId} = this.props;
    const {money ,state,nursingGradeName,days} = _this.state.dataList;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        if(!err) {
          const values = {
            ...fieldsValue,
            'customerId':customerId
          };
          const { id }= this.state.dataList;
          if(id){
            values.id = id;
              httpServer.updateNursingGrade(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
             if (res.code === 200) {
                const args = {
                  message: '通信成功',
                  description: res.msg,
                  duration: 2,
                };
                notification.success(args);
                _this.props.getNursingGradeList();
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
            httpServer.saveNursingGrade(values,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
                if (res.code === 200) {
                  const args = {
                    message: '通信成功',
                    description: res.msg,
                    duration: 2,
                  };
                  notification.success(args);
                  _this.props.getNursingGradeList();
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
      const data = _this.state.dataList;
      data.customerId = customerId;
      if(state !==0){
        data.state = 1;
      }
      if(data.id){
        
        }else{
          
      }
  }

  validateDays(rule, value, callback){
    if(value && !(/^([1-9]\d*|[0]{1,1})$/.test(value))) {
      callback('天数只能是正整数');
    } else {
      callback();
    }
  }
  render(){
    const {handleCancel,disFlag} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {
      nursingGradeName , 
      money , 
      state=1 , 
      days,
      //operaterName,
    } = this.state.dataList;
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
    return(
      <Modal 
        title="护理等级"
        visible={true}
        onOk={this.handleSubmit}
        onCancel={handleCancel}
        maskClosable = {false}//点击遮罩层不允许关闭
         
      >
        <Form>
          <Form.Item
            label='等级名称'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('nursingGradeName', {
              rules: [{ required: true, message: '请输入等级名称!' }],
              initialValue:nursingGradeName,
            })(
              <Input  disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='费用'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('money', {
              rules: [{ required: true, message: '请输入费用!' },],
              initialValue:money,
            })(
              <InputNumber  style={{width:'100%'}} disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='退费最少天数'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('days', {
              rules: [{ required: true, message: '请输入退费最少天数!' },{
                validator:this.validateDays,
              }],
              initialValue:days,
            })(
              <InputNumber style={{width:'100%'}} disabled={disFlag}/>
            )}
          </Form.Item>
          <Form.Item
            label='状态'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '请选择状态!' }],
              initialValue:state,
            })(
              <RadioGroup buttonStyle="solid" disabled={disFlag}>
                <Radio.Button value={1}>启用</Radio.Button>
                <Radio.Button value={0}>禁用</Radio.Button>
              </RadioGroup>
            )}
          </Form.Item>   
        </Form>
      </Modal>
    )
  }
}

const ModalInfo = Form.create()(ModalInfo1);
export default ModalInfo;
/*
 <Form.Item
            label='操作员'
            {...formItemLayout}
            style={{marginBottom:'4px'}}
          >
            <Input placeholder='必填项' value={operaterName} onChange={(e) => this.handleIptText('operaterName',e)} disabled/>
          </Form.Item>
 */