import React,{Fragment} from 'react';
import { Input,Modal,Button, Form, notification, Divider,Select,InputNumber} from 'antd';
 
const { TextArea } = Input;
const { Option } = Select;

class planItem extends React.Component {
	state={
		items:[]
	}
	componentDidMount(){
		const {type}=this.props;
		if(type==="life"){
			this.setState({items:['测量血压','测量脉搏/心跳','测量体温','观察呼吸及缺氧情况','其他']})
		}else{
			this.setState({items:['检测尿糖','检测血糖','测量体雷','其他']})
		}
	}
    
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
    	this.props.form.validateFields((err, fieldsValue) => {
    		if(!err){
    			const {type}=this.props;
    		    this.props.changePlan({...fieldsValue,type,id:Math.random().toString(36).substr(3)})
    		}
    	})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {items } = this.state;
        const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 6 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 16 },
	      },
	    };
        return ( 
        	<Modal
		        title="护理项"
		        okText='提交'
		        width="40%"
		        visible={true}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		      >
				 <Form hideRequiredMark>
		            <Form.Item label="护理项目" {...formItemLayout}>
		              {getFieldDecorator('nursingItem', {
		                rules: [{ required: true, message: '选择护理项目' }],
		              })(
		                <Select>
				           {items.map((m,i)=>(<Option key={i+'h'} value={m}>{m}</Option>))} 
				        </Select>  
		              )}
		            </Form.Item>
		            <Form.Item label="护理周期" {...formItemLayout}>
		              {getFieldDecorator('nursingCycle',{
		              	rules: [{ required: false, message: '选择护理周期' }],
		              })(
		                <Select mode="multiple">
				          <Option value="每日">每日</Option>
				          <Option value="每周">每周</Option>
				          <Option value="每月">每月</Option>
				          <Option value="需要时">有需要时</Option>
				        </Select> 
		              )}
		            </Form.Item>
		            <Form.Item label="护理次数" {...formItemLayout}>
		              {getFieldDecorator('times',{
		              	rules: [{ required: false, message: '护理次数' }],
		              })(
		              	<InputNumber min={1} style={{width:'100%'}}/>  
		              )}
		            </Form.Item>
		            <Form.Item label="服务要求" {...formItemLayout}>
		              {getFieldDecorator('nursingStandard',{
		              	rules: [{ required: false, message: '服务要求' }],
		              })(
		              	<TextArea rows={4} />
		              )}
		            </Form.Item>
		          </Form> 
            </Modal>    
        )
    }
}
export default Form.create()(planItem)

class nursingItem extends React.Component {
	 
	componentDidMount(){
		 
	}
    
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
    	this.props.form.validateFields((err, fieldsValue) => {
    		if(!err){
    			const {type}=this.props;
    		    this.props.changePlan({...fieldsValue,type,id:Math.random().toString(36).substr(3)})
    		}
    	})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 6 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 16 },
	      },
	    };
        return ( 
        	<Modal
		        title="护理项"
		        okText='提交'
		        width="40%"
		        visible={true}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		      >
				 <Form hideRequiredMark>
		            <Form.Item label="护理项目" {...formItemLayout}>
		              {getFieldDecorator('nursingItem', {
		                rules: [{ required: true, message: '选择护理项目' }],
		              })(
		                <Input/> 
		              )}
		            </Form.Item>
		            <Form.Item label="详情" {...formItemLayout}>
		              {getFieldDecorator('nursingStandard',{
		              	rules: [{ required: false, message: '服务要求' }],
		              })(
		              	<TextArea rows={4} />
		              )}
		            </Form.Item>
		          </Form> 
            </Modal>    
        )
    }
}
export  const NursingItem = Form.create()(nursingItem);
 
