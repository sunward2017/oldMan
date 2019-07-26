import React,{Fragment} from 'react';
import { Card, Input,InputNumber,Modal,Button, Row,Col,Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Select} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';
import BedInfo  from '@/common/bedInfo';
import img from '@/style/imgs/smile.jpg';
import {ChangeBed,ChangeProportion,ChangeNursingGrade} from './changeForm';

 
const { Meta } = Card;
const Option = Select.Option;
class changeRoom extends React.Component {
    state={
       nursingGrades:[],
       nurses:[],
       rooms:[],
       visible:false,
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
        	if(res.code===200){
        		this.setState({nursingGrades:res.data||[]})
        	}else{
        		this.notice('error','护理等级获取失败')
        	}
        })
    }
    fetchNurse(){
    	httpServer.listWorkerInfo().then((res)=>{
    	   if(res.code===200){
    	   	 const data = res.data?res.data:[];
    	   	 this.setState({nurses:data});
    	   }else{
    	   	 this.setState({nurses:[]})
    	   }
    	})
    }
    cancel=()=>{
        this.setState({visible:false})
    }  
    
    nursingGradeName=(code)=>{
    	const  {nursingGrades }= this.state;
    	let grade=nursingGrades.find(i=>i.nursingGradeCode===code);
    	return grade?grade.nursingGradeName:"未知"
    }
    change=()=>{
    	this.setState({visible:true},function(){
    		this.fetchNursingGrade();
            this.fetchNurse();
    	})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {elderlyInfo} = this.props;
        const {nursingGrades,nurses,rooms,visible} = this.state;       
		return ( 
			<Fragment>
			<Button type="primary" size="small" icon="transaction" title="变更申请" onClick={this.change}></Button>
        	<Modal
		        title="变更处理"
		        okText='提交'
		        width="1000px"
		        visible={visible}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		        footer={null}
		      >
        	   <Row gutter={16}>
        	      <Col span={6}>
        	        <Card title="基础信息">
					    <Meta
					        title={<span><Avatar src={img}/>&emsp;&emsp;{elderlyInfo.name}</span>}
					        description={
					          <div>
					        	<div className="mb-m">&emsp;&emsp;性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?'男':'女'}</Tag></div>
					        	<div className="mb-m">&emsp;&emsp;年龄:&emsp;<Tag color="#87d068">{elderlyInfo.age}岁</Tag></div>
					        	<div className="mb-m">护理等级:&emsp;<Tag color="geekblue">{this.nursingGradeName(elderlyInfo.nursingGradeCode)}</Tag></div>
					        	<div className="mb-m">&emsp;房间号:&emsp;<Tag color="#2db7f5">{elderlyInfo.roomName}</Tag></div>
					            <div className="mb-m">&emsp;&emsp;床号:&emsp;<Tag color="purple">{elderlyInfo.bedNumber}</Tag></div>
					          </div>
					        }
					     />
				    </Card>
        	      </Col>
        	      <Col span={18}>
					<ChangeBed nurses={nurses} elderlyInfo={elderlyInfo} close={this.cancel} key={visible+'b'}/>
					<ChangeNursingGrade  key={visible+'n'} nursingGrades={nursingGrades} elderlyInfo={elderlyInfo} close={this.cancel}/> 
					<ChangeProportion  key={visible+'p'} elderlyInfo={elderlyInfo} close={this.cancel}/>
        	      </Col>
        	   </Row>
            </Modal> 
        </Fragment>    
        )
    }
}
export default Form.create()(changeRoom)