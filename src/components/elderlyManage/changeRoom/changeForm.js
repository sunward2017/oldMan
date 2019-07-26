import React, {
	Fragment
} from 'react';
import { Card, Input, InputNumber, Modal, Button, Row, Col, Form, Avatar, notification, Divider, Icon, Tag, DatePicker, Select,Radio } from 'antd';
import httpServer from '@/axios';
import moment from 'moment';
import BedInfo from '@/common/bedInfo';

 
const Option = Select.Option;
class changeBed extends React.Component {
	constructor(props){
	  super(props);
	  this.state={
	  	loading:false,
	  	bedInfo:{},
	  }
	}
	notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    handleOk=()=>{
        const {loading} = this.state;
        if(!loading) {
			this.setState({
				loading: true
			})
			this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
				if(!err) {
					const {
						elderlyInfo
					} = this.props;
					const {
						bedInfo
					} = fieldsValue;
					let values = {
						...fieldsValue,
						'changeTime': fieldsValue['changeTime'].format('YYYY-MM-DD HH:mm:ss'),
						elderlyId: elderlyInfo.id,
						oldBedCode: elderlyInfo.bedNumber,
						oldRoomCode: elderlyInfo.roomCode,
						newRoomName: bedInfo.roomName,
						newRoomCode: bedInfo.roomUuid,
						newBedCode: bedInfo.bedCode,
					}
					delete values.bedInfo;
					httpServer.savechangeRoom(values).then(res => {
						this.setState({
							loading: false
						})
						if(res.code === 200) {
							this.props.close();
							this.notice('success', res.msg);
						} else {
							this.notice('error', res.msg)
						}
					})
				} else {
					this.setState({
						loading: false
					})
				}
			})
		}
    }
    exportBed =(bedInfo)=>{
	  	this.setState({bedInfo})
	}
	  
	changeBedMoney=(v)=>{
	  	 const {bedInfo} =this.state;
	  	 bedInfo.money=v;
	  	 this.setState({bedInfo},()=>{
	  	 	httpServer.updateBedInfo(bedInfo).then((res)=>{
			if(res.code!==200){
				  Modal.error({
					    title: '床位费变更',
					    content: res.msg,
					  });
				}
			}).catch(err=>{
				   Modal.error({
				    title: 'This is an error message',
				    content: 'some messages...some messages...',
				  });
			})   
	  	 })
	}
	render() {
		const {getFieldDecorator,getFieldValue} = this.props.form;
		const {nurses,elderlyInfo} = this.props;
		const {loading,bedInfo} = this.state;
		return(<Form  className="ant-advanced-search-form mb-m">
				    <Row gutter={24}>
						{
						elderlyInfo.waterKwhStatus===1?null:<Fragment>
					        <Col md={8} sm={12} >
						        <Form.Item
						          label="原房间水表"
						        >
						          {getFieldDecorator('oldWaterMeter', {
						            rules: [{
						              required: true, message: '不可为空',
						            }],
						          })(
						            <InputNumber min={0} style={{width:'100%'}}/>
						          )}
						        </Form.Item>
						    </Col>
						    <Col md={8} sm={12} >
						        <Form.Item
						          label="原房间电表"
						        >
						          {getFieldDecorator('oldKwhMeter', {
						            rules: [{
						              required: true, message: '不可为空',
						            }],
						          })(
						            <InputNumber min={0} style={{width:'100%'}}/>
						          )}
						        </Form.Item>
						    </Col>
						</Fragment>
						}
						<Divider/> 
					    <Col md={11}>
					      <Form.Item
	                        label="水电结算"
	                      >
	                        {
	                        	getFieldDecorator('waterKwhStatus',{
	                        		rules:[{required: true, message: '请选择水电结算方式'}],
	                        		initialValue:elderlyInfo.waterKwhStatus||0
	                        	})(
	                        		<Radio.Group buttonStyle="solid">
							            <Radio.Button value={1}>包月</Radio.Button>
					   			        <Radio.Button value={0}>抄表结算</Radio.Button>
								    </Radio.Group>
	                        	)
	                        }
	                      </Form.Item>
					    </Col>
					    {
					    	getFieldValue('waterKwhStatus')===1?
					    	<Fragment>
							    <Col md={13}>
		                    	  <Form.Item
				                      label="水电包月费"
				                    >
				                      {getFieldDecorator('monthlyPayment', {
				                          rules: [{required: true, message: '不可为空'}],
				                          initialValue:elderlyInfo.monthlyPayment
				                      })(
				                          <InputNumber placeholder="包月水电费" style={{width:'100%'}} min={0} />
				                      )}
				                    </Form.Item>
		                    	</Col>
		                    <Divider/>
		                   </Fragment>:
		                   <Fragment>
		                        <Divider/>
		                    	<Col md={8} sm={8} >
							        <Form.Item
							          label="新房间水表"
							        >
							          {getFieldDecorator('newWaterMeter', {
							            rules: [{
							              required: true, message: '不可为空',
							            }],
							          })(
							            <InputNumber  style={{width:'100%'}} min={0}/>
							          )}
							        </Form.Item>
							    </Col>
							    <Col  md={8} sm={8}>
							        <Form.Item
							          label="新房间电表"			        
							        >
							          {getFieldDecorator('newKwhMeter', {
							            rules: [{
							              required: true, message: '不可为空',
							            }],
							          })(
							            <InputNumber style={{width:'100%'}} min={0}/>
							          )}
							        </Form.Item>
							    </Col>   
							    <Col md={8} sm={8} >
								    <Form.Item label="&emsp;抄 表 人" >
								        {getFieldDecorator('meterReaderPerson', {
								            rules: [{ required: true, message: '不可为空' }],
								        })(
								            <Input />
								        )}
								    </Form.Item>
							    </Col> 
		                    </Fragment>
					    	
					    }
					    <Col md={12} sm={24} >
						    <Form.Item
						          label="新床位"
						          labelCol={{span:6}}
						          wraperCol={{span:15}}
						          
						    >
						        {getFieldDecorator('bedInfo', {
						            rules: [{ required: true, message: '请选择新房间' }],
						        })(  
						            <BedInfo exportBed={this.exportBed}/>
						        )}
						    </Form.Item>
					    </Col>
					    <Col md={10} sm={10}>
						    <Form.Item
						        label="&emsp;新床位费"
						    >
						     <InputNumber 
	                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
	      										parser={value => value.replace(/\$\s?|(,*)/g, '')}
	                        	disabled={!bedInfo.id} 
	                        	style={{width:'90%'}} 
	                        	onChange={this.changeBedMoney} 
	                        	value={bedInfo.money}
	                        	min={0}
	                        	/>   
						    </Form.Item>
				        </Col>
				        <Col md={12} sm={12} >
						    <Form.Item
						        label="&emsp;&emsp;&emsp;护工"
						        style={{marginBottom:0}}
						    >
						        {getFieldDecorator('nursingName', {
						            rules: [{ required: false, message:'请选择护工'}],
						        })(
						            <Select>
						              {
						              	nurses.map(i=>(<Select.Option key={i.id} value={i.workerName}>{i.workerName}</Select.Option>))
						              }
						            </Select>
						        )}
						    </Form.Item>
					    </Col>
					    <Col md={10} sm={10}>
						    <Form.Item
						        label="换房日期"
						        style={{marginBottom:0}}
						    >
						        {getFieldDecorator('changeTime', {
						            rules: [{ required: true, message:'不可为空'}],
						            initialValue:moment()
						        })(
						          <DatePicker />
						        )}
						    </Form.Item>
				        </Col>
			            <Col span={2}>
				            <Form.Item>
						        <Button title="保存" type="primary" icon="save" onClick={this.handleOk} loading={loading}></Button>
						    </Form.Item>
					    </Col>
			    </Row>
		</Form>)
	}
}

