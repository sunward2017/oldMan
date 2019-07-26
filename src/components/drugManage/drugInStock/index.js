import React from 'react';
import moment from 'moment';
import {Table,Card,Col,Row,Input, DatePicker, Button, notification, Divider, Icon,Popconfirm } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '@/axios'
import StockForm from './stockForm'

const { RangePicker } = DatePicker;
const {Search} = Input;

class DrugInStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      initData:[],
      dateSection:[moment().subtract('days', 6),moment()],
      state:false,
      record:{},
      type:'edit',
    }  
  }
  onChange=(date,dateStr)=>{
  	this.setState({dateSection:date})
  }
  componentWillMount(){
     this.listElderly();
  }
  
  handleSearch=()=>{
    this.listInStock();
  }
  
  listInStock=txt=>{
  	let {dateSection,elderlys} = this.state;
  	let param = {type:1,name:txt};
  	if(!txt){
     	param=dateSection.length>0?{...param,startTime:dateSection[0].format("YYYY-MM-DD HH:mm:ss"),endTime:dateSection[1].format("YYYY-MM-DD HH:mm:ss")}:param;
  	}
  	httpServer.listDrugInAndOut(param).then(res=>{
  		 if(res.code===200){
  		 	 const data = res.data?res.data.map(i=>({...i,elderlyName:elderlys[i.elderlyId]})):[];
  		 	 this.setState({dataSource:data,initData:data})
  		 }else{
  		 	 this.setState({dataSource:[],initData:[]})
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
				 this.setState({elderlys},()=>{
				 	 this.listInStock()
				 })
			}else{
				this.setState({elderlys:{}},()=>{
					this.listInStock()
				})
			}
			
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
  
  handleRead(record,type) {
     this.setState({state:true,record,type})
  }
  cancle=()=>{
    this.handleSearch();
  	this.setState({state:false})
  }
  handleSearchElderly=(searchText)=>{//搜索老人信息
     this.listInStock(searchText)
  }
  render() {
    let {dataSource,state,dateSection} = this.state;
    const columns=[{
       title: '入库单号',
	      dataIndex:'docNo',
	      key: 'docNo',
	      width:'10%',
	      align:'center'
    },{
       title: '老人',
	      dataIndex: 'elderlyName',
	      key: 'elderlyName',
	      width:'20%'
    },{
       title: '入库类别',
	      dataIndex: 'receiptType',
	      key: 'receiptType',
	      width:'10%'	
    },{
        title: '入库日期',
	      dataIndex: 'inOutTime',
	      key: 'inOutTime',
	      width:'10%',
    },{
        title: '审核日期',
	      dataIndex: 'auditTime',
	      key: 'auditTime',
	      width:'10%',
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
			align:"center",
			render: (text, record) => {
				return(
					<span>
               {
					      !record.auditor?
					      <span>
					        <Button type="primary" title="修改" size="small" icon="edit" onClick={() => { this.handleModify(record) }}></Button>
					        <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id)}>
		                 <Button type="primary" title="删除" size="small" icon="delete"></Button>
		              </Popconfirm>
		              <Divider type="vertical" />
					        <Button size="small" type="primary" title="审核" icon="audit" onClick={() => { this.handleRead(record,'audit') }}></Button>
					      </span>:<Button type="primary" title="查看" size="small" icon="read" onClick={() => { this.handleRead(record,"read") }}></Button>
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
              <Col md={16} sm={12}>
                <Input.Group compact>
                  <RangePicker onChange={this.onChange} showTime value={dateSection}/>  
                  <Button type="primary" onClick={this.handleSearch} title="搜索" icon="search"></Button>
                  <Button type="primary" onClick={this.handleAdd} title="新增" icon="plus"></Button>
                </Input.Group>
              </Col>
              <Col md={8} sm={12} className="text-right">
                <Search
							      placeholder="请输入关键字"
							      onSearch={v=>this.handleSearchElderly(v)}
							      style={{ width: 200 }}
							      enterButton
							  />
              </Col>  
            </Row>
          </Card>
          <Card bordered={false} style={{marginTop:'10px'}}>
	          <Table 
	           size="middle"
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