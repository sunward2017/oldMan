import React, {Component,Fragment} from 'react';
import { connect } from 'react-redux'
import { Table,Form,Tag, Divider, Popconfirm, Button,Tree,Row,Col,notification,Card,Avatar,Tooltip} from 'antd';
import httpServer from '@/axios/index';
import ScheduleForm  from './scheduleForm'
import BreadcrumbCustom from '../../BreadcrumbCustom';
import img from '@/style/imgs/smile.jpg'
const { Meta } = Card;

class editForm extends Component{
	constructor(props) {
		super(props);
		this.state={
			data:[],
			visible:false,
			record:{}
		}
	}
	componentWillMount(){
	    const {id} = this.props.elderlyInfo;
       if(!id){
       	 this.goBack();
       }else{
       	  this.listDrugScheduled();
       }
	  	 
	}
	listDrugScheduled=()=>{
		const {id} = this.props.elderlyInfo;
		httpServer.listDrugScheduled({elderlyId:id}).then(res=>{
			 if(res.code===200){
			    const data = res.data?res.data:[];
			    this.setState({data})
			 }else{
			 	notification.error({
		            message:'提示',
		            description:res.msg,
		            duration:2
		        })
			 	this.setState({data:[]})
			 }
		})
	}
	handleAddSchedule=()=>{
		this.setState({record:{},visible:true})
	}
	handleModify=(r)=>{
	   this.setState({record:{...r,drugCode:{drugCode:r.drugCode,name:r.drugName}},visible:true})
	}
	handleDelete=(r)=>{
		httpServer.deleteDrugScheduled({id:r.id}).then(res=>{
			if(res.code===200){
				notification.success({
		            message:'提示',
		            description:res.msg,
		            duration:2
		        })
			}else{
				notification.error({
		            message:'提示',
		            description:res.msg,
		            duration:2
		        })
			}
			this.listDrugScheduled();
		})
	}
	refresh=()=>{
		this.setState({visible:false},function(){
			this.listDrugScheduled();
		});
	}
    goBack=()=>{
    	const  url= this.props.location.pathname.split('/');
    	       url.pop();
    	this.props.history.replace(url.join('/'));
    }
	render(){
		const {elderlyInfo} = this.props;
		const {data,visible,record}= this.state;
		const columns = [{
			  title: '药品名称',
			  dataIndex: 'drugName',
			  key: 'drugName',
			}, {
			  title: '用药用量',
			  dataIndex: 'usage',
			  key: 'usage',
			  render:(t,r)=>{
			  	 return r.quantity+'/'+r.minUnit;
			  }
			},{
				title:'重复值域',
				dataIndex:"days",
			},{
				title:"服用时间",
				dataIndex:"point",
				onCell: () => {
			        return {
			          style: {
			            maxWidth: 150,
			            overflow: 'hidden',
			            whiteSpace: 'nowrap',
			            textOverflow:'ellipsis',
			            cursor:'pointer'
			          }
			        }
			    },
			    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
			}, {
			  title: '类别',
			  dataIndex: 'type',
			  key: 'type',
			  render:(text,r)=>{
			  	switch(text){
					case 2: return <Tag color ="cyan">按日</Tag>;  
					case 3: return <Tag color = "#2db7f5">按周</Tag>; break;	
					case 4: return <Tag color = "#87d068">按月</Tag>; break;	
					default: return <Tag color = "#108ee9">按需</Tag>
				}
			   
			  }
			},{
			  title: '状态',
			  dataIndex: 'status',
			  render:(t,r)=>{
			  	const color = t===1?'red' : 'green';;
				const text = t===1?'启用':'停用'
				return <Tag color={color}>{text}</Tag>;
			  }
			},{
			  title: '操作',
			  key: 'action',
			  render: (text, record) => (
			  	<span>
			  	<a href="javascript:;" onClick={() => { this.handleModify(record)}} style={{color:'#2ebc2e'}}>修改</a>
                <Divider type="vertical" />
			    <Popconfirm title="确定删除?" onConfirm={()=>{this.handleDelete(text)}}>
				  <a style={{color:'#2ebc2e'}}>删除</a>
				</Popconfirm>
				</span>
			  ),
			}];
		return(
			<Fragment>
			    <BreadcrumbCustom first="药品管理" second='用药计划制定' />
			    <Card title="基础信息" extra={ <Button onClick={this.goBack} type="primary">返回</Button>}>
				    <Meta
				        avatar={<Avatar src={img} />}
				        title={elderlyInfo.name}
				        description={<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?"男":"女"}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{elderlyInfo.age}岁</Tag>&emsp;&emsp;房间:&emsp;<Tag color="geekblue">{elderlyInfo.roomName}</Tag></span>}
				    />
				    <Divider/>
				    <Table rowKey='id' columns={columns} dataSource={data} />
				 
				    <Button onClick={this.handleAddSchedule} icon='plus'></Button>
				    {visible?<ScheduleForm record={record} elderlyId={elderlyInfo.id} close={this.refresh}/>:null}
				</Card>
				
			</Fragment>
		)
	}
}

const mapStateToProps = (state, ownProps) =>({elderlyInfo:state.drugElderlyInfo})
export default  connect(mapStateToProps)(Form.create()(editForm));