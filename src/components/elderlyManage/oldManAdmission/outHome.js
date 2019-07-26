import React, {
	Component,
	Fragment
} from 'react';
import { Divider, Button, Modal, Form, Input, DatePicker, Popconfirm,notification} from 'antd';
import moment from 'moment';
import httpServer from '@/axios/index';
import reqwest from 'reqwest'
import { host } from '@/axios/config'

class outHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			outFlag: false,

		}
	}

	handleOutHome=()=>{
		this.setState({
			outFlag: true,
		});
	}
	handleOut = () => { //出院申请
	   this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				const values = {
					...fieldsValue,
					'outDay':fieldsValue['outDay'].format("YYYY-MM-DD HH:mm:ss"),
					id:this.props.elderlyId
				}
			   httpServer.outHomeInfo(values).then((res) => {
					this.hideModal();
					if(res.code === 200) {
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
					} else {
						if(res.message === 'Request failed with status code 500') {
							console.log(res.message);
						} else {
							const args = {
								message: '通信失败',
								description: res.msg,
								duration: 2,
							};
							notification.error(args);
						}
					}
					this.props.refresh();
				}).catch((error) => {
					console.log(error);
				});	
			}	
	    })
	}
	hideModal = () => {
		this.setState({
			outFlag: false,
		});
	};
	render() {
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
	    const {outFlag} = this.state;
	    const {getFieldDecorator} = this.props.form;
		return(
			<Fragment>
                <Button type="primary" title="出院申请" icon="user-delete" size="small" onClick={this.handleOutHome}></Button>
			    <Modal
		          title="出院申请"
		          visible={outFlag}
		          onOk={this.handleOut}
		          onCancel={this.hideModal}
		          okText="确认"
		          cancelText="取消"
		        >
		          <Form>
		            <Form.Item
		                label='结算日期'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('outDay', {
		                  rules: [{ required: true, message: '日期不可为空'}],
		                  initialValue:moment()
		                })(
		                    <DatePicker style={{width:"100%"}}/>
		                )}
		              </Form.Item>
		              <Form.Item
		                label='出院原因'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('reason', {
		                  rules: [{ required: true, message: '原因不可为空'}],
		                })(
		                  <Input placeholder="请输入出院原因"/>
		                )}
		              </Form.Item>
		          </Form>
		        </Modal>
			</Fragment>
		)
	}
}

export default  Form.create()(outHome);