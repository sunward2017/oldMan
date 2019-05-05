 import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'react-redux'
import { Table, Tag, Divider, Popconfirm, Button,Tree,Row,Col,notification,Card} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '@/axios/';
import DrugStock from './drugStock';

const TreeNode = Tree.TreeNode;

class Plan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			record: {},
			customerId:'',
			areaTree:[],
			visible:false,
			drugStockInfo:{}
		}
	}
	componentDidMount() {
		const auth = this.props.auth;
		this.setState({customerId:auth.customerId},function(){
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
	renderTreeNodes = data => data.map((item) => {
	    if (item.children) {
	      return (
	        <TreeNode title={item.areaName} key={item.areaCode} value={item.areaCode}>
                 {this.renderTreeNodes(item.children)}
            </TreeNode>
	      );
	    }
	    return <TreeNode {...item} />;
	})
    onTreeSelectChangeHandler = (value) => {
        if(value.length >0)this.fetchElderlyByKey({areaCode:value[0]})
    }
    fetchElderlyByKey(searchKey){
        httpServer.listElderlyInfo({customerId:this.state.customerId,listStatus: '3',...searchKey }).then(res => {
            const data = res.data?res.data:[];
            this.setState({dataSource:data});
            res.code !==200&&this.notice('error', res.msg) ;
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
    handleLook=(r)=>{
       this.listStockByElderly(r)
    }
    listStockByElderly=(r)=>{
    	httpServer.listDrugStockInfo({elderlyId:r.id,customerId:r.customerId}).then(res=>{
    	   if(res.code===200&&res.data){
    	   	 this.setState({visible:true,drugStockInfo:{
    	   	 	elderly:r,
    	   	 	drugs:res.data.map(item=>({...item,...item.tbDrugInfo}))
    	   	 }})
    	   }else{
    	   	 this.notice('error','没有该老人药品信息')
    	   }
    	})
    }
	render() {
		const {
			dataSource,
			areaTree,
			visible
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
		      title:'入院时间',
		      dataIndex: 'checkInDate',
		      key: 'checkInDate',
		      width:'15%'
		    },{
		      title: '操作',
		      dataIndex: 'action',
		      key: 'action',
		      width:'15%',
		      render:(text,record)=>{
		        return(
		          <span>
		            <a href="javascript:;" onClick={() => { this.handleLook(record) }} style={{color:'#2ebc2e'}}>查看</a>
		          </span>
		        )
		      }
		    }];
		return(
	    <Fragment>
          <BreadcrumbCustom first="药品管理" second='药品库存' />
	        <Row gutter={24}>
	             <Col  xs={{ span: 24}} lg={{ span: 4}}>
	                <Card title="房间楼层" bordered={false} >
		              <Tree
				        checkable
				        onCheck={this.onTreeSelectChangeHandler}
				      >
				        {this.renderTreeNodes(areaTree)}
				      </Tree>
				    </Card>  
	            </Col>
	            <Col  xs={{ span: 24}} lg={{ span: 20}}>
		          <Table 
		            bordered
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
		          />
	          </Col>
	        </Row>
	        {
	          visible?<DrugStock drugStockInfo={this.state.drugStockInfo} close={()=>{this.setState({visible:false})}}/>:null	
	        }
        </Fragment>
		)
	}
}
 
 
export default  connect()(Plan);
