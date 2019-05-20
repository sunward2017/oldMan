import React,{Fragment} from 'react';
import { Card, Input,InputNumber,Modal,Button, Row,Col,Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Select,Table } from 'antd';
import httpServer from '@/axios';
import moment from 'moment';
import BedInfo  from '@/common/bedInfo';
import img from '@/style/imgs/smile.jpg'
 
const { Meta } = Card;
const Option = Select.Option;
class changeRoom extends React.Component {
    state={
       nursingGrades:{},
       nurses:[],
       rooms:[],
    };
     

    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    fetchNursingGrade(){
    	httpServer.listNursingGrade({}).then((res)=>{
        	if(res.data){
        		const data ={}; 
        		res.data.forEach(i=>{
        			data[i.nursingGradeCode]= i.nursingGradeName;
        		})
        	
        		this.setState({nursingGrades:data})
        	} 
        })
    }
    fetchNurse(){
    	httpServer.listWorkerInfo().then((res)=>{
    	   if(res.code===200){
    	   	 const data = res.data?res.data:[];
    	   	 console.log(data);
    	   	 this.setState({nurses:data});
    	   }else{
    	   	 this.setState({nurses:[]})
    	   }
    	})
    }
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
       
    	  if(!err){
    	  	const {elderlyInfo} = this.props;
    	  	const {bedInfo} = fieldsValue;
    	  	let values = {
    	  		...fieldsValue,
    	  		'changeTime':fieldsValue['changeTime'].format('YYYY-MM-DD HH:mm:ss'),
    	  		elderlyId:elderlyInfo.id,
    	  		oldBedCode:elderlyInfo.bedNumber,
    	  		oldRoomCode:elderlyInfo.roomCode,
    	  		newRoomName:bedInfo.roomName,
    	  		newRoomCode:bedInfo.roomUuid,
    	  		newBedCode:bedInfo.bedCode,
    	  	}
    	    delete values.bedInfo;
    	  	httpServer.savechangeRoom(values).then(res=>{
    	  		if(res.code===200){
    	  		   this.notice('success','房间变更');
    	  		}else{
    	  			this.notice('error','房间变更')
    	  		}
    	  		this.props.close();
    	  	})
    	  }
       })
    }
     
    componentDidMount(){
       this.fetchRecord(); 
       this.fetchNursingGrade();
       this.fetchNurse();
    }
    fetchRecord=()=>{
    	const elderly = this.props.elderlyInfo;
    	httpServer.changeRoomList({elderlyId:elderly.id}).then(res=>{
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
        const {elderlyInfo,type} = this.props;
        const {nursingGrades,nurses,rooms,} = this.state;
        
         const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'10%'
		    },{
			  title: '变更前',
			  dataIndex: 'oldRoomCode',
			  key: 'oldRoomCode',
			  render:(t,r)=>{
			  	 return `${r.oldRoomName}室/${r.oldBedCode}床`;
			  }
			}, {
			  title: '变更后',
			  dataIndex: 'newRoomCode',
			  key: 'newRoomCode',
			  render:(t,r)=>{
			     return `${r.newRoomName}室/${r.newBedCode}床`;	
			  }
			}, {
			  title: '变更时间',
			  dataIndex: 'changeTime',
			  key: 'changeTime',
			}]
		return ( 
        	<Modal
		        title="换房处理"
		        okText='提交'
		        width="800px"
		        visible={true}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		      >
                <Card title="基础信息">
				    <Meta
				        avatar={<Avatar src={img}/>}
				        title={elderlyInfo.name}
				        description={
				        	<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?'男':'女'}</Tag>
				        	&emsp;年龄:&emsp;<Tag color="orange">{elderlyInfo.age}岁</Tag>
				        	&emsp;护理等级: <Tag color="geekblue">{nursingGrades[elderlyInfo.nursingGradeCode]||'无'}</Tag>
				        	&emsp;房间号:<Tag color="#2db7f5">{elderlyInfo.roomName}</Tag>
				            &emsp;床号:<Tag color="purple">{elderlyInfo.bedNumber}</Tag>
				            </span>
				        }
				    />
				</Card>
				<Divider orientation="left">变更记录</Divider>{
					type==='edit'?
				<Form  className="ant-advanced-search-form" hideRequiredMark>
				  <Row gutter={24}>
				    <Col span={16} >
				        <Form.Item
				          label="新床号"
				        >
				          {getFieldDecorator('bedInfo', {
				            rules: [{ required: true, message: '请选择床号' }],
				          })(  
				            <BedInfo customerId={elderlyInfo.customerId}/>
				          )}
				        </Form.Item>
			        </Col>
			        <Col span={8} >
				        <Form.Item
				           label="换房日期"
				        >
				          {getFieldDecorator('changeTime', {
				            rules: [{ required: true, message:'请输入换房日期'}],
				            initialValue:moment()
				          })(
				            <DatePicker />
				          )}
				        </Form.Item>
				       </Col>
				   <Col span={8} >
			        <Form.Item
			          label="原房间水表度数"
			        >
			          {getFieldDecorator('oldWaterMeter', {
			            rules: [{
			              required: true, message: '请输入原水表度数',
			            }],
			          })(
			            <InputNumber min={0}/>
			          )}
			        </Form.Item>
			        </Col>
			        <Col span={8} >
			        
			        <Form.Item
			          label="原房间电表度数"
			        >
			          {getFieldDecorator('oldKwhMeter', {
			            rules: [{
			              required: true, message: '请输入原房间电表度数',
			            }],
			          })(
			            <InputNumber min={0}/>
			          )}
			        </Form.Item>
			        </Col>
			        <Col span={8} >
			          <Form.Item
			           label="原电费比例"
			           >			          
			            <InputNumber
			              min={0}
					      max={100}
					      value={elderlyInfo.shareProportionPower}
					      formatter={value => `${value}%`}
					      parser={value => value.replace('%', '')}
					      disabled
			            />
			           </Form.Item>
			        </Col>
			        
			        <Col span={8}>
			        <Form.Item
			          label="新房间水表度数"
			        >
			          {getFieldDecorator('newWaterMeter', {
			            rules: [{
			              required: true, message: '请输入新房间水表度数',
			            }],
			          })(
			            <InputNumber min={0}/>
			          )}
			        </Form.Item>
			        </Col>
			        <Col span={8} >
			        <Form.Item
			          label="新房间电表度数"			        
			        >
			          {getFieldDecorator('newKwhMeter', {
			            rules: [{
			              required: true, message: '请输入新房间电表度数',
			            }],
			          })(
			            <InputNumber min={0}/>
			          )}
			        </Form.Item>
			        </Col>
			        <Col span={8} >
				        <Form.Item
				          label="原水费比例"
				        >			          
				            <InputNumber
				              min={0}
						      max={100}
						      value={elderlyInfo.shareProportionWater}
						      formatter={value => `${value}%`}
						      parser={value => value.replace('%', '')}
						      disabled
				            />
				        </Form.Item>
			        </Col>
			        
			        <Col span={8} >
				        <Form.Item
				           label="护工"
				        >
				          {getFieldDecorator('nursingName', {
				            rules: [{ required: true, message:'请选择护工'}],
				          })(
				             <Select>
				              {
				              	nurses.map(i=>(<Select.Option key={i.id} value={i.workerId}>{i.workerName}</Select.Option>))
				              }
				             </Select>
				          )}
				        </Form.Item>
			        </Col>
			        <Col span={8} >
				        <Form.Item
				          label="抄表人"
				        >
				          {getFieldDecorator('meterReaderPerson', {
				            rules: [{ required: true, message: '请输入抄表人' }],
				          })(
				            <Input />
				          )}
				        </Form.Item>
			        </Col>
			        </Row>
			      </Form>:<Table columns={columns} dataSource={this.state.dataSource} /> 
			      }
			      <style>{`
			        .ant-advanced-search-form {
					  padding: 24px;
					  background: #fbfbfb;
					  border: 1px solid #d9d9d9;
					  border-radius: 6px;
					}
					
					.ant-advanced-search-form .ant-form-item {
					  display: flex;
					}
					
					.ant-advanced-search-form .ant-form-item-control-wrapper {
					  flex: 1;
					}	
			      `}</style>
            </Modal>    
        )
    }
}
export default Form.create()(changeRoom)