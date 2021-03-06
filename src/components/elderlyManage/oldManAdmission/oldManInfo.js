import React, {
	Component,
	Fragment
} from 'react';
import { Tabs, Button, Form, Input, Radio, DatePicker, notification, Cascader, Select, InputNumber, Modal, Tree, Icon, Card, Row, Col, Table, Divider, Tag } from 'antd';
import moment from 'moment';
import httpServer from '../../../axios';
import FamilyMember from './familyMember';
import './index.css';
import BedInfo from '@/common/bedInfo';
import { debounce } from "@/utils"

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {
	TreeNode
} = Tree;
const {
	TextArea,
	Search
} = Input;

class OldManInfo1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldManInfoList: props.oldManInfoList,
			chargeItemList: [], //水电表关联项
			waterFlag: false,
			kwhFlag: false,
			mealFlag: false,
			modalFlag: false,
			optionsList: [], //选中楼层后获取到的房间集合
			roomName: '',
			optionsListBed: [],
			tab2Flag: props.tab2Flag,
			elderlyId: props.elderlyId,
			editFlag: props.editFlag,
			btnSubmitFlag: props.btnSubmitFlag,
			activeTabKey: '1',
			visible: false,
			dataSource: [],
			data: [],
			changedBed: props.oldManInfoList && props.oldManInfoList.tbBedInfo || {},
		}
		this.handleConfirmIdNumber = this.handleConfirmIdNumber.bind(this);
		this.handleConfirmShareProportionWater = this.handleConfirmShareProportionWater.bind(this);
		this.handleConfirmShareProportionPower = this.handleConfirmShareProportionPower.bind(this);
		this.handleConfirmAge = this.handleConfirmAge.bind(this);
		this.handleWaterFeeLink = this.handleWaterFeeLink.bind(this); //水费添加关联
		this.handleKwhFeeLink = this.handleKwhFeeLink.bind(this); //电费添加关联
		this.handleMealFeeLink = this.handleMealFeeLink.bind(this); //餐费添加关联
		this.elderlyListFlagToTrue = this.elderlyListFlagToTrue.bind(this); //返回
		this.handleTabChange = this.handleTabChange.bind(this); //切换tab面板
	}

	componentDidMount() {
		this.getPayItemChild();
	}

	handleTabChange(key) {
		this.setState({
			activeTabKey: key
		});
	}
	elderlyListFlagToTrue() { //返回
		this.props.elderlyListFlagToTrue();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if(!err) {
				const {
					bedInfo
				} = fieldsValue;
				let values = {
					...fieldsValue,
					'birthday': fieldsValue['birthday'].format('YYYY-MM-DD HH:mm:ss'),
					'checkInDate': fieldsValue['checkInDate'].format('YYYY-MM-DD HH:mm:ss'),
					'customerId': this.props.customerId,
					'status': 3,
					'roomName': bedInfo.roomName,
					'roomCode': bedInfo.roomUuid || bedInfo.roomCode,
					'bedNumber': bedInfo.bedCode || bedInfo.bedNumber,
					'noPayFee': 0,
					'shareProportionWater':1,
					'shareProportionPower':1,
				};
				const {
					id,
					status
				} = this.state.oldManInfoList;
				delete values.bedInfo;
				if(id) {
					values.id = id;
					const url = status === 4 ? "againInHomeInfo" : "updateElderlyInfo";
					httpServer[url](values).then((res) => {
						if(res.code === 200) {
							const args = {
								message: '通信成功',
								description: res.msg,
								duration: 2,
							};
							notification.success(args);
						} else {
							const args = {
								message: '通信失败',
								description: res.msg,
								duration: 2,
							};
							notification.error(args);
						}
					}).catch((error) => {
						console.log(error);
					});
				} else {
					httpServer.saveElderlyInfo(values).then((res) => {
						if(res.code === 200) {
							const args = {
								message: '通信成功',
								description: res.msg,
								duration: 2,
							};
							notification.success(args);
							const {
								id
							} = res.data;
							this.setState({
								elderlyId: id,
								tab2Flag: false,
								btnSubmitFlag: true,
								activeTabKey: '2'
							});
						} else {
							const args = {
								message: '通信失败',
								description: res.msg,
								duration: 2,
							};
							notification.error(args);
						}
					}).catch((error) => {
						console.log(error);
					});
				}
			}
		})
	}

	//绑定水费、电费、餐费关联
	handleWaterFeeLink() {
		this.setState({
			waterFlag: true
		});
	}
	handleWaterSelect(value) {
		this.setState({
			waterFlag: false
		});
	}
	handleKwhFeeLink() {
		this.setState({
			kwhFlag: true
		});
	}
	handleKwhSelect(value) {
		this.setState({
			kwhFlag: false
		});
	}
	handleMealFeeLink() {
		this.setState({
			mealFlag: true
		});
	}
	handleMealSelect(value) {
		this.setState({
			mealFlag: false
		});
	}
	//关联收费项目选取
	getPayItemChild() {
		const {
			customerId
		} = this.props;
		httpServer.selectPayItemChild({
			customerId
		}).then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					chargeItemList: res.data
				}) : this.setState({
					chargeItemList: []
				});
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
		}).catch((error) => {
			console.log(error);
		});
	}
	//自定义手机号校验
	handleConfirmPhoneNumber(rule, value, callback) {
		if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
			callback('手机号码格式不正确');
		} else {
			callback();
		}
	}
	setBirthday = (v) => {
		const str = v.substr(6, 8);
		const year = str.substr(0, 4);
		const month = str.substr(4, 2);
		const day = str.substr(6, 2);
		const date = `${year}-${month}-${day}`;
		const {
			oldManInfoList
		} = this.state;
		this.setState({
			oldManInfoList: { ...oldManInfoList,
				birthday: date
			}
		});
	}
	//自定义身份证号校验
	handleConfirmIdNumber(rule, value, callback) {
		if(value && !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)) {
			callback("身份证号格式错误");
		} else {
			callback();
			if(value) {
				this.setBirthday(value)
			}
		}
	}
	//自定义水费校验
	handleConfirmShareProportionWater(rule, value, callback) {
		if(value && !/^(0|[1-9][0-9]?|100)$/.test(value)) {
			callback("请输入0-100的正整数");
		} else {
			callback();
		}
	}
	//自定义电费校验
	handleConfirmShareProportionPower(rule, value, callback) {
		if(value && !/^(0|[1-9][0-9]?|100)$/.test(value)) {
			callback("请输入0-100的正整数");
		} else {
			callback();
		}
	}

	handleConfirmAge(rule, value, callback) {
		if(value && !/^[1-9]\d*$/.test(value)) {
			callback("请输入正整数");
		} else {
			callback();
		}
	}

	againIn = () => {
		this.listElderly()
	}
	listElderly = () => {
		httpServer.listElderlyInfo({
			listStatus: '4',
		}).then(res => {
			if(res.code === 200) {
				this.setState({
					data: res.data || [],
					sourceData: res.data || [],
					visible: true
				})
			} else {
				this.setState({
					data: [],
					dataSource: [],
					visible: false
				});
				const args = {
					message: '通信失败',
					description: res.msg,
					duration: 2,
				};
				notification.error(args);
			}
		})
	}
	handleCancel() {
		this.setState({
			visible: false
		});
	}
	rowClick = (v) => {
		delete v.roomCode;
		delete v.roomName;
		delete v.bedCode;
		delete v.bedNumber;
		this.setState({
			oldManInfoList: v,
			visible: false
		})
	}

	handleSearchElderly = (v) => {
		const {
			sourceData
		} = this.state;
		if(v) {
			const reg = new RegExp(v, 'gi');
			const data = sourceData.filter((record) => record.name && record.name.match(reg));
			this.setState({
				data,
			});
		} else {
			this.setState({
				data: sourceData
			})
		}
	}

	exportBed = (changedBed) => {
		this.setState({
			changedBed
		})
	}

	changeBedMoney = (v) => {
		const {
			changedBed
		} = this.state;
		changedBed.money = v;
		this.setState({
			changedBed
		}, () => {
			httpServer.updateBedInfo(changedBed).then((res) => {
				if(res.code !== 200) {
					Modal.error({
						title: '床位费变更',
						content: res.msg,
					});
				}
			}).catch(err => {
				Modal.error({
					title: 'This is an error message',
					content: 'some messages...some messages...',
				});
			})
		})
	}
	render() {
		const {
			getFieldDecorator,
			getFieldValue
		} = this.props.form;
		const {
			chargeItemList,
			waterFlag,
			kwhFlag,
			mealFlag,
			modalFlag,
			optionsList,
			optionsListBed,
			editFlag,
			btnSubmitFlag,
			data,
			changedBed
		} = this.state;
		const {
			name, //老人姓名
			age, //年龄
			idNumber, //老人身份证号 需要正则判断
			socialSecurityNumber, //社保卡号
			phone, //联系电话
			sex, //老人性别 int
			birthday, //老人生日 datetime
			checkInDate, //入院日期
			maritalStatus, //老人婚姻状况 int
			address, //老人住址
			politicalFace, //老人政治面貌 int
			livingCondition, //老人居住状况 int
			economicSituation, //老人经济状况 int
			hobby, //爱好特长
			//opetator,//操作员
			roomName, //房间名称
			roomCode, //房间uuid
			bedNumber, //床位号
			estimateGradeCode, //评估等级
			nursingGradeCode, //护理等级
			itemCodeWater, //水费对应项
			itemCodeKwh, //电费对应项
			itemCodeMeal, //餐费对应项
			nursingMoney, //护理费
			shareProportionWater, //水费承担比例
			shareProportionPower, //电费承担比例
			memo, //备注
			tbBedInfo,
			bedInfo,
			waterKwhStatus,
			monthlyPayment,
			id,
			status
		} = this.state.oldManInfoList;

		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 4
				},
				md: {
					span: 8
				}
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 20
				},
				md: {
					span: 16
				}
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 4,
					offset: 20,
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
			key: 'serialNumber',
			width: '5%'
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render: text => <a href="javascript:;">{text}</a>,
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex',
			width: '10%',
			render: (text) => {
				return text === 1 ? < Tag color = "#87d068" > 男 < /Tag>:<Tag color="#2db7f5">女</Tag >
			}
		}, {
			title: '年龄',
			dataIndex: 'age'
		}, {
			title: '入院日期',
			dataIndex: 'checkInDate',
			render: (t, r) => {
				return <Tag color="geekblue">{t.substr(0,10)}</Tag>
			}
		}, {
			title: '出院日期',
			dataIndex: 'requestTime',
			render: (t, r) => {
				return <Tag color="purple">{t.substr(0,10)}</Tag>
			}
		}, {
			title: '备注',
			dataIndex: 'moneyClear',
			render: (t, r) => {
				return t > 0 ? < Tag color = "#108ee9" > 押金未退 < /Tag>:null 
			}
		}]
		return(
			<Fragment>
        <div className="card-container">
          <Tabs type="card" tabBarExtraContent={<Button onClick={this.elderlyListFlagToTrue} type="primary" title="返回" icon="rollback"></Button>} activeKey={this.state.activeTabKey} onChange={this.handleTabChange}>
            <TabPane tab="老人信息" key="1" >
              <Form onSubmit={this.handleSubmit} hideRequiredMark className="formClass">
                <Card title="基础信息" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}} extra={id?null:<Button type="primary" icon="import" title="导入老人"  onClick={this.againIn}></Button>}>
                  <Row gutter={16}>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="老人姓名"
                      >
                        {getFieldDecorator('name', {
                          rules: [{required: true, message: '请输入老人姓名',}],
                          initialValue:name
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="老人年龄"
                      >
                        {getFieldDecorator('age', {
                          rules: [{required: true, message: '请输入老人年龄',},{
                             validator: this.handleConfirmAge
                          }],
                          initialValue:age
                        })(
                          <InputNumber min={1} disabled={editFlag==='read'} style={{width:'100%'}}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="性别"
                      >
                        {getFieldDecorator('sex', {
                          rules: [{required: true, message: '请选择老人性别',}],
                          initialValue:sex||0
                        })(
                          <Radio.Group  buttonStyle="solid" disabled={editFlag==='read'}>
                            <Radio.Button value={1}>男</Radio.Button>
                            <Radio.Button value={0}>女</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="联系电话"
                      >
                        {getFieldDecorator('phone', {
                          rules: [{required: false, message: '请输入联系电话',},{
                             validator: this.handleConfirmPhoneNumber
                          }],
                          initialValue:phone
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="身份证号"
                      >
                        {getFieldDecorator('idNumber', {
                          rules: [{required: true, message: '请输入老人身份证号',},{
                             validator: this.handleConfirmIdNumber
                          }],
                          initialValue:idNumber
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="生日"
                      >
                        {getFieldDecorator('birthday', {
                          rules: [{required: true, message: '请选择出生日期',}],
                          initialValue:birthday?moment(birthday,'YYYY-MM-DD') : null
                        })(
                          <DatePicker format="YYYY-MM-DD" disabled placeholder="根据身份证自动匹配" suffixIcon={<span></span>}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="入院日期"
                      >
                        {getFieldDecorator('checkInDate', {
                          rules: [{required: true, message: '请选择入院日期',}],
                          initialValue:checkInDate?moment(checkInDate,'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                          <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled={editFlag==='read'} showTime style={{width:'100%'}}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...formItemLayout}
                        label="家庭住址"
                      >
                        {getFieldDecorator('address', {
                          rules: [{required: true, message: '请输入老人家庭住址',}],
                          initialValue:address
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                  </Row> 
                </Card>
              
                <Card title="信息完善" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
                  <Row gutter={32}>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="社保卡号"
                      >
                        {getFieldDecorator('socialSecurityNumber', {
                          rules: [{required: false, message: '请输入社保卡号',}],
                          initialValue:socialSecurityNumber
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="婚姻状况"
                      >
                        {getFieldDecorator('maritalStatus', {
                          rules: [{required: true, message: '请选择婚姻状况',}],
                          initialValue:maritalStatus||2
                        })(
                          <Radio.Group buttonStyle="solid" disabled={editFlag==='read'}>
                            <Radio.Button value={1}>未婚</Radio.Button>
                            <Radio.Button value={2}>已婚</Radio.Button>
                            <Radio.Button value={3}>丧偶</Radio.Button>
                            <Radio.Button value={4}>离异</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="政治面貌"
                      >
                        {getFieldDecorator('politicalFace', {
                          rules: [{required: true, message: '请选择老人政治面貌',}],
                          initialValue:politicalFace||1
                        })(
                          <Radio.Group  buttonStyle="solid" disabled={editFlag==='read'}>
                            <Radio.Button value={1}>群众</Radio.Button>
                            <Radio.Button value={2}>党员</Radio.Button>
                            <Radio.Button value={3}>其他党派</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="居住状况"
                      >
                        {getFieldDecorator('livingCondition', {
                          rules: [{required: true, message: '请选择老人居住状况',}],
                          initialValue:livingCondition||2
                        })(
                          <Radio.Group  buttonStyle="solid" disabled={editFlag==='read'}>
                            <Radio.Button value={1}>独居</Radio.Button>
                            <Radio.Button value={2}>与家庭成员同住</Radio.Button>
                            <Radio.Button value={3}>其他</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="经济来源"
                      >
                        {getFieldDecorator('economicSituation', {
                          rules: [{required: true, message: '请选择老人经济状况',}],
                          initialValue:economicSituation||2
                        })(
                          <Radio.Group  buttonStyle="solid" disabled={editFlag==='read'}>
                            <Radio.Button value={1}>离休</Radio.Button>
                            <Radio.Button value={2}>退休金</Radio.Button>
                            <Radio.Button value={3}>子女供给</Radio.Button>
                            <Radio.Button value={4}>社会保险与救济</Radio.Button>
                            <Radio.Button value={5}>其他</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="备注信息"
                      >
                        {getFieldDecorator('memo', {
                          rules: [{required: false, message: '请输入备注',}],
                          initialValue:memo
                        })(
                          <Input disabled={editFlag==='read'}/>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
               
                <Card title="费用相关" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
                  <Row gutter={32}>
                    <Col md={12}>
                      <Form.Item
                        label="床位选择"
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                      <Col md={16}>
                        <Form.Item style={{marginBottom:0}}>
		                    {getFieldDecorator('bedInfo', {
		                     rules: [{ required: true, message: '请选择床位!' }],
		                     initialValue:bedInfo
		                     })(
		                       <BedInfo disabled={editFlag!=='add'&&status===3} customerId={this.props.customerId} exportBed={this.exportBed}/>
		                     )}
	                    </Form.Item> 
                      </Col>
                      <Col md={2} className='text-right'>
                      </Col>
                      <Col span={6}>
	                        <InputNumber 
	                            placeholder="请输入床位费"
	                        	style={{width:'100%'}}
	                        	disabled={editFlag!=='add'&&status===3}
	                        	onChange={this.changeBedMoney} 
	                        	value={changedBed.money}
	                        />
                      </Col>
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="评估等级"
                      >
                        {getFieldDecorator('estimateGradeCode', {
                          rules: [{required: true, message: '请选择评估等级',}],
                          initialValue:estimateGradeCode||"能力完好"
                        })(  
                        <Select  placeholder="请选择评估等级"  disabled={editFlag==='read'}>
                            <Option value="能力完好">能力完好</Option>
						    <Option value="轻度失能">轻度失能</Option>
						    <Option value="中度失能">中度失能</Option>
							<Option value="重度失能">重度失能</Option>
                        </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...formItemLayout}
                        label="护理等级"
                      > 
                        <Col md={16}>
		                      <Form.Item>
		                        {getFieldDecorator('nursingGradeCode', {
		                          rules: [{required: true, message: '请选择护理等级',}],
		                          initialValue:nursingGradeCode
		                        })(  
		                        <Select placeholder="请选择护理等级"  disabled={editFlag!=='add'&&status===3}>
		                          {this.props.nursingGradeLists&&this.props.nursingGradeLists.map(item => <Option key={item.nursingGradeCode} disabled={item.state===0}>{item.nursingGradeName}</Option>)}
		                        </Select>
		                        )}
		                      </Form.Item>
		                    </Col>
		                    <Col span={2}></Col>
		                    <Col span={6}>
		                      <Form.Item>
		                        {getFieldDecorator('nursingMoney', {
		                          rules: [{required: true, message: '请输入护理费',}],
		                          initialValue:nursingMoney
		                        })(
		                          <InputNumber 
		                            placeholder="请输入护理费"
		                            
		                        	style={{width:'100%'}}
		                        	disabled={editFlag!=='add'&&status===3}
		                          />
		                        )}
		                      </Form.Item>
		                    </Col>
                      </Form.Item>
                    </Col>
                    <Col md={12}>
	                      <Form.Item
	                        {...formItemLayout}
	                        label="餐费对应项"
	                      >
	                        {getFieldDecorator('itemCodeMeal', {
	                          rules: [{required: true, message: '请选择餐费对应项',}],
	                          initialValue:itemCodeMeal
	                        })(
	                          <Select showArrow={false} open={mealFlag} disabled onSelect={(value)=>{this.handleMealSelect(value)}}>
	                            {chargeItemList.filter(item=>item.name.match(/餐/,'gi')).map(item => <Option key={item.itemCode}>{item.name}</Option>)}
	                          </Select>
	                        )}
	                        <Button onClick={this.handleMealFeeLink} disabled={editFlag==='read'}>添加关联</Button>
	                      </Form.Item>
	                    </Col>
		               	<Col md={12}>
	                        <Form.Item
		                        {...formItemLayout}
		                        label="水费对应项"
		                        >
			                        {getFieldDecorator('itemCodeWater', {
			                          rules: [{required: true, message: '请选择水费对应项',}],
			                          initialValue:itemCodeWater
			                        })(
			                          <Select showArrow={false} open={waterFlag} disabled onSelect={(value)=>{this.handleWaterSelect(value)}}>
			                            {chargeItemList.filter(item=>item.name.match(/水/,'gi')).map(item => <Option key={item.itemCode}>{item.name}</Option>)}
			                          </Select>
			
			                        )}
			                    <Button onClick={this.handleWaterFeeLink} disabled={editFlag==='read'}>添加关联</Button>
			                </Form.Item>
			            </Col>            
			            <Col md={12}>
			                <Form.Item
	                        {...formItemLayout}
	                        label="电费对应项"
			                >
			                    {getFieldDecorator('itemCodeKwh', {
			                          rules: [{required: false, message: '请选择电费对应项',}],
			                          initialValue:itemCodeKwh
			                        })(
			                          <Select showArrow={true} open={kwhFlag} disabled onSelect={(value)=>{this.handleKwhSelect(value)}}>
			                            {chargeItemList.filter(item=>item.name.match(/电/,'gi')).map(item => <Option key={item.itemCode}>{item.name}</Option>)}
			                          </Select>
			                        )}
			                        <Button onClick={this.handleKwhFeeLink} disabled={editFlag==="read"}>添加关联</Button>
			                </Form.Item>
			            </Col>
				        <Col md={12}>
		                    <Form.Item
		                        {...formItemLayout}
		                        label="水电结算方式"
		                    >
		                        {
		                        	getFieldDecorator('waterKwhStatus',{
		                        		rules:[{required: true, message: '请选择水电结算方式',}],
		                        		initialValue:waterKwhStatus||0
		                        	})(
		                        		<Radio.Group buttonStyle="solid">
										 <Radio.Button value={1}>包月</Radio.Button>
				 				         <Radio.Button value={0}>抄表结算</Radio.Button>
									    </Radio.Group>
		                        	)
		                        }
		                    </Form.Item>
		                </Col>
		                {
		                	getFieldValue('waterKwhStatus')===1?<Col md={12}>
			               	    <Form.Item
					              {...formItemLayout}
					              label="水电包月费"			 
			               	    >
					                {getFieldDecorator('monthlyPayment', {
					                  rules: [{required: true, message: '不可为空',}],
					                  initialValue:monthlyPayment,
		                            })(
					                    <InputNumber placeholder="包月水电费" style={{width:'100%'}} min={0} />
					                )}
					            </Form.Item>
			               </Col>:null
		                }
		                  
                  </Row>
                </Card>     
                <Form.Item  {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" disabled={editFlag==='read'|| btnSubmitFlag}>确认提交</Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="家庭成员信息" key="2" disabled={this.state.tab2Flag}>
              <FamilyMember elderlyId={this.state.elderlyId} editFlag={editFlag==="read"}/>
            </TabPane>
          </Tabs>
        </div>
          <Modal
		          title="老人列表"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		          width={800}
		        >
		         <Search
		                className=""
					    placeholder="请输入关键字"
					    onSearch={this.handleSearchElderly}
					    style={{ width: 200 }}
					    enterButton
			    />   
            <Divider/>
		        <Table columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)})}/> 
	        </Modal>
      </Fragment>
		)
	}
}

const OldManInfo = Form.create()(OldManInfo1);
export default OldManInfo;