import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag,Divider,Button,Form,Input,Radio,Row,Col,message} from 'antd';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';
import {NursingItem} from './planItem'

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			records:[],
		}
	}
	
	componentDidMount() {
		const {a15} = this.props.record;
		if(a15){
			this.setState({records:[...JSON.parse(a15)]});
		}else{
			this.setState({records:[]})
		}
	}
	add=type=>{
		this.setState({visible:true})
	}
	close=()=>{
		this.setState({visible:false})
	}
	changePlan=v=>{
		 const { records } = this.state;
		 records.push(v);
		 this.setState({records,visible:false})
	}
	handleDeleteItem=(r)=>{
		const {records} = this.state;
	   	const index = records.findIndex(i=>(i.id===r.id));
	   	records.splice(index,1);
	   	this.setState({records})
	}
	
	handleSubmit=(e)=>{
		e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        	if(!err){
        		const { records } = this.state;
        		if(records.length===0){
        			message.error('护理措施不可为空')
        		}else{
        		    let values ={...fieldsValue,a15:JSON.stringify(records)};
        		    const {id} = this.props.record;
        		    if(id) values.id =id;
        		    this.props.saveCasePlan('record',values)
        		}
        	}
        })
	}
	
	render() {
		const {visible,records} = this.state;
		const { getFieldDecorator } = this.props.form;
		const {a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14} = this.props.record
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
	    const columns =[{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'index',
		      width:'5%'
		    },{
		      title:'护理项目',
		      dataIndex: 'nursingItem',
		      key: 'nursingItem',
		      width:'20%',
		    },{
		      title:'护理详情',
		      dataIndex: 'nursingStandard',
		      key: 'nursingStandard',
		    },{
		      title: '操作',
		      dataIndex: 'action',
		      key: 'action',
		      width:'10%',
		      render:(text,record)=>{
		        return <Button size="small" type="primary" onClick={()=>this.handleDeleteItem(record)}>删除</Button>
		      }
		    }];
		    return(
			<Fragment>
			 <Form hideRequiredMark>
			    <Row gutter={16}>
			        <Col span={12}>
					    <Form.Item label="现病史" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a1', { rules: [{required: true, message: '请输入现病史',}],initialValue:a1 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="以往病史" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a2', { rules: [{required: true, message: '请输入以往病史',}],initialValue:a2 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="思维能力" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a3', { rules: [{required: true, message: '请输入老人思维能力',}],initialValue:a3 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="行动能力" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a4', { rules: [{required: true, message: '请输入老人行动能力',}],initialValue:a4 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="表达能力" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a5', { rules: [{required: true, message: '请输入老人表达能力',}],initialValue:a5 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={6}>
					    <Form.Item label="视力" labelCol={{ xs: { span: 24 },sm: { span: 8 },md: {span:8}}} wrapperCol={{xs: { span: 24 }, sm: { span: 16 },md: {span:16}}}> 
					          {getFieldDecorator('a6', { rules: [{required: true, message: '请输入视力',}],initialValue:a6 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={6}>
					    <Form.Item label="听力" labelCol={{ xs: { span: 24 },sm: { span: 8 },md: {span:8}}} wrapperCol={{xs: { span: 24 }, sm: { span: 16 },md: {span:16}}}> 
					          {getFieldDecorator('a7', { rules: [{required: true, message: '请输入听力',}],initialValue:a7 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={24}>
					    <Form.Item label="护理需求" labelCol={{ xs: { span: 24 },sm: { span: 2 },md: {span:2}}} wrapperCol={{xs: { span: 24 }, sm: { span: 22 },md: {span:22}}}> 
					          {getFieldDecorator('a8', { rules: [{required: true, message: '请输入护理需求',}],initialValue:a8 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="饮食情况" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a9', { rules: [{required: true, message: '请输入老人饮食情况',}],initialValue:a9 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="睡眠情况" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a10', { rules: [{required: true, message: '请输入老人睡眠情况',}],initialValue:a10 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={12}>
					    <Form.Item label="大小便情况" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a11', { rules: [{required: true, message: '请输入老人大小便情况',}],initialValue:a11 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col><Col span={12}>
					    <Form.Item label="其他" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
					          {getFieldDecorator('a12', { rules: [{required: false, message: '请输入老人姓名',}],initialValue:a12 })
					          (
					            <Input/>
						       )}
					    </Form.Item>
				    </Col>
				    <Col span={18}>
				       <Form.Item label="家属要求" labelCol={{ xs: { span: 24 },sm: { span: 2 },md: {span:2}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
					        {getFieldDecorator('a13', { rules: [{required: false, message: '请输入家属要求',}],initialValue:a13 })
					        (
					           <Input />
					        )}
					    </Form.Item>
				    </Col>
				    <Col span={6}>
				        <Form.Item label="家属签名" labelCol={{ xs: { span: 24 },sm: { span: 8 },md: {span:8}}} wrapperCol={{xs: { span: 24 }, sm: { span:16},md: {span:16}}}>
					        {getFieldDecorator('a14', { rules: [{required: true, message: '请输入家属姓名',}],initialValue:a14 })
					        (
					          <Input />
					        )}
					    </Form.Item>
				    </Col>
			    </Row>
			     
			 </Form>
			 
		    <Card title="护理措施" bordered={false} extra={<Button size="small" icon="plus" type="primary" onClick={()=>{this.add('health')}}></Button>}>
			    <Row>
			        <Col span={22} offset={2}>
				        <Table 
			            size="small"
			            pagination={false}
			            rowKey='id' 
			            dataSource={records} 
			            columns={columns} 
			          />
			        </Col>
			    </Row> 
			    <Button style={{float:'right',marginTop:10}} type="primary" onClick={this.handleSubmit}>提交保存</Button>
			</Card> 
			
			{visible?<NursingItem  type={this.state.type} changePlan={this.changePlan} close={this.close}/>:null}
			</Fragment>
		)
	}
}
const NurseRecord = Form.create()(CMT);
export default NurseRecord;