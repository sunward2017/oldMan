import React, {
	Component,
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,Row,Col} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';
import ElderlySelect from '@/common/elderlySelect';
import Visited from '@/common/visited'

const {Search} = Input;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const  Option  = Select.Option;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			filterData:[],
			modalFlag: false,
			record: '',
			elderlys:{},
			workers:[],
			examines:[],
			examine:{},
			loading:false,
			rebackFlag:false,
			clearDays:0,
			startTime:moment(),
		}
	}
	componentDidMount() {
	  const customerId = this.props.auth.customerId;
	  this.listByElderly() ;
	  this.listByWorker(customerId);
	  this.listByExamine(customerId)
	}
	componentWillUnmount(){
		this.setState = (state,callback)=>{
          return;
       }
	}
	 
	List() {
		httpServer.listAskForLeave().then(res => {
			const {elderlys} = this.state;
			if(res.code===200&&res.data) {
				this.setState({
					dataSource: res.data.map(i=>({...i,name:elderlys[i.elderlyId]?elderlys[i.elderlyId].name:''})),
					filterData: res.data.map(i=>({...i,name:elderlys[i.elderlyId]?elderlys[i.elderlyId].name:''})),
				})
			}else{
				this.setState({dataSource:[],filterData:[]})
			}
		})
	}
	listByElderly=()=>{
	  	 const {customerId} = this.props.auth;
	  	 httpServer.listElderlyInfo({listStatus:"0,1,2,3,4",customerId}).then((res) => {
			      if (res.code === 200) {
			         if(res.data){
			         	 let obj = {};
			         	 res.data.map(item=>{
			         	 	 obj[item.id]= item;
			         	 })
			         	 this.setState({elderlys:obj},function(){
			         	 	  this.List();
			         	 })
			         }
			      } else {
			        if(res.message ==='Request failed with status code 500'){
			            console.log(res.message);
			         }else{
			             const args = {
			            message: '提示',
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
	listByWorker=(customerId)=>{
	   	httpServer.listWorkerInfo({customerId}).then(res=>{
	   		if(res.code===200&&res.data) {
				this.setState({
					workers: res.data.map(item=>({workerId:item.workerId,workerName:item.workerName}))
				})
			}else{
				this.setState({workers:[]})
			}
	   	})
	}
	
	listByExamine=(customerId)=>{
        const pid = this.props.auth.deptId;
	        httpServer.listCheckItemChild({pid}).then(res => {
	        if(res.code===200){	
	            this.setState({examines:res.data||[]});
	        }else {
	           const args = {
	            message: '通信失败',
	            description: '获取护理项发生错误',
	            duration: 2,
	          };
	          this.setState({examines:[]});
	          notification.error(args);
	        }
	    }).catch((error)=>{
	      console.log(error);
	    });
	}

	/*修改操作*/
	handleModify(record) {
		this.setState({
			modalFlag: true,
			record,
			examine:{price:record.price}
		});
	}
	handleReback(record){
		this.setState({
		  rebackFlag:true,
		  record,
		  examine:{price:record.price},
		  clearDays:record.days
		})
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteAskForLeave({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '通信成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      } else {
	        console.log(res.message);
	      }
	      this.setState({modalFlag:false,record:''});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd() {
		this.setState({
			modalFlag: true,
			record: '',
			examine:{}
		});
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false,
			rebackFlag: false,
			record: ''
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		this.setState({ loading: true });
		e.preventDefault();
		let _this = this;
		 _this.props.form.validateFieldsAndScroll({force:true},(err,fieldsValue) => {
			if(!err) {
			 this.setState({ loading: false });
			  const wokerName =fieldsValue.workerId?this.state.workers.find(i=>(i.workerId===fieldsValue.workerId)).workerName:'';
			  const {price} = this.state.examine
			  const opt = this.props.auth;
			  const values={
			  	...fieldsValue,
			  	'startTime':fieldsValue['startTime'].format('YYYY-MM-DD'+' 00:00:00'),
			  	'endTime':fieldsValue['endTime'].format('YYYY-MM-DD'+' 00:00:00'),
			  	wokerName,
			  	price,
			    optId:opt.id,
			    optName:opt.name,
			  };
			  values.days = moment(values.endTime).diff(moment(values.startTime),'days');
			  const { id }= this.state.record;
          if(id){
          values.id = id;
					httpServer.updateAskForLeave(values).then((res)=>{
			   	    	const args = {
							message: '提示',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: ''
						});
						_this.List()
			   	    })
			   }else{
			   	   httpServer.saveAskForLeave(values).then((res) => {
						const args = {
							message: '提示',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: ''
						});
						_this.List()
					})
			   	    
			   }

			}else{
				this.setState({ loading: false });
			}
		  });
		 
	}
	handleRebackSubmit=(e)=>{
		this.setState({ loading: true });
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
			   this.setState({ loading: false })
			   const values = {
			   	  ...this.state.record,
			   	  'returnTime':fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss'),
			   	   clearDays:this.state.clearDays
			   }
		       httpServer.returnAskForLeave(values).then((res)=>{
		       	  if(res.code===200){
		       	  	const args = {
						message: '提示',
						description: '保存成功',
						duration: 2,
					};
					notification.success(args);
		       	  }else{
		       	  	const args = {
						message: '提示',
						description: '保存失败',
						duration: 2,
					};
					notification.error(args);  
		       	  }
		       	  this.List();
				  this.setState({rebackFlag:false})						
			   	})
			}else{
				this.setState({ loading: false });
			}
		});
	}
    validateIdentityCard(rule,value,callback){
    	if(value&&!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/).test(value)){
    		callback('身份证输入错误')
    	}else{
    		callback()
    	}
    }
	/*自定义手机号校验*/
	validatePhoneNumber(rule, value, callback) {
		if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
			callback('手机号码格式不正确');
		} else {
			callback();
		}
	}
    
    disabledEndDate=(current)=>{
       const startTime = this.state.startTime;
       return current < moment(startTime).endOf('day');
    }
    disabledRabackDate=(current)=>{
    	const startTime = this.state.record.startTime;
    	return current < moment(startTime).endOf('day');
    }
    startChange=(v)=>{
    	if(v){
    	   this.setState({
    		 startTime:v
    	   })
    	}
    }
    handleExamine=(v)=>{
       const examine = this.state.examines.find(i=>(i.itemCode===v));
       this.setState({examine})
    }
    rebackChange=(v)=>{
    	if(v){
    	  const clearDays = v.diff(moment(this.state.record.startTime),'days');
    	 this.setState({clearDays})	
    	}
    }
    changeState=(e)=>{
    	const {dataSource} = this.state;
    	let filterData=[];
    	switch(e.target.value){
    		case '2':   filterData = dataSource.filter(i=>(!i.returnTime));this.setState({filterData}); break
    		case '3':   filterData = dataSource.filter(i=>i.returnTime);this.setState({filterData});break
    		default: this.setState({filterData:dataSource});
    	}
    }
    handleSearchElderly=(v)=>{
        if(v&&v!==""){
	      const reg = new RegExp(v, 'gi');
	      const data = this.state.dataSource.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        filterData:data,
	      });
	    }else{
	       const {dataSource} = this.state;
	       this.setState({filterData:dataSource})
	    } 
    }
    
	render() {
		const {
			getFieldDecorator,
			getFieldValue,
		} = this.props.form;
		const {
			filterData,
			modalFlag,
			workers,
			examines,
			examine,
			clearDays,
			rebackFlag,
			elderlys,
		} = this.state;
		const {
			  accompanyId,
              accompanyName, 
              address, 
              days,
              elderlyId,
              endTime,
              memo,
              phone,
              relation,
              sex,
              startTime,
              workerId,
              itemCode,
              returnTime
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
					span: 4,
					offset: 20,
				},
			},
		};

		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width:80,
			key:'index',
			align:'center'
		},{
	      title: '外出老人',
	      dataIndex: 'name',
	      width:130,
	      align:'center',
	    },{
			title:'外出日期',
			dataIndex:'startTime',
			key:'startTime',
			width:150,
			align:'center',
			render(text,r){
				return text.substr(0,10);
			},
			defaultSortOrder: 'ascend',
			sorter: (a, b) =>{return moment(a.startTime).isBefore(b.startTime)?1:-1},
		},{
			title:'归还日期',
			dataIndex:'endTime',
			key:'endTime',
			align:'center',
			width:150,
			render(text,r){
				return text.split(' ')[0];
			}
		},{
			title:'实际归还日期',
			dataIndex:'returnTime',
			key:'returnTime',
			width:130,
			align:'center',
			render(text,r){
				return text&&text.split(' ')[0];
			},
			defaultSortOrder: 'ascend',
			sorter: (a, b) =>{return moment(a.returnTime).isBefore(b.returnTime)?1:-1},
		},{
			title:'外出天数',
			dataIndex:'clearDays',
			key:'clearDays',
			width:120,
			align:'center',
			align:'center'
		},{
			title: '备注',
			dataIndex: 'memo',
			key:"memo",
			align:'center',
            width:150
		},{
			title: '陪同人',
			dataIndex: 'accompanyName',
			key: 'accompanyName',
		    align:'center',	
			width:100
		},{
			title: '与老人关系',
			dataIndex: 'relation',
			key: 'relation',
			align:'center',
			width: 130,
			render(text){
			   switch(text){
			   	 case '1': return <Tag  color="volcano" >配偶</Tag>;  
			   	 case '2': return <Tag  color="orange">子女</Tag>; break;	
			   	 case '3': return <Tag  color="gold">祖孙</Tag>; break;	
			   	 case '4': return <Tag  color="geekblue">兄弟姐妹</Tag>; break;	
			   	 case '5': return <Tag  color="green">侄子/侄女/外甥/外甥女</Tag>; break;	
			   	 default: return <Tag  color="cyan">其他</Tag>
			   }
			   
			}
		}, {
			title: '联系方式',
			dataIndex: 'phone',
			key: 'phone',
			align:'center',
			 
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: 250,
			align:'center',
		    fixed: 'right',
		    filters: [
			      {
			        text: '已归',
			        value: '1',
			      },
			      {
			        text: '未归',
			        value: '2',
			      },
			    ],
			filterMultiple: false,
			onFilter: (value, record) =>value==1?record['returnTime']:!record['returnTime'], 
			render: (text, record) => {
				const {elderlys} = this.state;
				return(<span>
				{record.returnTime?null:
				  <span>
					  <Button type="primary" title="修改" size="small" icon="edit" onClick={() => { this.handleModify(record) }}></Button>
		              <Divider type="vertical" />
		              
		              </span>
					}
				  <Button type="primary" title="回归" size="small" icon="bank" onClick={() => { this.handleReback(record) }}></Button>
	              <Divider type="vertical" />
	              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
	                <Button type="primary" title="删除" size="small" icon="delete"></Button>
	              </Popconfirm>
	              <Divider type="vertical" />
	              <Visited  record={record} elderlyName={elderlys[record.elderlyId].name}/>
	            </span>)
			}
		}];
		return(
	    <div>
            <BreadcrumbCustom first="老人管理" second='外出管理'/>
            <Card 
		        title="外出记录" 
		        bordered={false} 
		        extra={<div>
		                   <Search
					         placeholder="请输入老人姓名"
			  		         onSearch={this.handleSearchElderly}
				   	         enterButton
					 	     style={{ width: 200 }}
						   />&emsp;
				      	    <Button type="primary" onClick={()=>{this.handleAdd()}} icon="plus" ></Button>  	 
			        	</div>
			        }
		          >
		          <Table 
		            size="middle"
		            scroll={{ x: 1500}}
		            rowKey='id' 
		            dataSource={filterData} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
		          />
            </Card>
        {
          modalFlag?
          <Modal 
            title="请假外出"
            width='50%'
            okText='提交'
            visible={modalFlag}
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >  
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item
                label='外出老人'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('elderlyId', {
                  rules: [{ required: true, message: '请选择老人' }],
                  initialValue:elderlyId,
                })(
                   <ElderlySelect listStatus="3"/>
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_姓名'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('accompanyName', {
                  rules: [{ required: true, message: '请输入陪同人员!' }],
                  initialValue:accompanyName,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_身份证号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('accompanyId', {
                  rules: [{ required: false, message: '请输入身份证号!' },{validator:this.validateIdentityCard}],
                  initialValue:accompanyId
                })(
                  <Input/>
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_性别'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('sex', {
                  rules: [{ required: true, message: '请选择!' }],
                  initialValue:sex,
                })(
                  <RadioGroup>
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_关系'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('relation', {
                  rules: [{ required: true, message: '请选择与老人的关系!' }],
                  initialValue:relation,
                })(
                  <RadioGroup buttonStyle="solid">
                    <Radio.Button value='1'>配偶</Radio.Button>
                    <Radio.Button value='2'>子女</Radio.Button>
                    <Radio.Button value='3'>祖孙</Radio.Button>
                    <Radio.Button value='4'>兄弟姐妹</Radio.Button>
                    <Radio.Button value='5'>侄子/侄女/外甥/外甥女</Radio.Button>
                    <Radio.Button value='6'>其他</Radio.Button>
                  </RadioGroup>
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_电话'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: '请输入电话号码!' },{
                    validator:this.validatePhoneNumber,
                  }],
                  initialValue:phone,
                })(
                  <Input />
                )}
              </Form.Item> 
              <Form.Item
                label='外出开始日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('startTime', {
                  rules: [{ required: true, message: '请选择日期!' }],
                  initialValue:startTime?moment(startTime,'YYYY-MM-DD') : moment(),
                })(
                  <DatePicker onChange={this.startChange}/>
                )}
              </Form.Item>
             
              <Form.Item
                label='外出结束日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('endTime', {
                  rules: [{ required: true, message: '请选择日期'},{
                  	    validator:(rule, value, callback) => {
                  	       const sdate = getFieldValue('startTime');				                
			             if (!value||moment(sdate).isBefore(moment(value))) {
			                callback();
			             } else {
			                callback('结束日期不可小于开始日期');
			             }   
			            }
                  }],
                  initialValue:endTime?moment(endTime,'YYYY-MM-DD') : moment().add(1, 'day')
                })(
                  <DatePicker />
                )}
              </Form.Item>
              <Form.Item
                label='陪同人_联系地址'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('address', {
                  rules: [{ required:true, message: '请输入联系地址' }],
                  initialValue:address,
                })(
                   <TextArea rows={2}/> 
                )}
              </Form.Item>
              
              <Form.Item
                label='备注说明'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('memo', {
                  rules: [{ required: false, message: '请输入需要备注的消息!' }],
                  initialValue:memo,
                })(
                  <Input/>
                )}
              </Form.Item>
              <Form.Item
		          {...formItemLayout}
		          label="护工"
		        >
		          {getFieldDecorator('workerId', {
		            rules: [
		              { required: false, message: 'Please select your country!' },
		            ],
		             initialValue:workerId,
		          })(
		            <Select placeholder="请选择护理人">
		                {
		                	workers.map((w,index)=>(<Option key={index} value={w.workerId}>{w.workerName}</Option>))
		                }
		            </Select>
		          )}
		       </Form.Item>
		       <Form.Item
		          {...formItemLayout}
		          label="护理项目"
		        >
		          {getFieldDecorator('itemCode', {
		            rules: [
		              { required: false, message: '护理服务' },
		            ],
		             initialValue:itemCode,
		          })(
		            <Select placeholder="需要的服务" onChange={this.handleExamine}>
		              {
		              	 examines.map((n,index)=>(<Option key={index} value={n.itemCode}>{n.name}</Option>))
		              }
		            </Select>
		          )}
		      </Form.Item>
		      <Form.Item
		        {...formItemLayout}
		        label="价格"
		      >
		        <span style={{fontWeight:'bold'}}>&emsp;{examine.price||0}&emsp;</span>元
		      </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={this.state.loading}>确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
        {
          rebackFlag?
            <Modal 
            title="回归处理"
            //width='60%'
            okText='提交'
            visible={rebackFlag}
            maskClosable={false}
            footer={null}
            onCancel={()=>{this.handleCancel()}}
          >  
            <Form hideRequiredMark onSubmit={this.handleRebackSubmit}>
              <Form.Item
                label='外出老人'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                <Input defaultValue={elderlys[elderlyId]?elderlys[elderlyId].name:'已出院或已删除'} disabled/>
              </Form.Item>
              <Form.Item
                label='陪同人_姓名'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                <Input defaultValue={accompanyName} disabled/>
              </Form.Item>
              <Form.Item
                label='外出开始日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                <Input defaultValue={startTime} disabled />
              </Form.Item>
             
              <Form.Item
                label='外出结束日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              > 
                <Input defaultValue={endTime} disabled />
              </Form.Item>
              <Form.Item
                label='回归日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('endTime', {
                  rules: [{ required: true, message: '请选择日期!' },{
                  	    validator:(rule, value, callback) => {
			             if (!value||moment(startTime).isBefore(moment(value))) {
			                callback();
			             } else {
			                callback('回归日期不可小于开始日期');
			             }   
			            }
                  }],
                  initialValue:returnTime?moment(returnTime,'YYYY-MM-DD'):null,
                })(
                  <DatePicker format="YYYY-MM-DD"   onChange={this.rebackChange}/>
                )}
              </Form.Item>
              <Form.Item
		        {...formItemLayout}
		        label="外出天数"
		      >
		        <span style={{fontWeight:'bold'}}>&emsp;{clearDays}&emsp;</span>天
		      </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={this.state.loading}>确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
      </div>
		)
	}
}
const Worker = Form.create()(CMT);
export default Worker;