class changeProportion extends React.Component{
	constructor(props){
	  super(props);
	  this.state={
	  	loading:false
	  }
	}
	notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
	handleOk=()=>{
		this.setState({loading:true})
    	this.props.form.validateFields((err, fieldsValue) => {
    		if(!err){
    		 let values ={
    		 	...this.props.elderlyInfo,
    		 	...fieldsValue,
    		 }
    		 delete values.tbBedInfo;
      	     httpServer.updateElderlyInfo(values).then((res)=>{
      	     	this.setState({loading:false})
   	  	        if(res.code===200){
   	  	        	this.props.close();
    	  		   this.notice('success',res.msg);
    	  		}else{
    	  			this.notice('error',res.msg)
    	  		}
    	     })
    		}else{
    			this.setState({loading:false})
    		}
    	})

    }
	render() {
		const { getFieldDecorator } = this.props.form;
		const { elderlyInfo } = this.props;
	    const {loading} = this.state;
		return(<Form  className="ant-advanced-search-form"  >
				  <Row gutter={24}>
					  <Col className='mb-m'><h4>&emsp;&emsp;原水电比例:&emsp;水:&emsp;<span className="blue">{elderlyInfo.shareProportionWater+'%'}</span>
						                     &emsp;&emsp; 电:&emsp;<span className="blue">{elderlyInfo.shareProportionPower+'%'}</span></h4></Col>
					  <Col md={11}>
							<Form.Item label="变更后水费比例"   style={{marginBottom:0}}>
						              {getFieldDecorator('shareProportionWater', {
						                rules: [{ required: true, message: '请输入新的水费承当比例' }],
						              })(
						                 <InputNumber
							              min={0}
									      max={100}
									      formatter={value => `${value}%`}
									      parser={value => value.replace('%', '')}
							            />  
						              )}
						    </Form.Item>
					   </Col>
					   <Col md={11}>
							<Form.Item label="变更后电费比例"   style={{marginBottom:0}}>
						              {getFieldDecorator('shareProportionPower',{
						              	rules: [{ required: true, message: '请输入新的电费承当比例' }],
						              })(
						              	 <InputNumber
							              min={0}
									      max={100}
									      formatter={value => `${value}%`}
									      parser={value => value.replace('%', '')}
							            /> 
						              )}
						    </Form.Item>
						</Col>
					    <Col span={2}>
							<Form.Item>
						        <Button title="保存" type="primary" icon="save" onClick={this.handleOk} loading={loading}></Button>
						    </Form.Item>
						</Col>
				</Row>
			</Form>)
	}
}

