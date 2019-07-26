import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'react-redux'
import { Table, Tag,Tree,Row,Col,notification,Card,Icon,Modal,Empty,Divider,message,Button,Input} from 'antd';
import { Link } from 'react-router-dom';
import BreadcrumbCustom from '../components/BreadcrumbCustom';
import httpServer from '@/axios/index';
import { drugElderlyInfo } from '@/action';
import ChangeRoom from '../components/elderlyManage/changeRoom';
import healthRecord from '../components/medicalCare/healthRecord';
import {HistoryChangeRoom,HistoryChangeNursingGrade} from './table'


const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const {Meta} = Card;
class Plan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			operator:'',
			areaTree:[],
			second:'用药计划',
			elderlyInfo:{},
			nursingGrade:{},
			Grades:[],
			areaCode:'',
			type:'edit',
			searchText:'',
			data:[]
		}
	}
	componentDidMount() {
		const auth = this.props.auth;
		var url = this.props.location.pathname;
		var second = '';
		if(url.indexOf('drugUsePlan')>-1){
			second = '用药计划';
		}else if(url.indexOf('changeRoom')>-1){
			second = '换房处理';
		}else if(url.indexOf('nursingGradeChange')>-1){
			second = '护理等级变更';
		}else if(url.indexOf('changeProportion')>-1){
			second ='水电比例变更';
		}else if(url.indexOf('healthRecord')>-1){
			second = '健康档案';
		}else if(url.indexOf('nursingRecord')>-1){
			second = '护理记录'
		}
		 
		this.setState({second,customerId:auth.customerId,operator:auth.account},function(){
			this.getNursingGradeList()
			this.getAreaTree();
			if(second !== '用药计划'){
			  this.fetchElderly()	
			}
		})
		 
	}
	getAreaTree=()=>{
		const customerId = this.state.customerId;
		httpServer.listAreaInfo({customerId}).then(res=>{
			if(res.code===200){
				const data = res.data?[res.data]:[];
				this.setState({areaTree:data})
			}else{
				const args = {
		          message: '失败',
		          description: res.msg,
		          duration: 2,
		        };
		        notification.error(args);
			}
		})
	}
	/*添加按钮*/
	handleAdd=(r)=>{
		this.props.dispatch(drugElderlyInfo(r));
		const url= this.props.location.pathname;
		this.props.history.replace(url+'/edit');
	}
	
	renderTreeNodes = data => data.map((item) => {
	    if (item.children) {
	      return (
	        <TreeNode title={item.areaName} key={item.areaCode} >
                {this.renderTreeNodes(item.children)}
            </TreeNode>
	      );
	    }
	    return <TreeNode {...item} />;
	})
    onTreeSelectChangeHandler = (value) => {
    	sessionStorage['areaCode']= value[0];
        this.fetchElderly(); 
    }
   
    fetchElderly=()=>{
    	const areaCode = sessionStorage.getItem('areaCode');
    	const {second} = this.state;
    	const Url = second==="用药计划"?"listElderlyDrugScheduledInfo":"listElderlyInfo";
    	httpServer[Url]({listStatus:'3', launchFlag:0, areaCode}).then(res => {
        	if(res.code===200){
        	   const data = res.data||[];
        	   this.setState({dataSource:data,data})	
        	}else{
        		message.error('获取入住老人失败');
        		this.setState({dataSource:[]})
        	}
        	 
        }) 
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
   
  
    cancel=()=>{
	    this.setState({visible:false},()=>{
	    	this.fetchElderly();
	    })
    }
    getNursingGradeList=()=>{
	    httpServer.listNursingGrade({}).then((res)=>{
	       if (res.code === 200) {
	           let nursingGrade = {};
	           res.data&&res.data.forEach(t=>{
	           	  nursingGrade[t.nursingGradeCode]= t.nursingGradeName;
	           })
	           this.setState({nursingGrade,Grades:res.data})
	        } else {
	           this.setState({nursingGrade:{},Grades:[]})
	        }
	    }).catch((err)=>{
	      console.log(err);
	    });
	}
    handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
    handleSearchElderly=(value)=>{
        /\S+/.test(value) && this.getListElderlyInfo({
			name: value.trim()
		});
    }
    getListElderlyInfo = (searchKey) => {
		httpServer.listElderlyInfo({
			listStatus: "3",
			launchFlag: 0,
			...searchKey
		}).then((res) => {
			if(res.code === 200) {
				const data = res.data?res.data:[];
				this.setState({data})
			} else {
				const args = {
					message: '通信失败',
					description: res.msg,
					duration: 2,
				};
				notification.error(args);
			}
		}).catch((error) => {
			console.log(error);
		});
	}
    handleReset = ()=>{
    	const {data,dataSource} = this.state;
    	this.setState({data:dataSource,searchText:''})
    }
	render() {
		const {
			data,
			areaTree,
			visible,
			rooms,
			tbVisible
		} = this.state;
	 	const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'5%',
		      align:'center'
		    },{
		      title: '老人姓名',
		      dataIndex: 'name',
		      key: 'name',
		      width:'10%'
		    },{
		      title: '房间名称',
		      dataIndex: 'roomName',
		      width:'10%',
		      defaultSortOrder: 'descend',
              sorter: (a, b) => a.roomName - b.roomName,
		    },{
		      title: '年龄',
		      dataIndex: 'age',
		      key: 'age',
		      width:'10%'
		    },{
		      title: '性别',
		      dataIndex: 'sex',
		      key: 'sex',
		      width:'10%',
		      render:(text)=>{
		      	 return text===1?<Tag color="#337Ab7">男</Tag>:<Tag color="#F00">女</Tag>
		      }
		    },{
		      title:'护理等级',
		      dataIndex: 'nursingGradeCode',
		      key: 'nursingGradeCode',
		      width:'15%',
		      render:(t,r)=>{
		      	 return this.state.nursingGrade[t]||t;
		      }
		    },{
		      title: '操作',
		      dataIndex: 'action',
		      key: 'action',
		      width:'15%',
		      align:'center',
		      render:(text,record)=>{
		      	const  url  = this.props.location.pathname;
		      	const {nursingGrade} = this.state;
		      	switch(this.state.second){
		      		case '用药计划': return( <Button type="primary" size="small" icon="idcard" title="用药计划" onClick={() => { this.handleAdd(record) }}></Button>);
                    case '健康档案': return(<Link to={{ pathname: `${url}/${record.id}/${record.name}/edit`,state:record}}>
                    	                   <Button type="primary" size="small" icon="project" title="健康档案"></Button>
		      	                           </Link>
                    	                 )
                    case '换房处理': return(
                    	               <span className="manual"> 
                    	                     <ChangeRoom elderlyInfo={record} auth={this.props.auth}/>
                    	               		 <Divider type="vertical"/>
                    	               		 <HistoryChangeRoom elderlyInfo={record}/>
                    	               		 <Divider type="vertical"/>
                    	               		 <HistoryChangeNursingGrade nursingGrades={nursingGrade}  elderlyInfo={record}/>
                    	               </span>)
                    case '护理记录': return(
                    	                <span>
                    	                   <Link to={{ pathname: `${url}/list`,state:record}}>护理记录</Link>
                    	                </span>
                    	
                    )
		      	}
		      }
		    }];
		return(
	    <Fragment>
	        <BreadcrumbCustom first="医护管理" second={this.state.second} />
	        <Row gutter={24}>
	            <Col  xs={{ span: 24}} lg={{ span: 4}}>
	                <Card title="房间楼层" bordered={false} >
		              <Tree
		                defaultExpandAll
				        onSelect={this.onTreeSelectChangeHandler}
				      >
				        {this.renderTreeNodes(areaTree)}
				      </Tree>
				    </Card>  
	            </Col>
	            <Col  xs={{ span: 24}} lg={{ span: 20}} style={{background:'#fff'}}>
	             <div className="search" >
	                <Search
					    placeholder="请输入老人全名"
			 	        onChange={this.handleInputChange}
		 		        value={this.state.searchText}
	  			        onSearch={this.handleSearchElderly}
			 	        style={{ width: 200 }}
			 	        enterButton
					    />
	             </div>   
	             <Divider/>
		          <Table 
		            size="middle"
		            rowKey='id' 
		            dataSource={data} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
		          />
	            </Col>
	        </Row>
	         
	        
	       
	        <style>{`
	        	    .search{
	        	    	padding-top:30px;
	        	    	text-align:right;
	        	    }
			        .manual>span{
					   cursor:pointer;
					}		 
			      `}</style>
        </Fragment>
		)
	}
}
 
 
export default  connect()(Plan);