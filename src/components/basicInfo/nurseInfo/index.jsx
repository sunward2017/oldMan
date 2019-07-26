import React, {
	Component,
	Fragment
} from 'react';
import { Table,Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';

const RadioGroup = Radio.Group;
class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record: '',
			iconLoading:false,
			customerId:'',
		}
	}
	
	componentDidMount() {
		const auth = JSON.parse(sessionStorage.getItem('auth'));
		this.setState({customerId:auth.customerId},function(){
			this.List()
		})
	}
	
	List() {
		const customerId = this.state.customerId;
		httpServer.listNurseInfo({customerId}).then(res => {
			if(res.code===200) {
				this.setState({
					dataSource: res.data?res.data:[]
				})
			}else{
				this.setState({
					dataSource:[]
				})
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
	    httpServer.deleteNurseInfo({id}).then(res => {
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
			record: {sex:1,status:1,entryTime:new Date()}
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
		this.setState({ iconLoading: true });
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				const values = {
					...fieldsValue,
					'entryTime': fieldsValue['entryTime'].format('YYYY-MM-DD HH:mm:ss'),
					'customerId': this.state.customerId
				};
			  if(values.quitTime){values.quitTime=values.quitTime.format('YYYY-MM-DD HH:mm:ss')}	
			  const { id }= this.state.record;
              if(id){
              	    values.id = id;
					httpServer.updateNurseInfo(values).then((res)=>{
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
			   	   httpServer.saveNurseInfo(values).then((res) => {
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

			}else{
				this.setState({ iconLoading: false });
			}
		});
	}

	/*自定义手机号校验*/
	validatePhoneNumber(rule, value, callback) {
		if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
			callback('手机号码格式不正确');
		} else {
			callback();
		}
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
			nurseName,
			phone,
			jobNumber,
			faceUrl,
			entryTime,
			status,
			memo,
			sex,
			quitTime
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

		const columns = [{
			title: '工号',
			dataIndex: 'jobNumber',
			key: 'jobNumber',
			align:'center',
			width: '5%'
		}, {
			title: '姓名',
			dataIndex: 'nurseName',
			key: 'nurseName',
			width: '8%',
			align:'center'
		}, {
			title: '联系电话',
			dataIndex: 'phone',
			key: 'phone',
			width: '10%'
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex',
			width: '5%',
			align:'center',
			render: (text, record) => {
				return text === 1 ? < Tag color = "green" >男 < /Tag>:< Tag color = "red">女</Tag >
			}
		}, {
	      title: '入职日期',
	      dataIndex: 'entryTime',
	      key: 'entryTime',
	      align:'center',
	      width:'10%',
	      render:(text,record)=>{
	        return record.entryTime && record.entryTime.substr(0,10)
	      },
	    },{
	      title: '离职日期',
	      dataIndex: 'quitTime',
	      key: 'quitTime',
	      align:'center',
	      render:(text,record)=>{
	        return record.quitTime && record.quitTime.substr(0,10)
	      },
	    },{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			align:'center',
			render: (text, record) => {
				return record.status === 1 ? < Tag color = "green" >在职< /Tag>:<Tag color="red">离职</Tag >
			},
			width: '5%'
		},{
			title: '备注',
			dataIndex: 'memo',
			key: 'memo',
            width: '10%'
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			fixed: 'right',
            width: 200,
			align:'center',
			render: (text, record) => {
				return(
			      <span>
		              <Button size="small" icon="edit" title="编辑" type="primary" onClick={() => { this.handleModify(record) }}></Button>
		              <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
		                 <Button size="small" icon="delete" title="删除" type="primary" ></Button>
		              </Popconfirm>
		          </span>
				)
			},
		}];
		return(
		<div>
          <BreadcrumbCustom first="基础设置" second='护士' />
          <Card 
	          title="护士"
	          bordered={false} 
	          extra={<Button type="primary" onClick={()=>{this.handleAdd()}} >新增</Button>}
	        >
	          <Table 
	            size='middle'
	            rowKey='id'
	            scroll={{x:1300}}
	            dataSource={dataSource} 
	            columns={columns} 
	            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
	          />
	        </Card>
        {
          modalFlag?
          <Modal 
            title="护士信息输入"
            // width='60%'
            okText='提交'
            visible={modalFlag}
           
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                label='工号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('jobNumber', {
                  rules: [{ required: true, message: '请输入工号!'}],
                  initialValue:jobNumber
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='姓名'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('nurseName', {
                  rules: [{ required: true, message: '请输入护士姓名!' }],
                  initialValue:nurseName,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='性别'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('sex', {
                  rules: [{ required: true, message: '请选择性别!' }],
                  initialValue:sex,
                })(
                  <RadioGroup buttonStyle="solid">
                    <Radio.Button value={1}>男</Radio.Button>
                    <Radio.Button value={0}>女</Radio.Button>
                  </RadioGroup>
                )}
              </Form.Item>
              <Form.Item
                label='电话号码'
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
	            label='密码'
	            {...formItemLayout}
	            style={{marginBottom:'4px'}}
	          >
	            {getFieldDecorator('passwd', {
	              rules: [{ required: true, message: '请输入密码' }],
	            })(
	              <Input/>
	            )}
	          </Form.Item>
              <Form.Item
                label='入职时间'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('entryTime', {
                  rules: [{ required: false, message: '请选择日期!' }],
                  initialValue:entryTime?moment(entryTime,'YYYY-MM-DD') : null,
                })(
                  <DatePicker format='YYYY-MM-DD' />
                )}
              </Form.Item>
              <Form.Item
	            label='离职日期'
	            {...formItemLayout}
	            style={{marginBottom:'4px'}}
	          >
	            {getFieldDecorator('quitTime', {
	              rules: [{ required: false, message: '请选择日期!' }],
	              initialValue:quitTime?moment(entryTime,'YYYY-MM-DD HH:mm:ss'):null,
	            })(
	              <DatePicker format='YYYY-MM-DD' showTime  allowClear={false}/>
	            )}
	          </Form.Item>
              <Form.Item
                label='状态'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态!' }],
                  initialValue:status,
                })(
                  <RadioGroup buttonStyle="solid">
                    <Radio.Button value={1}>在职</Radio.Button>
                    <Radio.Button value={0}>离职</Radio.Button>
                  </RadioGroup>
                )}
              </Form.Item>
              <Form.Item
                label='备注'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('memo', {
                  rules: [{ required: false, message: '请输入备注信息!' }],
                  initialValue:memo,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit"  loading={this.state.iconLoading}>确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
      </div>
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;