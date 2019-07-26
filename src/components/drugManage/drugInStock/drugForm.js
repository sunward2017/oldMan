import React ,{ Component } from 'react';
import {Modal ,Form ,InputNumber,DatePicker,Radio ,Input,Button,notification} from 'antd';
import httpServer from '@/axios';
import DrugList from '@/common/drugList'
import moment from 'moment'
 
const RadioGroup = Radio.Group;

class drugForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      drugInfo:{},
    }
  }
  handleDrug=()=>{
  	let that = this;
  	this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
  		if(!err){
  			const {drug} = this.state;
  			let values = {...fieldsValue,...fieldsValue['drugCode']};
  			console.log(values)
  			that.props.handleDrug(values);
  		}
  	})
  }
  cancle=()=>{
  	 this.props.cancel(); 
  }
  
  componentDidMount(){
  	 const drugInfo = this.props.drugInfo;
     this.setState({drugInfo}) 	
  }
 
  render(){
    const {
		  getFieldDecorator
		} = this.props.form;
	const {units} = this.props;
	const {drugCode,quantity,minUbit,validityDate,} = this.state.drugInfo;
	
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
   
    return (
	       	<Modal
		        title="入库单信息"
		        okText='确认'
		        width={400}
		        visible={true}
		        onOk={this.handleDrug}
		        onCancel={this.cancle}
		        maskClosable={false}
		      >
	       	<Form>
	       	  <Form.Item
                label='药品名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                 {getFieldDecorator('drugCode', {
                  rules: [{ required: true, message: '请选择药品'}],
                  initialValue:drugCode
                })(
                   <DrugList/>
                )}
              </Form.Item>
              <Form.Item
                label='数量'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('quantity', {
                  rules: [{ required: true, message: '请输入数量'}],
                  initialValue:quantity
                })(
                    <InputNumber style={{width:'100%'}} placeHolder="请输入入库数量" min={1}/>
                )}
              </Form.Item>
            </Form>
          </Modal>
    )
  }
}

export default Form.create()(drugForm)