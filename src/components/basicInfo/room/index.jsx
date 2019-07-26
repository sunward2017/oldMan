import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,Row,Col, Icon,InputNumber } from 'antd';
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios';
import Area from '../area'
import BedForm from './bedForm'
 
const RadioGroup = Radio.Group;
class roomConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag:'',
			record: '',
			customerId: '',
			customers: [],
			areaId:'',
			record1:{},
			bedInfo:[],
			editFlag:false,
			room:{}
		}
	}

	componentDidMount() {
	   const {customerId} = this.props.auth;
	   this.setState({customerId})
	}
	componentWillUnmount(){
		this.setState = (state,callback)=>{
          return;
       }
	}
	List() {
		const areaId  = this.state.areaId;
		httpServer.listRoomInfo({areaId}).then(res => {
			if(res.data) {
				this.setState({
					dataSource: res.data
				})
			}else{
				this.setState({
					dataSource: []
				})
			}
		})
	}
	/*修改操作*/
	handleModify(record) {
		this.setState({
			modalFlag: 'add',
			record
		});
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteRoomInfo({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      } else {
	        const args = {
	          message: '失败',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.error(args);
	      }
	      this.setState({modalFlag:'',record:''});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd() {
		if(!this.state.areaId){
		   const args = {
			      message: '提示',
				  description:'你没有选择区域或不是节点目录',
				  duration: 2,
				};
		        notification.info(args);				
		}else{
			this.setState({
				modalFlag: "add",
				record: ''
			});
		}
		
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: '',
			record: ''
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				const values = {
					...fieldsValue,
					'areaId':this.state.areaId,
					'customerId': this.state.customerId
				};
			  const { id }= this.state.record;
			  
              if(id){
              	    values.id = id;
					httpServer.updateRoomInfo(values).then((res)=>{
			   	    	if(res.code===200){
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: '',
							record: ''
						});
						_this.List()
					}else{
						const args = {
							message: '通信失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
					}
					_this.List() 
			   	    })
			   }else{
			   	   httpServer.saveRoomInfo(values).then((res) => {
			   	   	if(res.code===200){
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: '',
							record: ''
						});
						_this.List()
					}else{
						const args = {
							message: '通信失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
					}
					_this.List()
					})
			   	    
			   }

			}
		});
	}
	onClick=(id)=>{
		if(!id)return;
		this.setState({areaId:id},()=>{
			this.List()
		})
	}
    handleBatchAdd=()=>{
        if(!this.state.areaId){
		   const args = {
			      message: '提示',
				  description:'你没有选择区域或不是节点目录',
				  duration: 2,
				};
		        notification.info(args);				
		}else{
		  this.setState({modalFlag:'batchAdd',record1:{}})	 
		}
    }
    handleBatchSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				const values = {
					...fieldsValue,
					'areaId':this.state.areaId,
					'customerId': this.state.customerId
				};
			    httpServer.saveBatchRoomInfo(values).then(res=>{
				   if(res.code===200){
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: '',
							record: ''
						});
						_this.List()
					}else{
						const args = {
							message: '通信失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
					}
					_this.List()
				})	
			}
			    
		})
	}	
	handleModifyBed=(r)=>{
	   this.setState({editFlag:true,room:r})
	}
	close=()=>{
		this.setState({editFlag:false})
	}
	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag,
			customers,
			customerId,
			bedInfo,
			editFlag,
			room
		} = this.state;
		const {
			areaId,
			roomCode,
			roomName,
			bedNumber,
			status,
			money,
			id
		} = this.state.record;
		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 6
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 18
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
		},  {
			title: '房间号',
			dataIndex: 'roomCode',
			key: 'roomCode',
			width: '5%'
		}, {
			title: '房间名称',
			dataIndex: 'roomName',
			key: 'roomName',
			width: '10%'
		}, {
			title:'房间床位数',
			dataIndex:'bedNumber',
			key:'bedNumber',
			width:'10%'
		}, {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				return record.status === 1 ? < Tag color = "green" > 正常 < /Tag>:<Tag color="red">注销</Tag >
			},
			width: '5%'
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			align:'center',
			render: (text, record) => {
				return(
					<span>
			              <Button size="small" icon="edit" title="编辑" type="primary" onClick={() => { this.handleModify(record) }}></Button>
			              <Divider type="vertical" />
			              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
			                 <Button size="small" icon="delete" title="删除" type="primary" ></Button>
			              </Popconfirm>
			              <Divider type="vertical" />
			              <Button icon="box-plot" title="床位编辑" size="small" type="primary" onClick={() => { this.handleModifyBed(record) }}></Button>
			        </span>
				)
			},
		}];
		return(
			<div>
		        <BreadcrumbCustom first="基础信息" second='房间管理' />
        		<Card 
			          title="房间信息"
			          bordered={false} 
			          extra={<span><Button type='primary' onClick={()=>{this.handleAdd()}}>添加</Button><Button type='primary' onClick={()=>{this.handleBatchAdd()}}>批量添加</Button></span>}
			        >
	        		<Row>
	           			<Col span={4}>
	                     <Area customer={customerId} onClick={this.onClick}/> 
						</Col>
			           <Col span={20} style={{padding:'0 0 0 20px'}}>
			                <Table 
					         
					            rowKey='id' 
					            dataSource={dataSource} 
					            columns={columns} 
					            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
					          />
			           </Col>
	                </Row>
                </Card>
		        {
		          modalFlag==='add'?
		          <Modal 
		            title="房间信息输入"
		            // width='60%'
		            okText='提交'
		            visible={true}
		           
		            onCancel={()=>{this.handleCancel()}}
		            maskClosable={false}
		            footer={null}
		          >
		            <Form hideRequiredMark onSubmit={this.handleSubmit}>
		              <Form.Item
		                label='房间号'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('roomCode', {
		                  rules: [{ required: true, message: '请输入房间号' }],
		                  initialValue:roomCode
		                })(
		                  <Input/>
		                )}
		              </Form.Item>
		              <Form.Item
		                label='房间名称'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('roomName', {
		                  rules: [{ required: true, message: '请输入房间名称' }],
		                  initialValue:roomName,
		                })(
		                  <Input />
		                )}
		              </Form.Item>
		              { id?null:<Fragment>
		              <Form.Item
		                label='床位数'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('beds', {
		                  rules: [{ required: true, message: '请输入床位数!' }],
		                  initialValue:bedNumber,
		                })(
		                  <InputNumber min={1} max={5}/>
		                )}
		              </Form.Item>
		              
		              	<Form.Item
		                label='价格'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('money', {
		                  rules: [{ required: true, message: '请输入床位价格' }],
		                  initialValue:money,
		                })(
		                  <InputNumber min={1}/>
		                )}
		              </Form.Item>
		              </Fragment>
		              }
		              <Form.Item
		                label='状态'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('status', {
		                  rules: [{ required: true, message: '请选择状态!' }],
		                  initialValue:status,
		                })(
		                  <RadioGroup>
		                    <Radio value={1}>正常</Radio>
		                    <Radio value={0}>注销</Radio>
		                  </RadioGroup>
		                )}
		              </Form.Item>
		              <Form.Item {...tailFormItemLayout}>
		                <Button type="primary" htmlType="submit">确认提交</Button>
		              </Form.Item>
		            </Form>
		          </Modal>:null}
		        {modalFlag==="batchAdd"?
		          <Modal 
		            title="房间批量输入"
		            // width='60%'
		            okText='提交'
		            visible={true}
		            onCancel={()=>{this.handleCancel()}}
		            maskClosable={false}
		            footer={null}
		          >
		            <Form hideRequiredMark onSubmit={this.handleBatchSubmit}>
		               <Form.Item
					      label="所在楼层"
					       {...formItemLayout}
					      style={{ marginBottom: 0 }}
					    >
					      <Form.Item
					        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
					      >
					        {getFieldDecorator('floor1', {
			                  rules: [{ required: true, message: '请输入开始楼层' }],
			                   
			                })(
			                  <InputNumber min={1}/>
			                )}  
					      </Form.Item>
					      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
					        -
					      </span>
					      <Form.Item
					        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
					      >
					        {getFieldDecorator('floor2', {
			                  rules: [{ required: true, message: '请输结束楼层' }],
			                  
			                })(
			                  <InputNumber min={1}/>
			                )}  
					      </Form.Item>
					    </Form.Item> 
					    <Form.Item
					      label="楼层房间号"
					       {...formItemLayout}
					      style={{ marginBottom: 0 }}
					    >
					      <Form.Item
					        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
					      >
					        {getFieldDecorator('roomCode1', {
			                  rules: [{ required: true, message: '请输入开始房间号' }],
			                 
			                })(
			                  <InputNumber min={0}/>
			                )}  
					      </Form.Item>
					      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
					        -
					      </span>
					      <Form.Item
					        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
					      >
					        {getFieldDecorator('roomCode2', {
			                  rules: [{ required: true, message: '请输入结束房间号' }],
			                 
			                })(
			                  <InputNumber min={1} max={100}/>
			                )}
					      </Form.Item>
					    </Form.Item>
		              <Form.Item
		                label='床位数'
		                {...formItemLayout}
		                style={{marginBottom:'10px'}}
		              >
		                {getFieldDecorator('beds', {
		                  rules: [{ required: true, message: '请输入床位数' }],
		                  
		                })(
		                  <InputNumber min={1} max={5}/>
		                )}
		              </Form.Item>
		              <Form.Item
		                label='床位价格'
		                {...formItemLayout}
		                style={{marginBottom:'10px'}}
		              >
		                {getFieldDecorator('money', {
		                  rules: [{ required: true, message: '请输入床位价格' }],
		                   
		                })(
		                  <InputNumber min={1}/>
		                )}
		              </Form.Item>
		               
		              <Form.Item {...tailFormItemLayout}>
		                <Button type="primary" htmlType="submit">确认提交</Button>
		              </Form.Item>
		            </Form>
		          </Modal>:null
		        }
		        <BedForm key={editFlag}  room={room} editFlag={editFlag} close={this.close} />
            </div>
		)
	}
}
const Room = Form.create()(roomConfig);
export default Room;