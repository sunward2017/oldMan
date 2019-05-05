import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'react-redux'
import { Table, Tag,Tree,Row,Col,notification,Card,Icon,Modal,Empty,Divider,message} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { Link } from 'react-router-dom';

import httpServer from '@/axios/index';

const TreeNode = Tree.TreeNode;
const {Meta} = Card;
class Plan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			operator:'',
			areaTree:[],
			elderlyInfo:{},
			areaCode:'',
			pageTxt:'在院'
		}
	}
	componentWillMount(){
    	const pageTxt=(this.props.location.pathname.indexOf('settleAccounts')>-1)?'在院':'出院';
        this.setState({pageTxt})
	}
	componentDidMount() {
		const auth = this.props.auth;	 
		this.setState({operator:auth.account},function(){
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
    	const launchFlag=(this.props.location.pathname.indexOf('settleAccounts')>-1)?0:1;
    	httpServer.listElderlyInfo({listStatus:'3', launchFlag, areaCode}).then(res => {
        	if(res.code===200){
        	   const data = res.data||[];
        	   this.setState({dataSource:data})	
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
     
    
	render() {
		const {
			dataSource,
			areaTree,
			visible,
			rooms,
			tbVisible,
			pageTxt
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
		      title: '性别',
		      dataIndex: 'sex',
		      key: 'sex',
		      width:'10%',
		      render:(text)=>{
		      	 return text===1?<Tag  color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
		      }
		    },{
		      title: '房间',
		      dataIndex: 'roomName',
		      key: 'roomName',
		      width:'8%'
		    },{
		      title: '结算状态',
		      dataIndex: 'settlementFlag',
		      key: 'settlementFlag',
		      width:'5%',
		      
		      render:(t,r)=>{
		      	 return t==1? <Icon style={{fontSize:20}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> :<Icon style={{fontSize:20}} type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
		      }
		    },{
		      title: '最近结算日期',
		      dataIndex: 'settlementDate',
		      key: 'settlementDate',
		      width:'10%'
		    },{
		      title: '操作',
		      dataIndex: 'action',
		      key: 'action',
		      width:'5%',
		      render:(text,record)=>{
		      	const  url  = this.props.location.pathname;
		        return <Link to={{ pathname: `${url}/page`,data:record}}>费用结算</Link>
		      }
		    }];
		return(
	    <Fragment>
	         <BreadcrumbCustom first="财务管理" second={`${pageTxt}结算`} />
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
		          <Table 
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
		          />
	            </Col>
	        </Row>
	        <style>{`
			        .manual>span{
					   cursor:pointer;
					}		 
			      `}</style>
        </Fragment>
		)
	}
}
 
 
export default  connect()(Plan);