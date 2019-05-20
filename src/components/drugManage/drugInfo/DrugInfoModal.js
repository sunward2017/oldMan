import React ,{ Component } from 'react';
import {Modal , Form , Input,Button,DatePicker,Select,Radio,notification,Col,Row,InputNumber} from 'antd';
import httpServer from '../../../axios';
import moment from 'moment';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
class ModalInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataList:props.record,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

 
  handleSubmit(){
    const {action} = this.props;
    const _this = this;
    
    /*&& alias && shortName alias, shortName,*/
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
     	if(!err){
         if(action !=='read'){
		      let id = this.props.record.id;
		      if(id){
		        httpServer.updateDrugInfo({...fieldsValue,id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
		           if (res.code === 200) {
		              const args = {
		                message: '通信成功',
		                description: res.msg,
		                duration: 2,
		              };
		              notification.success(args);
		              _this.props.getDrugList();
		              _this.props.cancleClick();
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
		        httpServer.saveDrugInfo(fieldsValue,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
		           if (res.code === 200) {
		              const args = {
		                message: '通信成功',
		                description: res.msg,
		                duration: 2,
		              };
		              notification.success(args);
		              _this.props.getDrugList();
		              _this.props.cancleClick();
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
		    }else{
		      this.props.cancleClick();
		    }  	 	  
     	}
    }) 
  }
  render(){
    const {unitList,flag} = this.props;
    const {vender, name, alias, shortName, referencePrice, dosageForm, barcode, specification,prescription, insurance, indicationsFunction, usage1, minUnit, store, classOne, approvalNo, status=1, operatedOn, addtime} = this.state.dataList;
    console.log(insurance)
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="药品信息添加"
        okText='提交'
        visible={true}
        onOk={()=>{this.handleSubmit()}}
        onCancel={this.props.cancleClick}
        maskClosable={false}
        width="60%"
      >
        <Form >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='药品名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                { getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入药品名称'}],
                  initialValue:name
                })(
                   <Input placeholder='药品名' disabled={flag}/>  
                )} 
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='条形码'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                { getFieldDecorator('barcode', {
                  rules: [{ required: true, message: '请输入条形码'}],
                  initialValue:barcode
                })(
                   <Input placeholder='药品条形码' disabled={flag}/>  
                )} 
              </Form.Item>
            </Col>
           
            <Col span={12}>  
              <Form.Item
                label='药品简称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                { getFieldDecorator('shortName', {
                  rules: [{ required: false, message: '请选择药品'}],
                  initialValue:shortName
                })(
                   <Input placeholder='药品简称' disabled={flag}/>  
                )} 
              </Form.Item> 
            </Col>
            <Col span={12}>  
              <Form.Item
                label='存储方式'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('store', {
                  rules: [{ required: false, message: '请输入存储方式'}],
                  initialValue:store
                })(
                   <Input placeholder='储存方式' disabled={flag}/>  
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='生产厂家'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >  
                { getFieldDecorator('vender', {
                  rules: [{ required: true, message: '厂家不可为空'}],
                  initialValue:vender
                })(
                    <Input placeholder='请输入厂家' disabled={flag}/>  
                )}               
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='规格'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                { getFieldDecorator('specification', {
                  rules: [{ required: true, message: '请输入药品规格'}],
                  initialValue:specification
                })(
                   <Input placeholder='药品简称' disabled={flag}/>  
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='最小单位'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('minUnit', {
                  rules: [{ required: true, message: '请输入单位'}],
                  initialValue:minUnit
                })(
                  <Input placeholder="单位"/>
                 )} 
              </Form.Item>
            </Col>
            
            <Col span={12}>  
              <Form.Item
                label='价格'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('referencePrice', {
                  rules: [{ required: false, message: '请输入药品规格'}],
                  initialValue:referencePrice
                })(
                   <InputNumber style={{width:'90%'}} placeholder='输入价格' disabled={flag} min={0}/>  
                )}元
              </Form.Item>
            </Col>
             
              <Col span={12}>  
              <Form.Item
                label='是否处方药'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('prescription', {
                  rules: [{ required: true, message: '请输入药品规格'}],
                  initialValue:prescription
                })(
                  <RadioGroup disabled={flag}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='是否医保'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >{ getFieldDecorator('insurance', {
                  rules: [{ required: true, message: '请输入药品规格'}],
                  initialValue:insurance
                })(
                  <RadioGroup disabled={flag}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            
            <Col span={12}>  
              <Form.Item
                label='功能主治'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('indicationsFunction', {
                  rules: [{ required: true, message: '请输入功能'}],
                  initialValue:indicationsFunction
                })(
                  <TextArea rows={3}  disabled={flag}/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='用法用量'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('usage1', {
                  rules: [{ required: true, message: '请输入用法用量'}],
                  initialValue:usage1
                })(
                  <TextArea rows={3} disabled={flag} placeholder="用法用量"/>
                )}
              </Form.Item>
            </Col>  
          </Row>  
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalInfo);