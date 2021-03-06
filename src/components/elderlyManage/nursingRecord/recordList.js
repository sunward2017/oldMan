import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,InputNumber} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';
import BedInfo  from '@/common/bedInfo';
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
		this.setState({customerId:auth.customerId});
		this.List(auth.customerId)
	}
	
	List=(id)=> {
		const customerId = id||this.state.customerId;
		httpServer.listAppointmentInfo({customerId}).then(res => {
			if(res.code===200) {
				const data = res.data?res.data.map(item=>({...item,...item.tbElderlyInfo})):[]
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
	 
	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag,
			customerId,
		} = this.state;
		const {
			appointmentPersonnel,
			phone,
			address,
			paidMoney,
			paidType,
			payableMoney,
			lastTime,
			name,
			sex,
			age,
			bedInfo
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
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		},  {
			title: '预约人',
			dataIndex: 'appointmentPersonnel',
			key: 'appointmentPersonnel',
			width: '7%'
		}, {
			title: '手机号',
			dataIndex: 'phone',
			key: 'phone',
			width: '10%'
		}, {
			title: '老人姓名',
			dataIndex: 'name',
			key: 'name',
			width: '7%'
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex',
			width: '5%',
			render: (text, record) => {
				return text === 1 ? < Tag color = "green" >男 </Tag>:< Tag color = "red">女</Tag >
			}
		},{
			title: '年龄',
			dataIndex: 'age',
			key: 'age',
            width: '5%',
		},{
			title: '联系地址',
			dataIndex: 'address',
			key: 'address',
		},{
			title: '预定日期',
			dataIndex: 'lastTime',
			key: 'lastTime',
			width: '10%',
			render: (text, record) => {
				return moment(text).format('YYYY-MM-DD')
			}
		},{
			title: '预订房间',
			dataIndex: 'tbElderlyInfo.roomName',
			key: 'tbElderlyInfo.roomName',
			width: '10%',
		},{
			title: '预订床位',
			dataIndex: 'tbElderlyInfo.bedNumber',
			key: 'tbElderlyInfo.bedNumber',
			width: '10%',
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '12%',
			render: (text, record) => {
				return(
					<span>
		              <Button icon="edit" title="修改" size="small" type="primary"  onClick={() => { this.handleModify(record) }}></Button>
		              <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
		                <Button icon="delete" type="primary" title="删除" size="small"></Button>
		              </Popconfirm>
		            </span>
				)
			},
		}];
		return(
			<div>
		        <BreadcrumbCustom first="医护管理" second='护理记录' />
		        <Card 
		          title="预约" 
		          bordered={false} 
		          extra={<Button type="primary" onClick={this.handleAdd} >预订</Button>}
		          activeTabKey={this.state.tabKey}
		        >
		        <Table 
		          
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
		          />
		        </Card>
		         
            </div>
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;