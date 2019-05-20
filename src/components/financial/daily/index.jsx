import React, {Component,Fragment} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Select,notification,InputNumber,Icon,message} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '@/axios/index';
import Elderlys  from '@/common/elderlySelect'
import ItemInput from './item'
import {host} from '@/axios/config';
import PrintItem from './printItem';
import moment from 'moment'
 
let key = 0;
class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			iconLoading:false,
			items:[],
			elderlyId:'',
			id:'',
			uuidCode:'',
			printFlag:false,
			printData:{},
			st:moment().subtract('days', 15),
			et:moment()
		}
	}
	
	componentDidMount() {
		this.List()
	}
	
	List=(id)=> {
		const {st,et} = this.state;
		httpServer.listImmediateFee({rq1:st.format('YYYY-MM-DD'),rq2:et.format("YYYY-MM-DD")}).then(res => {
			if(res.code===200) {
				const data = res.data?res.data:[]
				this.setState({	dataSource:data })
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
	 
	/*修改操作*/
	handleModify(r) {
		let total = 0;
		r.tbElderlyImmediateFeeInfos.forEach(k=>{
			total+=k.money;
		})
		this.setState({
			modalFlag: true,
			id:r.id,
			total,
			elderlyId:r.tbElderlyInfo.id,
			items:r.tbElderlyImmediateFeeInfos.map(i=>({...i,key:i.id})),
			uuidCode:r.uuidCode
		});
		
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.delImmediateFee({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	      } else {
	        const args = {
	          message: '失败',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.error(args);
	      }
	      this.setState({modalFlag:false,record:''});
	      _this.List();
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd=()=>{
		this.setState({
			modalFlag: true,
		    elderlyId:'',
		    items:[],
		    id:''
		});
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false,
		});
	}
	/*提交完成添加客户信息*/
	handleOk = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
			   const {items,total,id,uuidCode} = this.state;
			   if(!items||items.length===0){
			   	  message.error('收费项不可为空')
			   }
			   if(fieldsValue.sumMoney&&parseInt(fieldsValue.sumMoney)!==parseInt(total)){
			   	  message.error('收费金额有误，请核对')
			   }else{
			   	const { name,customerId } = _this.props.auth;
			   	 let data = {
			   	 	...fieldsValue,
			   	 	tbElderlyImmediateFeeInfos:items,
			   	 	customerId:customerId,
			   	 	payee:name
			   	 }
			   	 let url= id?'updateImmediateFee':'saveImmediateFee';
			   	 if(id) {
			   	 	 data.id =id;
			   	 	 data.uuidCode = uuidCode;
//			   	 	 data.tbElderlyImmediateFeeInfos = { ...data.tbElderlyImmediateFeeInfos.map(i=>{delete i.addtime; return i})}
			   	 }
			   	 let request = new Request(host.api+'/'+url, {
			        body: JSON.stringify(data),
			        method: 'POST',
			        headers: new Headers({
			          'Content-Type': 'application/json;charset=utf-8'
			        })
			      });
			      fetch(request).then(resp => resp.json()).then( res => {
			      	if(res.code===200){
						const args = {
							message:'成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
						});
						this.List()
				    }else{
				    	const args = {
							message:'失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
				    }
						 
			    })
			   	
			   }
			   
			}    
		});
	}
	remove = k => {
	    let { items } = this.state; 
	    let index = items.findIndex(i=>(i.key===k.key));
	    items.splice(index,1)
	    this.setState({items});
	};
	
	add = () => {
	    let {items} = this.state;
	    if(items.some(i=>(!i.itemName))){
	        message.error('项目名称不可为空')
	    }else{
	    	items.push({key:++key});
	        this.setState({items})
	    }
	    
	};
	
    changeItem=(k,v)=>{
        let { items } = this.state; 
	    let index = items.findIndex(i=>(i.key===k.key));
	    items.splice(index,1,{...k,...v});
	    let count = 0;
	    try{
	    	items.forEach(i=>{
	    		count += i.money;
	    	})
	    }catch(e){
	    	console.error(e)
	    }
	    this.setState({items,total:(+count).toFixed(1)});   
    }
    handlePrint =(r)=>{
      this.setState({printFlag:true,printData:r})
    }
    
    closePrint=()=>{
    	this.setState({printFlag:false,printData:{}})
    }
	render() {
		const {
			dataSource,
			modalFlag,
			items,
			total,
			elderlyId,
			printData,
			printFlag,
			st,
			et
		} = this.state;
		const { getFieldDecorator, getFieldValue } = this.props.form;
	    const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 4 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 20 },
	      },
	    };
	    const formItemLayoutWithOutLabel = {
		      wrapperCol: {
		        xs: { span: 24, offset: 0 },
		        sm: { span: 20, offset: 4 },
		      },
	    };
	    
	    
		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		}, {
			title: '结算单号',
			dataIndex: 'settlementNum',
			width: '7%'
		}, {
			title: '入住老人',
			dataIndex: 'tbElderlyInfo.name',
			width: '10%'
		}, {
			title: '房间号',
			dataIndex: 'tbElderlyInfo.roomName',
			width: '10%',
		}, {
			title: '结算金额',
			dataIndex: 'sumMoney',
			width: '7%'
		}, {
			title: '结算日期',
			dataIndex: 'settlementDate',
			width: '12%'
		},{
			title:'收款人',
			dataIndex:'payee',
			width:'10%'
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			render: (text, record) => {
				const action = record.settlementNum?<a href="javascript:;" onClick={()=>this.handlePrint(record)} style={{color:'#ffaa25'}}>单据</a>:<span>
				       <a href="javascript:;" onClick={()=>this.handlePrint(record)} style={{color:'#ffaa25'}}>单据</a>
				       <Divider type="vertical" />
		               <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
		               <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
		                <a href="javascript:;" style={{color:'#F00'}}>删除</a>
		              </Popconfirm>
		            </span> 
				return action
			},
		}];
		return(
			<div>
		        <BreadcrumbCustom first="财务管理" second='日常收费' />
		        <Card 
		          title="日常收费明细" 
		          bordered={false} 
		          extra={
		          	<span>
		          	 开始时间:&emsp;<DatePicker value={st} onChange={(v)=>this.changeTime('s',v)}/>&emsp;
		          	 结束时间:&emsp;<DatePicker value={et} onChange={(v)=>this.changeTime('e',v)}/>&emsp;
		          	 <Button type="primary" onClick={this.List} >搜索</Button>&emsp;
		          	 <Button type="primary" onClick={this.handleAdd} >新增</Button>
		          	</span>
		          }
		          
		        >
		        <Table 
		            size='small'
		            bordered
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
		          />
		        </Card>
		        <Modal 
		            title="日常收费输入"
		            width='600px'
		            okText='提交'
		            visible={modalFlag}
		            onOk={this.handleOk}
		            onCancel={()=>{this.handleCancel()}}
		            maskClosable={false}
		            key={elderlyId}
		          >
		            <Form>
		              <Form.Item
		                label='入住老人'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('elderlyId', {
		                  rules: [{ required: true, message: '请选择老人' }],
		                  initialValue:elderlyId,
		                })(
		                   <Elderlys  listStatus='1,2,3' />
		                )}
		              </Form.Item>
		              {
		              	items.map((k, index) => (
					      <Form.Item
					        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
					        label={index === 0 ? '收费项目' : ''}
					        required={false}
					        key={k.key}
					        style={{marginBottom:'4px'}}
					      >
					        <ItemInput value={k} onChange={(v)=>this.changeItem(k,v)} />
					        {items.length > 1 ? (
					          <Icon
					            className="dynamic-delete-button"
					            type="minus-circle-o"
					            onClick={() => this.remove(k)}
					          />
					        ) : null}
					      </Form.Item>
					    ))
		              }
				      <Form.Item {...formItemLayoutWithOutLabel}>
				          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
				            <Icon type="plus" /> add
				          </Button>
				      </Form.Item>
				      <Divider/>
				      <Form.Item>
				        <p style={{textAlign:'right'}}>合计:{total}</p>
				      </Form.Item>
				      <Form.Item
		                label='收费金额'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('sumMoney', {
		                  rules: [{ required: false, message: '' }],
		                  initialValue:'',
		                })(
		                   <Input />
		                )}
		              </Form.Item>
		            </Form>   
		        </Modal>
		        <PrintItem printFlag={printFlag} close={this.closePrint} printData={printData}/>
            </div>
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;