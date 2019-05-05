import React from 'react';
import moment from 'moment';
import {Table,Card,Col,Row,Input, DatePicker, Button, notification, Divider, Icon,Popconfirm } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '@/axios'
import StockForm from './stockForm'

const { RangePicker } = DatePicker;

class DrugInStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      addTime:[moment().subtract('days', 6).format('YYYY-MM-DD HH:mm:ss'),moment().format('YYYY-MM-DD HH:mm:ss')],
      state:false,
      record:{},
      type:'edit',
    }  
  }
  onChange=(date,dateStr)=>{
  	this.setState({addTime:dateStr})
  }
  componentDidMount(){
     this.listElderly();
  }
  
  handleSearch=()=>{
    this.listInStock();
  }
  
  listInStock=()=>{
  	let {addTime} = this.state;
  	const {customerId} = this.props.auth;
  	let param = {type:1,customerId};
  	param=addTime.length>0?{...param,startTime:addTime[0],endTime:addTime[1]}:param;
  	httpServer.listDrugInAndOut(param).then(res=>{
  		 if(res.code===200){
  		 	 const dataSource = res.data?res.data:[];
  		 	 this.setState({dataSource})
  		 }else{
  		 	 this.setState({dataSource:[]})
  		 }
  	})
  }
  handleAdd=()=>{
  	this.setState({record:{},state:true,type:"add"})
  }
  
  listElderly=()=>{
  	const customerId = JSON.parse(sessionStorage.getItem('auth')).customerId;
		const value = this.props.value;
		httpServer.listElderlyInfo({
			customerId,
			listStatus: '0,1,2,3'
		}).then(res => {
			if(res.code === 200 && res.data) {
				 let elderlys = {}
				 res.data.forEach(item=>{
				  	elderlys[item.id] = item.name;
				 })
				 this.setState({elderlys})
			}else{
				this.setState({elderlys:{}})
			}
			this.listInStock()
		})
  }
  
  handleModify(record) {
    this.setState({state:true,record,type:'edit'})
  }
  
  handleRowDelete(id) {
    const _this = this;
	    httpServer.deleteDrugInAndOut ({id}).then(res => {
	    	
	      if (res.code === 200) {
	        const args = {
	          message: '成功',
	          description: '删除成功',
	          duration: 2,
	        };
	        notification.success(args);
	        this.listInStock();
	      } else {
	         const args = {
	          message: '失败',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.error(args);
	      }
	    }).catch(
	      err => { console.log(err) }
	    ) 
  }
  
  handleRead(record) {
     this.setState({state:true,record,type:'audit'})
  }
  cancle=()=>{
    this.handleSearch();
  	this.setState({state:false})
  }
  render() {
    let {dataSource,state,addTime} = this.state;
    const columns=[{
       title: '入库单号',
	      dataIndex:'docNo',
	      key: 'docNo',
	      width:'10%'	
    },{
       title: '老人',
	      dataIndex: 'elderlyId',
	      key: 'elderlyId',
	      width:'20%',
	      render:(t,r)=>{
	      	const elderlys = this.state.elderlys;
	      	return elderlys[t]?elderlys[t]:t;
	      }
    },{
       title: '入库类别',
	      dataIndex: 'receiptType',
	      key: 'receiptType',
	      width:'10%'	
    },{
        title: '入库时间',
	      dataIndex: 'inOutTime',
	      key: 'inOutTime',
	      width:'10%'	
    },{
    	  title:'审核人',
    	  dataIndex:'auditor',
    	  key:'auditor',
    	  width:'10%'
    },{
    	title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '12%',
			render: (text, record) => {
				return(
					<span>
               {
					      !record.auditor?
					      <span>
					        <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
					        <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id)}>
		                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
		              </Popconfirm>
		              <Divider type="vertical" />
					        <a href="javascript:;" onClick={() => { this.handleRead(record) }} style={{color:'#2ebc2e'}}>审核</a>
					      </span>:null
					    }
          </span>
				)
			}
    }];
    return (
    	<React.Fragment>
    	  <BreadcrumbCustom first="药品管理" second="药品入库" />
          <Card bordered={false}>
            <Row gutter={16}>
                <Input.Group compact>
                  <RangePicker onChange={this.onChange} showTime value={[moment(addTime[0]),moment(addTime[1])]}/>  
                  <Button type="primary" onClick={this.handleSearch}>搜索</Button> 
                  <Button type="primary" onClick={this.handleAdd}>点击添加</Button>  
                </Input.Group>
            </Row>
          </Card>
          <Card bordered={false} style={{marginTop:'10px'}}>
	          <Table 
	           columns={columns} 
	           dataSource={dataSource} 
	           rowKey={record => record.id}
	          />
	        </Card>
	        {state?<StockForm cancle={this.cancle} auth={this.props.auth} infoData={this.state.record} type={this.state.type}/>:null}
      </React.Fragment>
    )
  }
}

 
export default DrugInStock;