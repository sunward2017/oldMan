 import React, {Component} from 'react';
import { Table,Tag,Card, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,InputNumber,Row,Col} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';
import ElderlySelect from '@/common/elderlySelect'

const RadioGroup = Radio.Group;
const Option = Select.Option;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record: {},
			iconLoading:false,
			nursingItems:[],
			workers:[],
			elderlys:{},
			searchText:'',
			initData:[]
		}
	}
	
	componentDidMount() {
		this.fetchElderlys();
		this.fetchNursingItems();
		this.fetchWorkers();
		
	}
	
	fetchElderlys=()=>{
		httpServer.listElderlyInfo({
			 listStatus:"3,4",
			 launchFlag:0
		}).then(res => {
			let obj = {}
			if(res.code === 200 && res.data) {
				res.data.forEach(i=>{obj[i.id]=i.name})
			}
		    this.setState({elderlys:obj},()=>{
		    	 this.List();
		    })
		})
	}
	List=()=> {
		httpServer.listNursingItemRecoder().then(res => {
			if(res.code===200) {
			    const elderlys= this.state.elderlys;
				const data = res.data?res.data.filter(i=>(i.flag!==3)):[]
				this.setState({	dataSource:data,initData:data })
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
	
	handleAdd=()=>{
	   this.setState({modalFlag:true,record:{}}) 
	}
	
    handleOk=()=>{
    	 let _this = this;
    	 const auth = this.props.auth;
         this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
         	if(!err){
         		const worker = fieldsValue.workerName.split('&');
         		const item =  this.state.nursingItems.find(i=>(i.id==fieldsValue.itemCode))
         		var values = {
         			...fieldsValue,
         			itemName:item.name,
         			itemCode:item.itemCode,
         			money:item.price*fieldsValue['times'],
         			workerName:worker[1],
         			workerId:worker[0],
         			scheduledTime:fieldsValue['scheduledTime'].format('YYYY-MM-DD HH:mm:ss'),
         			optId:auth.id,
         			optName:auth.name,
         			price:item.price
         		}
         	
		        httpServer.saveNursingItemRecoder(values).then(res=>{
		         	if(res.code===200){
				     	const args = {
					          message: '成功',
					          description: '添加成功',
					          duration: 2,
					    };
					    notification.success(args);
				    }else{
			     	  	const args = {
					        message: '失败',
					        description: '添加检查项发生错误',
					        duration: 2,
					    };
					    notification.error(args);
			     	}
				    _this.setState({modalFlag:false},function(){
				    	_this.List();
				    })
		         }) 
	        }
        })	
    }
    
    handleCancel=()=>{
    	this.setState({modalFlag:false,record:{}})
    }
    
    handleModify=(r)=>{
    	this.setState({record:r,modalFlag:true})
    }
    
    handleRowDelete=(id)=>{
    	httpServer.deleteNursingItemRecoder({id}).then(res=>{
    		 
    		if(res.code===200){
    			const args = {
				          message: '成功',
				          description:res.msg,
				          duration: 2,
				    };
				    notification.success(args);
    		}else{
    		   const args = {
				        message: '失败',
				        description: '发生错误',
				        duration: 2,
				    };
				    notification.error(args);	
    		}
    		this.List()
    	})
    } 
    
	fetchNursingItems=()=>{
	    const pid = this.props.auth.deptId;
	    httpServer.listCheckItemChild({pid}).then(res => {
	        if(res.code===200){	
	            this.setState({nursingItems:res.data||[]});
	        }else {
	           const args = {
	            message: '通信失败',
	            description: '获取检查项错误',
	            duration: 2,
	          };
	          notification.error(args);
	          this.setState({nursingItems:[]}); 
	        }
	    }).catch((error)=>{
	      console.log(error);
	    });
	}
	
	fetchWorkers=()=>{
	  	httpServer.listWorkerInfo().then((res)=>{
	  		 if (res.code === 200) {
	            res.data?this.setState({workers:res.data}):this.setState({workers:[]});
	        }else {
	           const args = {
	            message: '通信失败',
	            description: '获取护工错误',
	            duration: 2,
	          };
	          notification.error(args);
	        }
	  	})
	}
	handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
	handleSearchElderly=()=>{
          const { searchText } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.initData.filter((record) =>record.tbElderlyInfo&&record.tbElderlyInfo.name.match(reg));
	      this.setState({dataSource:data});
	    }else{ 
	       const {initData } = this.state;
	       this.setState({dataSource:initData})
	    }
    }
	

	render() {
		const {	getFieldDecorator } = this.props.form;
		const { dataSource,modalFlag,nursingItems,workers} = this.state;
		const {elderlyId,itemCode,times,scheduledTime,workerName,meno} = this.state.record;
		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 4
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 20
				},
			},
		};

		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};

		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		},{
			title:'护理老人',
			dataIndex:'tbElderlyInfo.name',
			width:'7%',
		},{
			title: '护理项目',
			dataIndex: 'itemName',
			key: 'itemName',
			width: '10%',
			render:(t,r)=>{
				return t?t:'等级护理'
			}
		},{
			title: '单价',
			dataIndex: 'price',
			key: 'price',
            width: '5%',
		},{
			title:'次数',
			dataIndex:'times',
			width:'5%'
		},{
			title: '总价',
			dataIndex: 'money',
			key: 'money',
            width: '5%',
		},{
			title: '护工',
			dataIndex: 'workerName',
			key: 'workerName',
			 width: '6%',
		},{
			title: '计划日期',
			dataIndex: 'scheduledTime',
			key: 'scheduledTime',
			width: '10%', 
		}, {
			title: '执行情况',
			dataIndex: 'overFlag',
			key: 'overFlag',
			width:'5%',
			render:(t,r)=>{
				return t===1? <Tag color="#87d068">已完成</Tag>: <Tag color="#f50">未完成</Tag>
			}
		},{
			title: '执行日期',
			dataIndex: 'nursingTime',
			key: 'nursingTime',
			width:'10%'
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			align:'center',
			render: (text, record) => {
				return(
					record.overFlag===1?null:
					<span>
		              <Popconfirm title="确定取消?" onConfirm={() => this.handleRowDelete(record.id)}>
		                 <Button icon="delete" type="primary" title="取消" size="small"></Button>
		              </Popconfirm>
		            </span>
				)
			},
		}];
		return(
			<div>
		        <BreadcrumbCustom first="医护管理" second='护理计划' />
		        <Card 
		          title="计划详情" 
		          bordered={false} 
		          extra={<Row style={{minWidth:300}} gutter={16}> 
		                  <Col span={16}>
			          	  <Input.Group compact>
				            <Input   placeholder="搜索老人"  onChange={this.handleInputChange} style={{width:'80%'}}/>
				            <Button type="primary" icon="search"   onClick={this.handleSearchElderly}></Button>
				          </Input.Group>
				          </Col>
				          <Col span={8}>
		          	      <Button type="primary" onClick={this.handleAdd}  style={{float:'right'}}>制定计划</Button>
		          	      </Col>
		          	    </Row>}
		          activeTabKey={this.state.tabKey}
		        >
		          <Table 
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
		          />
		        </Card>
		        
		        <Modal
		          key={modalFlag}
		          title="护理项目"
		          visible={modalFlag}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        > 
		          <Form className="ant-advanced-search-form" hideRequiredMark>
				        <Form.Item
			                label='老人姓名'
			                {...formItemLayout}
			                style={{marginBottom:'4px'}}
			            >
			                 {
			                  getFieldDecorator('elderlyId', {
			                    rules: [{ required: true, message: '请选择老人'}],
			                    initialValue:elderlyId
			                  })(
			                   <ElderlySelect listStatus="3" onChange={ this.elderlyChange }/>
			                  )
			                }
			              </Form.Item>
					      <Form.Item label="护理项"  {...formItemLayout}>
					         {getFieldDecorator('itemCode', {
			                  rules: [{ required: true, message: '不可为空' }],
			                  initialValue:itemCode,
			               })(
							<Select laceholder="请选择检查项" style={{ width:"100%" }}>
								{
								    nursingItems.map(item=>(
								        <Option key={item.id}>
									        {`${item.name}_${item.price}元/次`}
									    </Option>
								    ))
								}
							</Select>
					    )}    
					    </Form.Item>
		                <Form.Item label="护理次数"  {...formItemLayout}>
		                  {getFieldDecorator('times', {
			              	rules: [{ required: true, message: '次数不可为空' }],
			              	initialValue:times,
			              })( 
				               <InputNumber  min={1} max={10}  style={{ width:"100%" }}/>
				            )}
				        </Form.Item>  
				        <Form.Item label="护理时间"  {...formItemLayout}>
					        {getFieldDecorator('scheduledTime', {
				              rules: [{ required: true, message: '不可为空' }],
				              initialValue:scheduledTime?moment(scheduledTime):moment(),
			                })(
				              <DatePicker showTime style={{width:'100%'}}/>
			            )}	        
				        </Form.Item>
					    <Form.Item label="指派护工"  {...formItemLayout}>
					         {getFieldDecorator('workerName', {
			                  rules: [{ required: true, message: '护工不可为空' }],
			                  initialValue:workerName,
				             })(
							    <Select placeholder="请选择护工" style={{ width:"100%" }}>
								    {
									    workers.map(item=>(
										    <Option key={item.id} value={`${item.workerId}&${item.workerName}`}>
											    {item.workerName}
											</Option>
										))
								    }
								</Select>
						      )}    
						</Form.Item>
					    <Form.Item label="&emsp;&emsp;备注"  {...formItemLayout}>
			                {getFieldDecorator('meno', {
				              	rules: [{ required: false, message: '检查次数不可为空' }],
				              	initialValue:meno,
				              })(
					               <Input/>
					            )}
			            </Form.Item>  
		            </Form>
		        </Modal>
            </div>
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;