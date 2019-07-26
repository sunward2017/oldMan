import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag, notification, Divider, Card, message, Tooltip } from 'antd';
import httpServer from '@/axios';
import ElderlyInfo from '@/common/elderlyInfo'
import { Balance } from '../../financial/feeInOut/feeInfo';
import Cost from '@/common/costDetail'
import Visited from '@/common/visited'

class ElderlySelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sourceData: [],
			data: [],
			searchText: '',
			modalFlag: false,
			elderly: {},
			pledgeVisible: false,
			feeData: {},
			costFlag: false,
			meelObj:{},
			gradeObj:{},
		};
	}
	componentDidMount() {
		this.ListElderly();
		this.getPayItemChild()
		this.getNursingGrade();
	}

	//关联收费项目选取
	getPayItemChild() {
		httpServer.selectPayItemChild({
			customerId: this.customerId
		}).then((res) => {
			if(res.code === 200) {
				if(res.data){
					let obj = {};
		         	res.data.forEach(k=>{
		         		obj[k.itemCode]=k.name;
		         	})
		        	this.setState({
		        		meelObj:obj
		        	})
				}
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
	getNursingGrade() {
		httpServer.listNursingGrade().then((res) => {
			if(res.code === 200) {
				if(res.data){
					let obj = {};
		         	res.data.forEach(k=>{
		         		obj[k.nursingGradeCode]=k.nursingGradeName;
		         	})
		        	this.setState({
		        		gradeObj:obj
		        	})
				}
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
	handleSearchElderly = () => {
		const {
			searchText
		} = this.state;
		if(searchText) {
			const reg = new RegExp(searchText, 'gi');
			const data = this.state.sourceData.filter((record) => record.name && record.name.match(reg));
			this.setState({
				data,
			});
		} else {
			this.ListElderly()
		}
	}
	handleInputChange = (e) => { //老人姓名搜索框发生变化
		this.setState({
			searchText: e.target.value
		});
	}

	ListElderly = () => {
		httpServer.listElderlyInfo({
			listStatus: '4',
		}).then(res => {
			if(res.code === 200) {
				this.setState({
					data: res.data || [],
					sourceData: res.data || [],
				})
			} else {
				this.setState({
					data: []
				});
				message.error('获取老人失败')
			}
		})
	}
	handleReset = () => {
		this.setState({
			searchText: ''
		}, () => {
			this.ListElderly();
		})
	}
	lookAt = (r) => {
		this.setState({
			modalFlag: true,
			elderly: r
		})
	}
	lookAtPledge = (id) => {
		this.fetchElderlyBalance(id);
	}
	fetchElderlyBalance(id) {
		httpServer.getMoneyInfo({
			elderlyId: id
		}).then(res => {
			if(res.code === 200) {
				this.setState({
					feeData: res.data || {},
					fledgeVisible: true
				})
			} else {
				message.error('获取明细失败')
			}
		})
	}
	handleCancel = () => {
		this.setState({
			feeData: {},
			fledgeVisible: false
		})
	}

	showCost = (r) => {
		this.setState({
			costFlag: true,
			elderly: r
		})
	}

	close = () => {
		this.setState({
			costFlag: false
		})
	}

	render() {
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
			title: '住址',
			dataIndex: 'address',
			key: 'address',
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
			title: '出院原因',
			dataIndex: 'reason',
			key: 'reason',
			width: '20%',
			onCell: () => {
				return {
					style: {
						maxWidth: 150,
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						cursor: 'pointer'
					}
				}
			},
			render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
		}, {
			title: '备注',
			dataIndex: 'moneyClear',
			render: (t, r) => {
				return t > 0 ? < Tag color = "#108ee9" > 押金未退 < /Tag>:null 
			}
		}, {
			title: '操作',
			dataIndex: 'action',
			width: 200,
			align: 'center',
			fixed: 'right',
			render: (t, r) => {
				return <span>
						 <Button size="small" icon="read" type="primary" title="基本信息" onClick={() => { this.lookAt(r)}}></Button>
				      	 <Divider type="vertical"/>
				      	 <Button size="small" icon="strikethrough" type="primary" title="押金明细" onClick={() => { this.lookAtPledge(r.id)}}></Button>
				      	 <Divider type="vertical"/>
				      	 <Button size="small" icon="file-done" type="primary" title="历史结算" onClick={() => { this.showCost(r)}}></Button>
				      	 <Divider type="vertical" />
                         <Visited  record={{...r,elderlyId:r.id}} elderlyName={r.name}/>
				      </span>
			}
		}];
		const {
			name,
			data,
			modalFlag,
			elderly,
			costFlag,
			meelObj,
			gradeObj
		} = this.state;
		return(<Fragment>
			<Card>
		        <Input 
                  placeholder="按老人姓名搜索" 
                  style={{width:300,marginRight:'10px'}}
                  ref={ele => this.searchInput = ele}
                  value={ this.state.searchText }
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearchElderly}
                />
                <Button type="primary" onClick={this.handleSearchElderly}>搜索</Button>
                <Button type="primary" onClick={this.handleReset}>刷新</Button>
                <Divider/>
		        <Table  scroll={{ x: 1500}} bordered columns={columns} dataSource={data} rowKey='id' size="small"/> 
		    </Card> 
		    <ElderlyInfo visible={modalFlag} data={elderly} close={()=>{this.setState({modalFlag:false})}} meelObj={meelObj} gradeObj={gradeObj}/>
		    <Modal
		          title="押金明细"
		          visible={this.state.fledgeVisible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		          width={400}
		    >
		       <Balance feeData={this.state.feeData} />
		    </Modal>
		     {costFlag?<Cost visible={this.state.costFlag} elderlyInfo={elderly} close={this.close} />:null}
        </Fragment>)
	}
}

export default ElderlySelect;