import React, {
	Component,
	Fragment
} from 'react';
import { Table,Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,Checkbox} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record: {},
			iconLoading:false,
			customerId:'',
			operator:'',
		}
	}
	
	componentDidMount() {
		const auth = JSON.parse(sessionStorage.getItem('auth'));
		 
		this.setState({customerId:auth.customerId,operator:auth.account},function(){
			this.List()
		})
	}
	changeType=(e)=>{
		if(e.target.value===1){
			const record = {...this.state.record,point:0,days:0,type:e.target.value};
			this.setState({record})
		}else{
			const record = {...this.state.record,type:e.target.value}
			this.setState({record})
		}
	}
	List() {
		const customerId = this.state.customerId;
		httpServer.listDrugTemplate({customerId}).then(res => {
			if(res.code===200) {
				this.setState({
					dataSource: res.data?res.data:[]
				})
			}else{
				console.log(res)
			}
		})
	}
	 
	/*修改操作*/
	handleModify(record) {
		this.setState({
			modalFlag: true,
			record
		});
		
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteDrugTemplate({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '通信成功',
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
	      this.setState({modalFlag:false,record:{}});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd=()=>{
		this.setState({
			modalFlag: true,
			record: {}
		});
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false,
			record: ''
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
//		this.setState({ iconLoading: true });
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				const values = {
					...fieldsValue,
					'customerId': this.state.customerId,
					'operator':this.state.operator,
				};
			  if(values.type==2){
			  	values.point = values.point.join(',')
			  }
			  const { id }= this.state.record;
              if(id){
              	    values.id = id;
					httpServer.updateDrugTemplate(values).then((res)=>{
			   	    	console.log(res);
			   	    	const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: '',
							iconLoading:false,
						});
						_this.List()
			   	    })
			   }else{
			   	   httpServer.saveDrugTemplate(values).then((res) => {
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: '',
							iconLoading:false,
						});
						_this.List()
					})
			   	    
			   }

			}
		});
	}

	 

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag,
		} = this.state;
		const {
			days,
			describes,
            hint,
            longTime,
            name,
            orderId,
            point,
            remindTemplate,
            templateCode,
            type,
            uid,
            voiceTemplate,
		} = this.state.record;
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
        const plainOptions = ['早饭前', '早饭后', '午饭前','午饭后','晚饭前','晚饭后','临睡前'];
		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		}, {
			title: '模板名称',
			dataIndex: 'name',
			key: 'name',
			width: '10%'
		}, {
			title: '排序号',
			dataIndex: 'orderId',
			key: 'orderId',
			width: '10%'
		}, {
			title:'类型',
			dataIndex:'type',
			key:'type',
			width:'8%',
			render: text => {
			 switch(text){
			   	 case 2: return <Tag color ="cyan">按日</Tag>;  
			   	 case 3: return <Tag color = "#2db7f5">按周</Tag>; break;	
			   	 case 4: return <Tag color = "#87d068">按月</Tag>; break;	
			   	 default: return <Tag color = "#108ee9">按需</Tag>
			  }
			}
		}, {
			title: '重复',
			dataIndex: 'days',
			key: 'days',
			width: '10%'
		}, {
			title: '时长(分)',
			dataIndex: 'longTime',
			key: 'longTime',
			width: '8%',
		}, {
			title: '语音提示',
			dataIndex: 'hint',
			key: 'hint',
			width: '15%'
		}, {
			title: '注意事项',
			dataIndex: 'describes',
			key: 'describes',
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '12%',
			render: (text, record) => {
				return(
					<span>
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
				)
			},
		}];
		return(<div>
        <BreadcrumbCustom first="药品管理" second='用药模板' />
        <Card 
          title="用药模板"
          bordered={false} 
          extra={<Button type="primary" onClick={this.handleAdd} >新建模板</Button>}
        >
          <Table 
            bordered
            rowKey='id' 
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
          />
        </Card>
       
          <Modal 
            title="用药模板"
            key={modalFlag}
            // width='60%'
            okText='提交'
            visible={ modalFlag }
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item
                label='模板名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入模板名称!' }],
                  initialValue:name,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='模板编号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('templateCode', {
                  rules: [{ required: false, message: '请输入编号号!'}],
                  initialValue:templateCode
                })(
                  <Input disabled placeholder="自动生成"/>
                )}
              </Form.Item>
              {/*<Form.Item
                label='排序号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('orderId', {
                  rules: [{ required: false, message: '请输入编号号!'}],
                  initialValue:orderId
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='时长'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('longTime', {
                  rules: [{ required: false, message: '请输入时长' }],
                  initialValue:longTime,
                })(
                  <Input />
                )}
              </Form.Item>
               */}
               
              <Form.Item
                label='服药周期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择周期' }],
                  initialValue:type,
                })(
                  <RadioGroup buttonStyle="solid" onChange={this.changeType}>
                    <Radio.Button value={1}>按需</Radio.Button>
			        <Radio.Button value={2}>按日</Radio.Button>
			        <Radio.Button value={3}>按周</Radio.Button>
			        <Radio.Button value={4}>按月</Radio.Button>
                  </RadioGroup>
                )}
              </Form.Item>
              {
              	type==3||type==4?
              	<Fragment>
              	  <Form.Item
	                label='重复值域'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('days', {
	                  rules: [{ required: true, message: '请输入值域' }],
	                  initialValue:days,
	                })(
	                  <Input placeholder="重复类型是每周[1-7],每月[1-31],任意数字用逗号分割,如1,3"/>
	                )}
	              </Form.Item>
	               <Form.Item
	                label='时间点'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('point', {
	                  rules: [{ required: true, message: '请输入时间点' }],
	                  initialValue:point,
	                })(
	                   <Input/>
	                )}
	              </Form.Item>
              	</Fragment>:type==2?
              	<Fragment>
              	 <Form.Item
	                label='时间点'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('point', {
	                  rules: [{ required: true, message: '请输入时间点' }],
	                  initialValue:point,
	                })(
	                   <CheckboxGroup options={plainOptions}/> 
	                )}
	              </Form.Item>
              	</Fragment>:null
              }
               
              <Form.Item
                label='描述'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('describes', {
                  rules: [{ required: true, message: '请输入简要描述信息!' }],
                  initialValue:describes,
                })(
                  <Input />
                )}
              </Form.Item>
               <Form.Item
                label='语音提示'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('hint', {
                  rules: [{ required: true, message: '请输入语音模板!' }],
                  initialValue:hint,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit"  loading={this.state.iconLoading}>确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>
      </div>
		)
	}
}
const TPL = Form.create()(CMT);
export default TPL;