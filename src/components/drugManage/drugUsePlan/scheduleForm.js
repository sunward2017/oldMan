import React,{Fragment,Component} from 'react';
import { Table, Row ,Col,Tag, Divider, Popconfirm,DatePicker, Button, Modal, Form, Input,InputNumber, Radio, Select,notification,Checkbox} from 'antd';
import moment from 'moment';
import httpServer from '@/axios/index';
import DrugTemplate from './drugTemplate';
import DrugList from '@/common/drugList'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
class editForm extends Component {
  constructor(props) {
		super(props);
		this.state = {
			record:{}
	  }
  }
  handleCancel=()=>{
  	  this.props.close()
  }

  handleOk = () => {
     this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
       if(!err){
       	  const {record}= this.state;
       	  const {elderly} = this.props;
       	  const account = JSON.parse(sessionStorage.getItem('auth')).account;
          const templateCode = fieldsValue['templateCode']?fieldsValue['templateCode'].templateCode:'';      	  
       	  
       	  let values={...fieldsValue,templateCode,drugCode:fieldsValue['drugCode'].drugCode,drugName:fieldsValue['drugCode'].drugName,opt:account,elderlyId:elderly.id,confirm:record.confirm?1:0,reminded:record.reminded?1:0,charge:record.charge?1:0};
       	   if(values.type==2){
       	   	 values.point = values.point.join(',')
       	   }
       	  if(record.id){
       	     values.id = record.id;
       	     httpServer.updateDrugScheduled(values).then(res=>{
       	  		  if(res.code===200){
									notification.success({
							            message:'提示',
							            description:res.msg,
							            duration:2
							        })
									  this.props.close()
								}else{
									notification.error({
							            message:'提示',
							            description:res.msg,
							            duration:2
							        })
								}
								 
       	  	 })
       	  }else{
       	  	httpServer.saveDrugScheduled(values).then(res=>{
       	  		  if(res.code===200){
									notification.success({
							            message:'提示',
							            description:res.msg,
							            duration:2
							        })
									  this.props.close()
								}else{
									notification.error({
							            message:'提示',
							            description:res.msg,
							            duration:2
							        })
								}
								 
       	  	})
       	  }
       }
     })

  }
    
  handleChange=(v)=>{
  	 if(v==='add'){
    	this.setState({flag:'add'}) 		
  	 }else{
  	 	  if(this.state.nursingItems.length===0){
  	      this.fetchNursingItems()
  	    }
  	 }
  }
  onChange=(type,v)=>{
    const {record }= this.state;
    const newRecord = {...record,[type]:v.target.checked};
    this.setState({record:newRecord})
  }
  componentDidMount(){
  	const r = this.props.record;
  	let record = {...r};
  	this.setState({record})
  }
  tplChange=(v)=>{
    const {days,point,type} = v; 
    const record = {...this.state.record,days,point,type};
    this.setState({record})
  }
  changeType=(e)=>{
		if(e.target.value===1){
			const record = {...this.state.record,point:0,days:0,type:e.target.value};
			this.setState({record})
		}else{
			const record = {...this.state.record,type:e.target.value}
			this.setState({record})
		}
	}
  render() {
    const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag,
		} = this.state;
		const {
			days,
      quantity,
      minUnit,
      status,
      name,
      nextTime,
      point,
      type,
      drugCode,
      charge,
      confirm,
      reminded,
      templateCode,
		} = this.state.record;
		const plainOptions = ['早饭前', '早饭后', '午饭前','午饭后','晚饭前','晚饭后','临睡前'];
		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 4
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 20
				},
			},
		};

		const tailFormItemLayout = {
			labelCol: {
				xs: {
					span:8
				},
				 
			},
			wrapperCol: {
				xs: {
					span: 16
				},
			 
			},
		};

    return(
        <Modal
          title="用药计划"
          visible={true}
          width="60%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >  
	        <Form>
              <Form.Item
                label='模板名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                 {getFieldDecorator('templateCode', {
                  rules: [{ required: false, message: '请选择药品'}],
                  initialValue:templateCode
                })(
                  <DrugTemplate onChange={this.tplChange} />
                )}
              </Form.Item>
              <Form.Item
                label='药品名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('drugCode', {
                  rules: [{ required: true, message: '请选择药品'}],
                  initialValue:drugCode
                })(
                  <DrugList  elderlyId={this.props.elderlyId}/>
                )}
              </Form.Item>
			        <Row gutter={8}>
			            <Col span={12}>
			            <Form.Item
						          {...tailFormItemLayout}
						          label="一次服用量"
						        >
			               {getFieldDecorator('quantity', {
			                  rules: [{ required: true, message: '请输入服用剂量' }],
			                  initialValue:quantity,
			                })(
			                  <InputNumber style={{width:'90%'}}/>
			                )}
			               </Form.Item>
			            </Col>
			            <Col span={12}>
			              <Form.Item>
			                {getFieldDecorator('minUnit', {
			                  rules: [{ required: true, message: '最小单位不可为空!'}],
			                  initialValue:minUnit
			                })(
			                  <RadioGroup buttonStyle="solid">
			                      <Radio.Button value="毫克">毫克</Radio.Button>
											      <Radio.Button value="毫升">毫升</Radio.Button>
											      <Radio.Button value="片">片</Radio.Button>
											      <Radio.Button value="粒">粒</Radio.Button>
											      <Radio.Button value="粒">克</Radio.Button>
			                  </RadioGroup>
			                )}
			                </Form.Item>
			            </Col>
			          </Row>
              <Form.Item
                label='服药周期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择周期' }],
                  initialValue:type,
                })(
                  <RadioGroup buttonStyle="solid" onChange={this.changeType}>
                      <Radio.Button value={1}>按需</Radio.Button>
								      <Radio.Button value={2}>按日</Radio.Button>
								      <Radio.Button value={3}>按周</Radio.Button>
								      <Radio.Button value={4}>按月</Radio.Button>
                  </RadioGroup>
                )}
              </Form.Item>
               {
              	type&&type!=1&&
              	<Fragment>
              	 <Form.Item
	                label='重复值域'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('days', {
	                  rules: [{ required: true, message: '请输入值域' }],
	                  initialValue:days,
	                })(
	                  <Input placeholder="重复类型是日期任意数字用逗号分割,如1,3(间断不连续的日期)或1-XX（连续的日期）"/>
	                )}
	            </Form.Item>
              	 <Form.Item
	                label='时间点'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('point', {
	                  rules: [{ required: true, message: '请输入时间点' }],
	                  initialValue:point?point.split(','):[],
	                })(
	                   <CheckboxGroup options={plainOptions}/> 
	                )}
	              </Form.Item>
              	</Fragment>
              }
            </Form>  
      </Modal> 
    )
  }
}  

export default  Form.create()(editForm);
