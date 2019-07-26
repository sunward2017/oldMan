import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag,Divider, Popconfirm, Button,Form,Input,Radio,Row,Col,Checkbox,message,DatePicker} from 'antd';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';
import PlanItem from './planItem'
import moment from 'moment'

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			visible: false,
			record: '',
			type:'',
			lifeSign:[],
			healthSign:[],
			sendDrug:{}
		}
	}
	
	componentDidMount() {
	   const { healthInfo } = this.props;
	   const {content1,content2,content3}=healthInfo;
	   let lifeSign=[],healthSign=[],sendDrug={};
	   if(content1){
	   	 lifeSign = [...JSON.parse(content1)]
	   }
	   if(content2){
	   	 healthSign = [...JSON.parse(content2)]
	   }
	   
	   if(content3){
	   	 sendDrug = JSON.parse(content3)
	   }
	   this.setState({lifeSign,healthSign,sendDrug});
	}
	add=type=>{
		this.setState({type,visible:true})
	}
	close=()=>{
		this.setState({visible:false})
	}
	changePlan=v=>{
		const {type,lifeSign,healthSign} =this.state;
		if(type=="life"){
			lifeSign.push(v);
			this.setState({visible:false,lifeSign})
		}else{
			healthSign.push(v); 
			this.setState({visible:false,healthSign})
		}
		
	}
	handleDeleteItem=(r)=>{
	   const {lifeSign,healthSign} = this.state; 
	   if(r.type==="life"){
	   	  const index = lifeSign.findIndex(i=>(i.id===r.id));
	   	  lifeSign.splice(index,1);
	   	  this.setState({lifeSign})
	   }else{
	   	  const index = healthSign.findIndex(i=>(i.id===r.id));
	   	  healthSign.splice(index,1);
	   	  this.setState({healthSign})
	   }
	}
	
	saveCasePlan=(e)=>{
		e.preventDefault();
		const {lifeSign,healthSign} = this.state;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
			   let values = {
			   	  ...fieldsValue,
			   	  content1:JSON.stringify(lifeSign),
			   	  content2:JSON.stringify(healthSign),
			   	  content3:JSON.stringify({sendDrug:fieldsValue['sendDrug'],memo:fieldsValue['memo']}),
			   	  optDate:fieldsValue['optDate']?fieldsValue['optDate'].format('YYYY-MM-DD HH:mm:ss'):'',
			   	  optDate2:fieldsValue['optDate2']?fieldsValue['optDate2'].format('YYYY-MM-DD HH:mm:ss'):''
			   }
			   const { id } = this.props.healthInfo;
			   if(id){
			   	  values.id=id;
			   }
			   this.props.saveCasePlan('health',values); 
			}
		});
	}
	
	render() {
		const {visible,lifeSign,healthSign,sendDrug} = this.state;
		const { getFieldDecorator } = this.props.form;
		const {nursingDept,optDate,officeDept,optDate2,familyConfirm} = this.props.healthInfo;
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
		      width:'10%',
		    },{
		      title:'护理周期',
		      dataIndex: 'nursingCycle',
		      key: 'nursingCycle',
		      width:'10%',
		      render:(t,r,i)=>{
		      	return t?t.join('/'):''
		      }
		    },{
		      title:'次数',
		      dataIndex: 'times',
		      key: 'times',
		      width:'10%',
		    },{
		      title:'服务要求',
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
			    <Card title="生命体征" bordered={false} extra={<Button size="small" icon="plus" type="primary" onClick={()=>{this.add('life')}}></Button>}>
			        <Table 
		            rowKey='id' 
		            size="small"
		            pagination={false} 
		            dataSource={lifeSign} 
		            columns={columns} 
		          />
			    </Card>
			    <Card title="指标观察" bordered={false} extra={<Button size="small" icon="plus" type="primary" onClick={()=>{this.add('health')}}></Button>}>
			        <Table 
		            size="small"
		            pagination={false}
		            rowKey='id' 
		            dataSource={healthSign} 
		            columns={columns} 
		          />
			    </Card>
			    <Card title="委托发药" bordered={false}>
			        <Form.Item label="服药护理方式" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}> 
			          {getFieldDecorator('sendDrug', { rules: [{required: false, message: '请选择服药护理方式',}],initialValue:sendDrug.sendDrug||"a"})
			          (
			            <RadioGroup buttonStyle="solid">
				            <Radio.Button value="a">服药自理</Radio.Button>
					        <Radio.Button value="b">监视服药</Radio.Button>
					        <Radio.Button value="c">协助服药</Radio.Button>
					        <Radio.Button value="d">喂药</Radio.Button>
					        <Radio.Button value="e">其他</Radio.Button>
				        </RadioGroup>
				        )}
			       </Form.Item>
			       <Form.Item label="服务要求" labelCol={{ xs: { span: 24 },sm: { span: 4 },md: {span:4}}} wrapperCol={{xs: { span: 24 }, sm: { span: 20 },md: {span:20}}}>
				        {getFieldDecorator('memo', { rules: [{required: false, message: '请输入服务要求',}],initialValue: sendDrug.memo})
				        (
				          <TextArea rows={4} />
				        )}
				     </Form.Item>
			    </Card>
			    <Card bordered={false} title="签名确认">
			    	<Col span={12}>
				        <Form.Item label="护理部主任"  {...formItemLayout}>
				           {getFieldDecorator('nursingDept', { rules: [{required: false, message: '',}],initialValue:nursingDept })
				           (
				            <Input/>
				           )} 
				        </Form.Item>
			        </Col>
			        <Col span={12}>
				        <Form.Item label="完成日期"  {...formItemLayout}>
				           {getFieldDecorator('optDate', { rules: [{required: false, message: '不可为空',}],initialValue:optDate?moment(optDate):moment() })
				           ( <DatePicker />
				           
				           )}
				        </Form.Item>
			        </Col>
			        <Col span={12}>
				        <Form.Item label="评估小组负责人"  {...formItemLayout}>
				           {getFieldDecorator('officeDept', { rules: [{required: false, message: '不可为空'}],initialValue:officeDept })
				           (
				            <Input/>
				           )} 
				        </Form.Item>
				      </Col>
			        <Col span={12}>
		  		        <Form.Item label="日期"  {...formItemLayout}>
		  		          {getFieldDecorator('optDate2', { rules: [{required: false, message: '不可为空'}], initialValue:optDate2?moment(optDate):moment()})
		  		          (
				             <DatePicker />
				            )}
		  		        </Form.Item>
			        </Col>
			        <Col span={12}>
		  		        <Form.Item label="家属签名"  {...formItemLayout}>
		  		         {getFieldDecorator('familyConfirm', { rules: [{required: false, message: '不可为空'}],initialValue:familyConfirm })
		  		         (
				           <Input/>
				           )}
		  		        </Form.Item>
			        </Col>
			        <Col span={6} offset={5}>
			           <Form.Item>
		  		        <Button type="primary" onClick={this.saveCasePlan}>提交保存</Button>
		  		       </Form.Item>
			        </Col>
	           </Card>
			 </Form>
			 {visible?<PlanItem  type={this.state.type} changePlan={this.changePlan} close={this.close}/>:null}
			</Fragment>
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;