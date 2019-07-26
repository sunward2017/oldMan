import React, {
	Component,
	Fragment
} from 'react';
import {Card,Divider, Popconfirm, Button,Form,Input,Radio,Row,Col,DatePicker} from 'antd';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';
import PlanItem from './planItem';
import moment from 'moment'

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			evaluateInfo:{},
			demand:{},
			plan:{},
		}
	}
	
	componentDidMount() {
		const {a1,a2,a3}= this.props.planByDays;
		let evaluateInfo={},demand={},plan={};
		if(a1){
		    evaluateInfo = JSON.parse(a1);
		}
		if(a2){
			demand = JSON.parse(a2)
		}
		if(a3){
			plan = JSON.parse(a3)
		}
		this.setState({evaluateInfo,demand,plan});
	}
	 
	handleSubmit=(e)=>{//审核
	  	e.preventDefault();
	    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
	    	if(!err){
	    		 const values = {
	    		 	              a1:JSON.stringify({
	    		 	              	a1:fieldsValue['a1'],
	    		 	              	a2:fieldsValue['a2'],
	    		 	              	a3:fieldsValue['a3'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              	a4:fieldsValue['a4'],
	    		 	              	a5:fieldsValue['a5'],
	    		 	              	a6:fieldsValue['a6'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              	a7:fieldsValue['a7'],
	    		 	              	a8:fieldsValue['a8'],
	    		 	              	a9:fieldsValue['a9'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              	a10:fieldsValue['a10'],
	    		 	              	a11:fieldsValue['a11'],
	    		 	              	a12:fieldsValue['a12'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              	a13:fieldsValue['a13'],
	    		 	              	a14:fieldsValue['a14'],
	    		 	              	a15:fieldsValue['a15'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              	 
	    		 	              }),
	    		 	              a2:JSON.stringify({
	    		 	              	b:fieldsValue['b'],
	    		 	              	b1:fieldsValue['b1'],
	    		 	              	b2:fieldsValue['b2'].format('YYYY-MM-DD HH:mm:ss'),
	    		 	              }),
	    		 	              a3:JSON.stringify({
	    		 	              	c:fieldsValue['c'],
	    		 	              	c1:fieldsValue['c1'],
	    		 	              	c2:fieldsValue['c2'],
	    		 	              }),
	    		 	              officeDept:fieldsValue['officeDept'],
	    		 	              nursingDept:fieldsValue['nursingDept'],
	    		 	              optDate:fieldsValue['optDate']?fieldsValue['optDate'].format('YYYY-MM-DD HH:mm:ss'):'',
	    		 	              optDate2:fieldsValue['optDate2']?fieldsValue['optDate2'].format('YYYY-MM-DD HH:mm:ss'):'',
	    		                };
	    		  const {id} = this.props.planByDays;
	    		  if(id)values.id = id;
	    		  this.props.saveCasePlan('plan',values)             
	    	}
	    }) 
	} 
		
	render() {
		const {evaluateInfo,demand,plan} = this.state;
		const {a,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15}=evaluateInfo?evaluateInfo:{}; 
		const {b,b1,b2 } = demand?demand:{};
		const {c,c1,c2 } = plan?plan:{};
	    const {nursingDept,officeDept,optDate,optDate2} = this.props.planByDays;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
		      labelCol: {
		        xs: { span: 24 },
		        sm: { span: 4 },
		        md: {span:8}
		
		      },
		      wrapperCol: {
		        xs: { span: 24 },
		        sm: { span: 20 },
		        md: {span:16}
		      },
		    }; 
	    
		    return(
			<Fragment>
			 <Form hideRequiredMark>
			    <Card title="综合评估"  extra={<Button size="small" icon="plus" type="primary" onClick={()=>{this.add('life')}}></Button>}>
			       <Row gutter={16}>
			          <Col span={16}>
			            <Form.Item label="自我照料能力" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a1', { rules: [{required: false, message: '请输入自我照料能力',}],initialValue:a1 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="评估人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('a2', { rules: [{required: false, message: '评估人不可为空',}],initialValue:a2 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a3', { rules: [{required: false, message: '日期不可为空',}],initialValue:a3?moment(a3):moment() })
					        (
					          <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			           <Col span={16}>
			            <Form.Item label="定向识别能力" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a4', { rules: [{required: false, message: '不可为空',}],initialValue:a4 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="评估人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('a5', { rules: [{required: false, message: '不可为空',}],initialValue:a5 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a6', { rules: [{required: false, message: '不可为空',}],initialValue:a6?moment(a6):moment()})
					        (
					            <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			           <Col span={16}>
			            <Form.Item label="抑郁/焦虑心境" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a7', { rules: [{required: false, message: '不可为空',}],initialValue:a7 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="评估人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('a8', { rules: [{required: false, message: '不可为空',}],initialValue:a8 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a9', { rules: [{required: false, message: '不可为空',}],initialValue:a9?moment(a9):moment() })
					        (
					            <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			           <Col span={16}>
			            <Form.Item label="激惹行为" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a10', { rules: [{required: false, message: '不可为空',}],initialValue:a10 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="评估人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('a11', { rules: [{required: false, message: '请输入评估人',}],initialValue:a11 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a12', { rules: [{required: false, message: '不可为空',}],initialValue:a12?moment(a12):moment() })
					        (
					           <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			           <Col span={16}>
			            <Form.Item label="退缩行为" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a13', { rules: [{required: false, message: '不可为空',}],initialValue:a13 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="评估人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('a14', { rules: [{required: false, message: '请输入评估人',}],initialValue:a14 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={4}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a15', { rules: [{required: false, message: '请输入老人姓名',}],initialValue:a15?moment(a15):moment()})
					        (
					          <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			       </Row>
			    </Card>
			    <Card title="老人特殊需求"  >
			        <Form.Item label="" >
					        {getFieldDecorator('b', { rules: [{required: false, message: '请输入老人需求',}],initialValue:b })
					        (
					          <TextArea rows={4} />
					        )}
					</Form.Item>
			        <Row gutter={16}>  
			          <Col span={8} offset={8}>
			            <Form.Item label="记录人" labelCol={{ xs: { span: 24 },sm: { span: 6 },md: {span:6}}} wrapperCol={{xs: { span: 24 }, sm: { span: 18 },md: {span:18}}}>
					        {getFieldDecorator('b1', { rules: [{required: false, message: '请输入记录人',}],initialValue:b1 })
					        (
					          <Input/>
					        )}
					    </Form.Item>
			          </Col>
			          <Col span={8}>
			            <Form.Item label="日期" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('b2', { rules: [{required: false, message: '请输入日期',}],initialValue:b2?moment(b2):moment()})
					        (
					           <DatePicker/>  
					        )}
					    </Form.Item>
			          </Col>
			        </Row>  
			    </Card>
			    <Card title="初步个案护理计划"  >
			        <Form.Item label="日常生活护理计划" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
			          {getFieldDecorator('c', { rules: [{required: false, message: '请输入日常生活护理计划',}],initialValue:c })
			          (
			            <TextArea rows={2} />
				        )}
			       </Form.Item>
			       <Form.Item label="认知能力护理计划" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
				        {getFieldDecorator('c1', { rules: [{required: false, message: '请输入认知能力护理计划',}],initialValue:c1 })
				        (
				          <TextArea rows={2} />
				        )}
				    </Form.Item>
				    <Form.Item label="健康服务计划" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
				        {getFieldDecorator('c2', { rules: [{required: false, message: '请输入健康服务计划',}],initialValue:c2})
				        (
				          <TextArea rows={2} />
				        )}
				    </Form.Item>
			    </Card>
			    <Card  title="确认签名">
			    	<Col span={6}>
				        <Form.Item label="护理部主任"  {...formItemLayout}>
				           {getFieldDecorator('nursingDept', { rules: [{required: false, message: '请输入老人姓名',}],initialValue:nursingDept })
				           (
				            <Input/>
				           )} 
				        </Form.Item>
			        </Col>
			        <Col span={6}>
				        <Form.Item label="完成日期"  {...formItemLayout}>
				           {getFieldDecorator('optDate', { rules: [{required: false, message: '请输入老人姓名',}],initialValue:optDate?moment(optDate):moment()})
				           (
				             <DatePicker/>  
				           )}
				        </Form.Item>
			        </Col>
			        <Col span={6}>
				        <Form.Item label="评估小组负责人"  {...formItemLayout}>
				           {getFieldDecorator('officeDept', { rules: [{required: false, message: '请输入老人姓名',}],initialValue:officeDept })
				           (
				            <Input/>
				           )} 
				        </Form.Item>
				      </Col>
			        <Col span={6}>
		  		        <Form.Item label="日期"  {...formItemLayout}>
		  		          {getFieldDecorator('optDate2', { rules: [{required: false, message: '请输入日期',}],initialValue:optDate2?moment(optDate2):moment()})
		  		          (
				            <DatePicker/>  
				          )}
		  		        </Form.Item>
			        </Col>
			        <Col span={6} offset={18}>
			           <Form.Item>
			               <Button type="primary" onClick={this.handleSubmit}>提交</Button>
			           </Form.Item>
			        </Col>
	           </Card>
			 </Form>
	    </Fragment>)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;