import React,{Fragment} from 'react';
import { Card, Input,Modal ,Button,Select, Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Table} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';

const { Meta } = Card;
const Option = Select.Option;

class changeNursingGrade extends React.Component {
	state={
		dataSource:[]
	}
    
    notice(status, msg) {
        notification[status]({
            message: `提示`,
            description:msg,
            duration:2,
        })
    }
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
    	const elderly= this.props.elderlyInfo;
    	const {account,id} = this.props.auth;
    	this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	  if(!err){
    	  	let values = {...fieldsValue,optName:account,optId:id,elderlyId:elderly.id};
    	  	httpServer.savechangeNursingGrade(values).then(res=>{
    	  		if(res.code===200){
    	  		   this.notice('success','提交成功');
    	  		}else{
    	  			this.notice('error',res.msg)
    	  		}
    	  		this.props.close();
    	  	})
    	  }
    	})
    }
    componentDidMount(){
    	this.fetchRecord();
    }
    fetchRecord=()=>{
    	const elderly = this.props.elderlyInfo;
    	httpServer.listChangeNursingGrade({elderlyId:elderly.id}).then(res=>{
    		if(res.code===200){
    			this.setState({dataSource:res.data||[]})
    		}else{
    			this.notice('error',res.msg) 
    			this.setState({dataSource:[]})
    		}
    	})
    }
    render() {
    	const { getFieldDecorator } = this.props.form;
        const {elderlyInfo,deptFlag,grades,type} = this.props;
        let filterGrades = grades.filter(o => elderlyInfo.nursingGradeCode!==o.nursingGradeCode);
        const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'5%'
		    },{
			  title: '变更前',
			  dataIndex: 'oldNursingGradeCode',
			  key: 'oldNursingGradeCode',
			  render:(t,r)=>{
			  	 const grade= grades.find(i=>(i.nursingGradeCode===t));
			  	 return grade?grade.nursingGradeName:'未知';
			  }
			}, {
			  title: '变更后',
			  dataIndex: 'newNursingGradeCode',
			  key: 'newNursingGradeCode',
			  render:(t,r)=>{
			  	 const grade= grades.find(i=>(i.nursingGradeCode===t));
			  	 return grade?grade.nursingGradeName:'未知';
			  }
			},{
				title:'状态',
				dataIndex:'flag',
				key:'flag',
				render:(t,r)=>{
				   return t===0?<Tag color="#108ee9">审核中...</Tag>:<Tag color="orange">审核完成</Tag>
				}
			}, {
			  title: '变更时间',
			  dataIndex: 'addtime',
			  key: 'addtime',
			}]
       
        return ( 
        	<Modal
		        title="护理等级变更"
		        okText='提交'
		        width="40%"
		        visible={true}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		      >
                <Card title="基础信息">
				    <Meta
				        avatar={<Avatar src="http://imgsrc.baidu.com/imgad/pic/item/09fa513d269759ee03b7bedab8fb43166d22df38.jpg" />}
				        title={elderlyInfo.name}
				        description={<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?"男":'女'}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{elderlyInfo.age}岁</Tag>&emsp;&emsp;房间:&emsp;&emsp;<Tag color="geekblue">&emsp;{elderlyInfo.roomName}</Tag></span>}
				    />
				</Card>
				<Divider orientation="left">变更记录</Divider>{
					type==="edit"?
				  <Form layout="vertical">
		            <Form.Item label="原护理等级">
		              {getFieldDecorator('oldNursingGradeCode', {
		                rules: [{required:true,  message: '请选择新的护理等级' }],
		                initialValue:elderlyInfo.nursingGradeCode
		              })(
		                 <Select placeholder='护理等级' disabled>
		                    {
		                    	grades.map(item=>(<Option key={item.nursingGradeCode}>{item.nursingGradeName+'_'+item.money+'元/月'}</Option>))
		                    }
                         </Select>
		              )}
		            </Form.Item>
		            <Form.Item label="变更后护理等级">
		              {getFieldDecorator('newNursingGradeCode',{
		              	rules: [{ required: true, message: '请选择新的护理等级' }],
		              })(
		              	<Select placeholder='护理等级'>
		              	   {
		                    	filterGrades.map(item=>(<Option key={item.nursingGradeCode}>{item.nursingGradeName+'_'+item.money+'元/月'}</Option>))
		                    }
                         </Select> 
		              )}
		            </Form.Item>
		             {deptFlag==='2'?
			            <Fragment>
			              	<Form.Item label='护理部确认'>
			                {getFieldDecorator('nursingDept', {
			                  rules: [{ required: true, message: '请输出审核人'}],
			                })(
			                    <Input placeholder="审核人" />
			                )}
			              </Form.Item>
			              <Form.Item label='确认日期'>
			                {getFieldDecorator('optDate', {
			                  rules: [{ required: true, message: '请选择审核时间'}],
			                  initialValue:moment()
			                })(
			                   <DatePicker showTime format="YYYY-MM-DD"/>
			                )}
			              </Form.Item>
			            </Fragment>:null
		              }
		              {deptFlag==='3'?
			            <Fragment>
			                <Form.Item label='院方确认'>
			                {getFieldDecorator('officeDept', {
			                  rules: [{ required: true, message: '请输出审核人'}],
			                })(
			                    <Input placeholder="审核人" />
			                )}
			              </Form.Item>
			                <Form.Item label='确认日期'>
			                {getFieldDecorator('opt2Date', {
			                  rules: [{ required: true, message: '请选择审核时间'}],
			                  initialValue:moment()
			                })(
			                   <DatePicker showTime format="YYYY-MM-DD"/>
			                )}
			              </Form.Item>
			            </Fragment>:null
		              }
		          </Form>:<Table columns={columns} dataSource={this.state.dataSource} />
				}
            </Modal>    
        )
    }
}
export default Form.create()(changeNursingGrade)