class changeNursingGrade extends React.Component {
	constructor(props){
	  super(props);
	  this.state={
	  	loading:false
	  }
	}
	notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
	handleOk=()=>{
		 this.setState({loading:true})
    	const elderly= this.props.elderlyInfo;
    	this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	  if(!err){
    	  	let values = {
    	  		...fieldsValue,
    	  		"changeNursingFeeDate":fieldsValue["changeNursingFeeDate"].format("YYYY-MM-DD HH:mm:ss"),
    	  		oldNursingGradeCode:elderly.nursingGradeCode,
    	  		oldNursingFee:elderly.nursingMoney,
    	  		elderlyId:elderly.id
    	  	};
    	  	httpServer.savechangeNursingGrade(values).then(res=>{
    	  		 this.setState({loading:false})
    	  		if(res.code===200){
    	  		   this.props.close();
    	  		   this.notice('success','提交成功');
    	  		}else{
    	  			this.notice('error',res.msg)
    	  		}
    	  	})
    	  }else{
    	  	 this.setState({loading:false})
    	  }
    	})
    }
	nursingGradeName=(code)=>{
    	const  {nursingGrades }= this.props;
    	let grade=nursingGrades.find(i=>i.nursingGradeCode===code);
    	return grade?grade.nursingGradeName:"未知"
    }
	render() {
		const {getFieldDecorator} = this.props.form;
		const {nursingGrades,elderlyInfo} =this.props;
		const {loading} = this.state;
		return(
			          <Form  className="ant-advanced-search-form mb-m"  >
						    <Row gutter={24}>
						    <Col className='mb-m'><h4>&emsp;&emsp;原护理等级:&emsp;<Tag color="geekblue">{this.nursingGradeName(elderlyInfo.nursingGradeCode)}</Tag>
						                     &emsp;&emsp;原护理费用:&emsp;￥<span className="blue">{elderlyInfo.nursingMoney}元</span></h4></Col>
							    <Col md={22}>
						            <Form.Item label="变更后护理等级">
						              {getFieldDecorator('newNursingGradeCode',{
						              	rules: [{ required: true, message: '请选择新的护理等级' }],
						              })(
						              	<Select placeholder='护理等级'>
						              	   {
						                     nursingGrades.map(item=>(<Option key={item.nursingGradeCode} disabled={item.state===0}>{item.nursingGradeName}</Option>))
						                    }
				                         </Select> 
						              )}
						            </Form.Item>
					            </Col>
					            <Col md={10} sm={24}>
						            <Form.Item label="变更后护理费"   style={{marginBottom:0}}>
						              {getFieldDecorator('newNursingFee',{
						              	rules: [{ required: true, message: '请输入护理费' }],
						              })(
						              	 <InputNumber min={0} style={{width:"100%"}}/>
						              )}
						            </Form.Item>
					            </Col>
					            <Col md={12} sm={24}>
						            <Form.Item label="生效日期"   style={{marginBottom:0}}>
						              {getFieldDecorator('changeNursingFeeDate', {
		                                rules: [{required: true, message: '不可为空'}],
		                                initialValue:moment()
						              })(
						              	 <DatePicker format="YYYY-MM-DD" showTime style={{width:'100%'}}/> 
						              )}
						            </Form.Item>
						        </Col>    
					            <Col span={2}>
						           <Form.Item>
						             <Button title="保存" type="primary" icon="save" onClick={this.handleOk} loading={loading}></Button>
						           </Form.Item>
						        </Col>
					        </Row>
				    </Form>
		)
	}
}

export const ChangeBed=Form.create()(changeBed);
export const ChangeProportion=Form.create()(changeProportion);
export const ChangeNursingGrade=Form.create()(changeNursingGrade);
