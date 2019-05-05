import React,{Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import {Tag,Table,Divider,Popconfirm,notification,Button,Card} from 'antd';
import httpServer from '../../../axios';
import EvaluateInfo from './evaluateInfo';

class OldManEvaluate extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      customerId:'',
      tabKey:'tab1',
      data:[],
      elderlys:{},
      flag:1,
      evaluateByElderly:{},
      isRegular:false,
      rowId:'',
    }
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount(){
      const isRegular=this.props.location.pathname.indexOf('regularEvaluate')>-1?true:false;
    	this.setState({isRegular},()=>{
    	 	  this.listByElderly();
    	})
    
  }

  onTabChange = (tabKey, type) => {
    this.setState({ tabKey});
  }

  //getEvaluateList获取老人评估列表、评估项
  getEvaluateList(){
    const {customerId} = this.props.auth;
    this.setState({customerId});
    const flag = this.state.isRegular?'2':'1'
    httpServer.listOldManEvaluate({customerId,flag}).then((res)=>{
       if (res.code === 200) {
       	  if(res.data){
       	  	const elderlyIds={};
       	  	var data=res.data,l=data.length,newData=[];
       	  	for(var i=0;i<l;i++){
       	  		 if(!elderlyIds[data[i].elderlyId]){
       	  		 	 elderlyIds[data[i].elderlyId] = true;
                 newData.push(data[i]);
       	  		 }else{
       	  		  const index = newData.findIndex(item=>(item.elderlyId===data[i].elderlyId));
       	  		  if(!newData[index].children)newData[index].children=[];
       	  		  newData[index].children.push(data[i]);
       	  		 }
       	  	}
       	  	this.setState({dataSource:newData});
       	  }else{
       	  	this.setState({dataSource:[]})
       	  }
           
        } else {
          if(res.message ==='Request failed with status code 500'){
              console.log(res.message);
          }else{
            const args = {
              message: '获取老人评估列表失败',
              description: res.msg,
              duration: 2,
            };
            notification.error(args);
          }
        }
    }).catch((err)=>{
      console.log(err);
    });
  }
  
  listByElderly=()=>{
  	 const {customerId} = this.props.auth;
  	 httpServer.listElderlyInfo({listStatus:'0,1,2,3,4',customerId}).then((res) => {
		      if (res.code === 200) {
		         if(res.data){
		         	 let obj = {};
		         	 res.data.map(item=>{
		         	 	 obj[item.id]= item;
		         	 })
		         	 this.setState({elderlys:obj},function(){
		         	 	  this.getEvaluateList();
		         	 })
		         }
		      } else {
		        if(res.message ==='Request failed with status code 500'){
		            console.log(res.message);
		         }else{
		             const args = {
		            message: '通信失败',
		            description: res.msg,
		            duration: 2,
		          };
		          notification.error(args);
		         }
		      }
	    }).catch((error) => {
	      console.log(error);
	    });
  }
  //
  handleAdd(){
    this.setState({ tabKey:'tab2',evaluateByElderly:{},rowId:''});
  }
  reback=()=>{
  	this.listByElderly();
  	this.setState({ tabKey:'tab1'});
  }
  //查看护工信息
  handleRead(record){
  	const {elderlys} = this.state;
  	this.setState({flag:1,evaluateByElderly:elderlys[record.elderlyId],tabKey:'tab2',rowId:record.id})
 
  }  
  render(){
    const {dataSource,customerId,data,evaluateByElderly,isRegular,tabKey,rowId} = this.state;
    const tabList = [{
      key: 'tab1',
      tab: 'tab1',
    }, {
      key: 'tab2',
      tab: 'tab2',
    }];
    const columns = [{
      title:'评估日期',
      dataIndex: 'estimate',
      key: 'addtime',
      width:'15%',
      render:(text,record,index)=>{
      	return text&&text.split(' ')[0]
      }
    },{
      title: '评估老人',
      dataIndex: 'elderlyId',
      key: 'elderlyId',
     render:(t,r,i)=>{
     	   if(this.state.elderlys[t]){
           return this.state.elderlys[t].name;
         }else{
         	 return t;
         }
     }
    },{
      title: '评估最终等级',
      dataIndex: 'estimateGradeName',
      key: 'estimateGradeName',
      width:'15%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      width:'10%',
      render:(text,record)=>{
        return( 
            <a href="javascript:;" onClick={() => { this.handleRead(record) }} style={{color:'#2ebc2e'}}>修改</a>
        )
      },
    }];
    const contentList = {
      tab1: <Table 
          bordered
          dataSource={dataSource} 
          indentSize={20}
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
          rowKey={record => record.id}
        />,
      tab2: <EvaluateInfo key={rowId} isRegular={this.state.isRegular}  evaluateByElderly={evaluateByElderly} reback={this.reback} rowId={rowId}/>,
    };
    return(
      <div>
        <BreadcrumbCustom first="老人管理" second={isRegular?"定期评估":"入院评估"} />
        <Card 
          title={isRegular?"定期评估":"入院评估"}
          bordered={false} 
          extra={tabKey=='tab1'?<Button type="primary" onClick={this.handleAdd} >新建评估</Button>:null}
          activeTabKey={this.state.tabKey}
        >
          {contentList[this.state.tabKey]}
        </Card>
       
      </div>
    )
  }
}

export default OldManEvaluate;
