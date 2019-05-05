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
    console.log(props.record);
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
		      const data = fieldsValue;
		      if(data.id){
		        httpServer.updateDrugInfo(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
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
		        httpServer.saveDrugInfo(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
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
    const {vender, name, alias, shortName, referencePrice, dosageForm, barcode, specification,prescription=1, insurance=1, indicationsFunction, usage1, minUnit, store, classOne, approvalNo, status=1, operatedOn, addtime} = this.state.dataList;
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
        onOk={()=>{this.handleOk()}}
        onCancel={this.props.cancleClick}
        maskClosable={false}
        footer={null}
        width="80%"
      >
        <Form  onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='厂家名称'
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
                label='药品名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                { getFieldDecorator('name', {
                  rules: [{ required: true, message: '请选择药品'}],
                  initialValue:name
                })(
                   <Input placeholder='药品名' disabled={flag}/>  
                )} 
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='药品别名'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                { getFieldDecorator('alias', {
                  rules: [{ required: false, message: '请选择药品'}],
                  initialValue:alias
                })(
                   <Input placeholder='药品别名' disabled={flag}/>  
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
                label='剂型'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                { getFieldDecorator('dosageForm', {
                  rules: [{ required: false, message: '请选择药品'}],
                  initialValue:dosageForm
                })(
                   <Input placeholder='药品简称' disabled={flag}/>  
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
                label='单位'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('minUnit', {
                  rules: [{ required: true, message: '请输入单位'}],
                  initialValue:minUnit
                })(
                 <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="选择药品单位"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  
                  disabled={flag}
                >
                  {
                    unitList&&unitList.map((item,index)=>{
                      return  <Option key={item.value}>{item.value}</Option>
                    })
                  }
                 
                </Select>
                 )} 
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='存储方式'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('store', {
                  rules: [{ required: true, message: '请输入药品规格'}],
                  initialValue:store
                })(
                   <Input placeholder='药品简称' disabled={flag}/>  
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
                   <InputNumber placeholder='药品简称' disabled={flag} min={0}/>  
                )}元
              </Form.Item>
            </Col>
             <Col span={12}>   
              <Form.Item
                label='准字号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('approvalNo', {
                  rules: [{ required: false, message: '请输入准字号'}],
                  initialValue:approvalNo
                })(
                   <Input placeholder='批次准字号' disabled={flag}/>  
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='药品功效'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('indicationsFunction', {
                  rules: [{ required: false, message: '请输入药品规格'}],
                  initialValue:indicationsFunction
                })(
                  <TextArea rows={4}  disabled={flag}/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item
                label='服用方法'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('usage1', {
                  rules: [{ required: true, message: '请输入服用方法'}],
                  initialValue:usage1
                })(
                  <TextArea rows={4} disabled={flag} placeholder="服用方法"/>
                )}
              </Form.Item>
            </Col>
           
            <Col span={12}>  
              <Form.Item
                label='是否为处方药'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > { getFieldDecorator('prescription', {
                  rules: [{ required: false, message: '请输入药品规格'}],
                  initialValue:prescription||1
                })(
                  <RadioGroup disabled={flag}>
                    <Radio value={1}>处方药</Radio>
                    <Radio value={0}>非处方药</Radio>
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
                  rules: [{ required: false, message: '请输入药品规格'}],
                  initialValue:insurance||1
                })(
                  <RadioGroup disabled={flag}>
                    <Radio value={1}>医保用药</Radio>
                    <Radio value={0}>非医保用药</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='状态'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >{ getFieldDecorator('status', {
                  rules: [{ required: true, message: '请输入药品规格'}],
                  initialValue:status||1
                })(
                  <RadioGroup  disabled={flag}>
                    <Radio value={1}>正常</Radio>
                    <Radio value={0}>注销</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>  
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">确认提交</Button>
              </Form.Item>
            </Col>
          </Row>  
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalInfo);