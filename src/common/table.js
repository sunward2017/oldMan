import React,{Fragment,component} from 'react';
import { Card,Modal,Button, Avatar, notification, Divider,Icon,Tag,Table} from 'antd';
import httpServer from '@/axios';
import img from '@/style/imgs/smile.jpg';

 
const { Meta } = Card;
export class HistoryChangeRoom extends React.Component {
	state={
		dataSource:[],
		visible:false,
	}
    
    notice(status, msg) {
        notification[status]({
            message: `提示`,
            description:msg,
            duration:2,
        })
    }
    cancel=()=>{
    	this.setState({visible:false}) 
    }
    componentDidMount(){
    	 
    }
    handleFetch=()=>{
       this.fetchRecord()
       
    }
   
    fetchRecord=()=>{
    	const elderly = this.props.elderlyInfo;
    	httpServer.changeRoomList({elderlyId:elderly.id}).then(res=>{
    		if(res.code===200){
    			this.setState({dataSource:res.data||[],visible:true})
    		}else{
    			this.notice('error',res.msg) 
    			this.setState({dataSource:[]})
    		}
    	})
    }
    render() {
        const {elderlyInfo,grades} = this.props;
        const {visible} = this.state;
        const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'15%'
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
			  title: '变更日期',
			  dataIndex: 'changeTime',
			  key: 'changeTime',
			  render:(t,r)=>{
			  	return t?t.substr(0,10):'';
			  }
			}]
       
        return ( 
        	<Fragment>
        	    <Button title="换房历史" icon="bank" size="small" type="primary" onClick={() => { this.handleFetch()}}></Button>
	        	<Modal
			        title="历史换房"
			        okText='提交'
			        width="600px"
			        visible={visible}
			        onCancel={this.cancel}
			        maskClosable={false}
			        footer={null}
			      >
	                <Card title="基础信息">
					    <Meta
					        avatar={<Avatar src={img}/>}
					        title={elderlyInfo.name}
					        description={<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?"男":'女'}</Tag>&emsp;年龄:&emsp;<Tag color="#87d068">{elderlyInfo.age}岁</Tag>&emsp;&emsp;房间:&emsp;&emsp;<Tag color="#108ee9">&emsp;{elderlyInfo.roomName}</Tag></span>}
					    />
					</Card>
					<Divider orientation="left">变更记录</Divider> 
					 <Table size="small" columns={columns} dataSource={this.state.dataSource} rowKey="id" />
	            </Modal> 
	        </Fragment>    
        )
    }
}


export class HistoryChangeNursingGrade extends React.Component {
	state={
		dataSource:[],
		visible:false,
		 grades:[],
	}
    
    notice(status, msg) {
        notification[status]({
            message: `提示`,
            description:msg,
            duration:2,
        })
    }
    cancel=()=>{
    	this.setState({visible:false}) 
    }
    componentDidMount(){
    	 
    }
    handleFetch=()=>{
       this.fetchRecord();
      
    }
     
    fetchRecord=()=>{
    	const elderly = this.props.elderlyInfo;
    	httpServer.listChangeNursingGrade({elderlyId:elderly.id}).then(res=>{
    		if(res.code===200){
    			this.setState({dataSource:res.data||[],visible:true})
    		}else{
    			this.notice('error',res.msg) 
    			this.setState({dataSource:[]})
    		}
    	})
    }
    render() {
        const {elderlyInfo,nursingGrades} = this.props;
        const {visible} = this.state;
        const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'15%',
		      align:'center'
		    },{
			  title: '变更前',
			  dataIndex: 'oldNursingGradeCode',
			  key: 'oldNursingGradeCode',
			  render:(t,r)=>{
			  	 return nursingGrades[t]||"已删除"
			  }
			},{
			  title: '变更前费用',
			  dataIndex: 'oldNursingFee',
			  key: 'oldNursingFee',
			},{
			  title: '变更后',
			  dataIndex: 'newNursingGradeCode',
			  key: 'newNursingGradeCode',
			  render:(t,r)=>{
			  	   return nursingGrades[t]||"已删除"
			  }
			},{
			  title: '变更后费用',
			  dataIndex: 'newNursingFee',
			  key: 'newNursingFee',
			},{
			  title: '变更日期',
			  dataIndex: 'changeNursingFeeDate',
			  render:(t,r)=>{
			  	return t?t.substr(0,10):'';
			  }
			},{
				title:'状态',
				dataIndex:'flag',
				key:'flag',
				render:(t,r)=>{
				   return t===0?<Tag color="#108ee9">审核中...</Tag>:<Tag color="orange">审核完成</Tag>
				},
				align:'center'
			}]
       
        return ( 
        	<Fragment>
        	    <Button type="primary" size="small" icon="cloud-sync" title="护理等级变更历史" onClick={() => { this.handleFetch()}}></Button>
	        	<Modal
			        title="护理等级变更"
			        okText='提交'
			        width="800px"
			        visible={visible}
			        onCancel={this.cancel}
			        maskClosable={false}
			        footer={null}
			      >
	                <Card title="基础信息">
					    <Meta
					        avatar={<Avatar src={img}/>}
					        title={elderlyInfo.name}
					        description={<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?"男":'女'}</Tag>&emsp;年龄:&emsp;<Tag color="#87d068">{elderlyInfo.age}岁</Tag>&emsp;&emsp;房间:&emsp;&emsp;<Tag color="#108ee9">&emsp;{elderlyInfo.roomName}</Tag></span>}
					    />
					</Card>
					<Divider orientation="left">变更记录</Divider> 
					 <Table size="small" columns={columns} dataSource={this.state.dataSource} rowKey="id" />
	            </Modal> 
	        </Fragment>    
        )
    }
}