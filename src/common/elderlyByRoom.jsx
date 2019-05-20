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
import ChangeNursingGrade from '../components/elderlyManage/changeNursingGrade';
import ChangeRoom from '../components/elderlyManage/changeRoom';
import ChangeProportion from '../components/elderlyManage/changeProportion';
import healthRecord from '../components/medicalCare/healthRecord';



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
			this.AreaTree()
		})
		 
	}
	AreaTree=()=>{
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
	handleAdd(r) {
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
        this.setState({areaCode:value[0]},function(){
        	this.fetchElderly();
        })
    }
   
    fetchElderly=()=>{
    	const { areaCode } = this.state;
    	httpServer.listElderlyInfo({listStatus:'3', launchFlag:0, areaCode}).then(res => {
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
    handleChange=(r,type)=>{
    	this.setState({visible:true,elderlyInfo:r,type});
    }
    registerComponent=()=>{
    	const {elderlyInfo,Grades,type} = this.state;
    	if(this.state.second==='换房处理'){
    		return <ChangeRoom elderlyInfo={elderlyInfo} close={this.cancel} auth={this.props.auth} type={type}/>
    	}else if(this.state.second==='护理等级变更'){
    		return <ChangeNursingGrade elderlyInfo={elderlyInfo}  close={this.cancel} auth={this.props.auth} grades={Grades} type={type}/>
    	}else{
    		return <ChangeProportion elderlyInfo={elderlyInfo} close={this.cancel} type={type}/>
    	}
    }
    cancel=()=>{
	    this.setState({visible:false},()=>{
	    	this.fetchElderly();
	    })
    }
    getNursingGradeList(){
	    
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
    handleSearchElderly=()=>{
    const { searchText } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.dataSource.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        data,
	      });
	    }else{
	      const args = {
	        message: '友情提示',
	        description: "请先输入老人姓名",
	        duration: 2,
	      };
	      notification.info(args);
	    }
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
		      width:'5%'
		    },{
		      title:'入院编号',
		      dataIndex: 'elderlyNo',
		      key: 'elderlyNo',
		      width:'10%'
		    },{
		      title: '老人姓名',
		      dataIndex: 'name',
		      key: 'name',
		      width:'10%'
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
		      	 return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
		      }
		    },{
		      title: '房间名称',
		      dataIndex: 'roomName',
		      key: 'roomName',
		      width:'10%'
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
		      render:(text,record)=>{
		      	const  url  = this.props.location.pathname;
		      	switch(this.state.second){
		      		case '用药计划': return(
								        <span>
								           <a href="javascript:;" onClick={() => { this.handleAdd(record) }} style={{color:'#2ebc2e'}}>用药计划</a>
								        </span>
							        );
                    
                    case '换房处理': return(
                    	               <span className="manual"> 
                    	               		<span onClick={() => { this.handleChange(record,'edit') }} style={{color:'#2ebc2e'}}>换房申请</span><Divider type="vertical" />
                    	               		<span onClick={() => { this.handleChange(record,'read') }} style={{color:'#2ebc2e'}}>换房记录</span>
                    	               </span>
                                   )
                    
                    case '护理等级变更':return(
				                    	<span className="manual">
					                    	<span onClick={() => { this.handleChange(record,'edit') }} style={{color:'#2ebc2e'}}>护理等级变更</span><Divider type="vertical" />
					                    	<span onClick={() => { this.handleChange(record,'read') }} style={{color:'#2ebc2e'}}>变更记录</span>
				                     	</span>
				                        )
                    case '水电比例变更': return(
					                    	<span className="manual">
						                    	<span onClick={() => { this.handleChange(record,'edit') }} style={{color:'#2ebc2e'}}>水电比例变更</span><Divider type="vertical" />
					                     	</span>
					                    )
                    
                    case '健康档案': return(
                    	                <span>
                    	                   <Link to={{ pathname: `${url}/${record.id}/${record.name}/edit`,state:record}}>健康档案</Link>
                    	                </span>
                    	
                    )
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
	             <div className="search">
	                <Input 
	                  placeholder="按老人姓名搜索" 
	                  style={{width:'40%',marginRight:'10px'}}
	                  ref={ele => this.searchInput = ele}
	                  value={this.state.searchText}
	                  onChange={this.handleInputChange}
	                  onPressEnter={this.handleSearchElderly}
	                />
	                <Button type="primary" onClick={this.handleSearchElderly}>开始搜索</Button>
	                <Button type="primary" onClick={this.handleReset}>刷新</Button>
	             </div>   
	             <Divider/>
		          <Table 
		            bordered
		            rowKey='id' 
		            dataSource={data} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
		          />
	            </Col>
	        </Row>
	         
	        {
	        	visible?this.registerComponent():null
	        }
	        <style>{`
	        	    .search{
	        	    	padding-top:30px;
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