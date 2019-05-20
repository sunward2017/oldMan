import React, {
	Component,
	Fragment
} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import { Row, Col, Button, Select, Input, DatePicker, Divider, Popconfirm, Table, Form, notification, Modal, Tree, Icon, InputNumber, Card, List, Avatar } from 'antd';
import moment from 'moment';
import Search from './search';

const Option = Select.Option;
const {
	TreeNode
} = Tree;
class WaterKwh extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageFlag: true, //页面切换标志
			data: [],
			record: {},
			listAreaInfo: [],
			modalFlag: false,
			optionsList: [], //选中楼层后获取到的房间集合
			roomName: '',
			action: 'add',
			searchFlag: false,
			value: '',
			meterReaderPerson:'',
			regDate:'',
			loadingRecord:{},
			rq4:moment(),
			rq3: moment().subtract('days', 15)
		};
		this.handleAdd = this.handleAdd.bind(this); //新增抄表、pageFlag To false
		this.handleCancle = this.handleCancle.bind(this); //取消编辑
		this.handleSubmit = this.handleSubmit.bind(this); //提交表单数据
		this.handleModalVisiable = this.handleModalVisiable.bind(this); //单击使modal可见
		this.handleModalCancel = this.handleModalCancel.bind(this); //单击使modal不可见
		this.onSelect = this.onSelect.bind(this); //单击选中树节点中的楼层
		this.handleSelectChange = this.handleSelectChange.bind(this); //房间名称发生变化 
		this.getListRegWaterKwh = this.getListRegWaterKwh.bind(this);
	}

	componentDidMount() {
		this.getListAreaTree();
		this.handleRefresh();
	}

	//获取listAreaTree
	getListAreaTree() {
		const {
			customerId
		} = this.props.auth;
		httpServer.listAreaInfo({
			customerId
		}).then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					listAreaInfo: [res.data]
				}) : this.setState({
					listAreaInfo: []
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
	getListRegWaterKwh(params) {
		let data={};
		if(params){
			data = {...params}
		}else{
			const {rq3,rq4} =this.state;
	        data = {
	        	rq4:rq4.format('YYYY-MM-DD'), 
	        	rq3:rq3.format('YYYY-MM-DD')
	        }
		}
		
		httpServer.listRegWaterKwh(data).then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					data: res.data
				}) : this.setState({
					data: []
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

	 
	//增删改相关
	handleAdd() { //新增抄表、pageFlag To false
		const {
			account
		} = this.props.auth;
		this.setState({
			pageFlag: false,
			record: {},
			action: 'add',
			optionsList: [],
		});
	}
	handleClickModify(record) { //修改
		this.setState({
			pageFlag: false,
			record,
			action: 'modify',
			optionsList: []
		});
	}
	handleRowDelete(record) {
		const {
			customerId
		} = this.props.auth;
		httpServer.deleteRegWaterKwh({
			customerId,
			id: record.id
		}).then((res) => {
			if(res.code === 200) {
				const args = {
					message: '通信成功',
					description: res.msg,
					duration: 2,
				};
				notification.success(args);
				this.getListRegWaterKwh();
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
	handleCancle() { //取消编辑
		this.getListRegWaterKwh();
		this.setState({
			pageFlag: true
		});
	}
	changePerson=(e)=>{
		const meterReaderPerson = e.target.value ;
		this.setState({meterReaderPerson})
	}
	changeDate=(v)=>{
		const regDate = v.format("YYYY-MM-DD HH:mm:ss");
		this.setState({regDate})
	}
	handleSubmit(room) {
		const _this = this;
		const {meterReaderPerson,regDate,loadingRecord} = this.state;
		const {roomUuid,water,kwh,roomName} = room;
	    if( !(water && kwh && meterReaderPerson && regDate)) {
	      notification.warning({
	        message: '提示：',
	        description: '数据有误，请核对',
	      });
	      return false
	    }
		if(!loadingRecord[room.roomUuid]){
			loadingRecord[room.roomUuid] = true;
			this.setState({loadingRecord})
		}
		const data ={roomCode:roomUuid,water,kwh,meterReaderPerson,regDate,roomName};
		httpServer.saveRegWaterKwh(data).then((res)=>{
			loadingRecord[room.roomUuid] = false;
			this.setState({loadingRecord})
         if (res.code === 200) {
            const args = {
              message: '通信成功',
              description: res.msg,
              duration: 2,
            };
            notification.success(args);
          } else {
            if(res.message ==='Request failed with status code 500'){
                console.log(res.message);
             }else{
              const args = {
                message: '通信失败',
                description: res.msg,
                duration: 2,
              };
              notification.error(args);
             }
          }
	    }).catch((err)=>{
	    	loadingRecord[room.roomUuid] = false;
			this.setState({loadingRecord})
	        console.log(err);
	    });
	}
	
	
	handleChange=(item,type,v)=>{ //水表度数发生变化
	    const {optionsList} = this.state;
	    const index = optionsList.findIndex(i=>(i.roomUuid===item.roomUuid));
	    item[type] =v;
	    optionsList.splice(index,1,item);
	    this.setState({optionsList})
	}
	 
	handleSelectChange(value) { //房间名称选择变化
		const {
			optionsList
		} = this.state;
		const arr = optionsList && optionsList.filter(item => item.roomUuid === value);
		let record = Object.assign({}, this.state.record);
		record["roomCode"] = value;
		this.setState({
			record,
			roomName: arr[0].roomName
		});
	}
	handleModalCancel() { //单击使modal不可见
		this.setState({
			modalFlag: false
		});
	}
	handleModalVisiable() { //单击使modal可见
		this.setState({
			modalFlag: true
		});
	}

	renderTreeNodes = data => data.map((item) => {
		if(item.children) {
			return(
				<TreeNode title={item.areaName} key={item.id} value={item.id}>
                 {this.renderTreeNodes(item.children)}
            </TreeNode>
			);
		}
		return <TreeNode {...item} />;
	})

	onSelect(value, node, info) { //单击树节点
		const {
			customerId
		} = this.props.auth;
		httpServer.listRoomInfo({
			customerId,
			areaId: value[0]
		}).then((res) => {
			if(res.code === 200) {
				let record = Object.assign({}, this.state.record);
				record["roomCode"] = '';
				this.setState({
					record
				});
				res.data ? this.setState({
					optionsList: res.data,
					modalFlag: false,
					action: 'add'
				}) : this.setState({
					optionsList: [],
					modalFlag: false,
					action: 'add'
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

	handleClickInquire() {
		this.setState({
			searchFlag: true
		});
	}
	handleClickInquireCancle() {
		this.setState({
			searchFlag: false
		});
	}
	onChange = (v) => {
		this.setState({
			value: v
		})
	}
	onChangeS=(v)=>{
		
		this.setState({
			rq3: v 
		})
	}
	onChangeE=(v)=>{
		this.setState({
			rq4: v
		})
	}
	handleRefresh=()=>{
		this.getListRegWaterKwh();
	}
	render() {
		const {
			pageFlag,
			data,
			listAreaInfo,
			modalFlag,
			optionsList,
			action,
			searchFlag,
			meterReaderPerson,
			regDate,
			loadingRecord,
			rq3,
			rq4
		} = this.state;
		 
		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			key: 'serialNumber',
			width: '10%'
		}, {
			title: '房间名称',
			dataIndex: 'roomName',
			key: 'roomName',
		}, {
			title: '本次水表度数',
			dataIndex: 'water',
			key: 'water',
			width: '12%'
		}, {
			title: '本次电表度数',
			dataIndex: 'kwh',
			key: 'kwh',
			width: '12%'
		}, {
			title: '抄表人员',
			dataIndex: 'meterReaderPerson',
			key: 'meterReaderPerson',
			width: '8%'
		}, {
			title: '抄表日期',
			dataIndex: 'regDate',
			key: 'regDate',
			width: '10%',
			render:(t,r)=>{
				return t?t.split(' ')[0]:t
			}
		},{
			title:'记录日期',
			dataIndex:'addtime',
			key:'addtime',
			width:'10%',
			render:(t,r)=>{
				return t?t.split(' ')[0]:t
			}
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width:'10%',
			render: (text, record) => {
				return(
					<span>
            <a href="javascript:;" onClick={() => { this.handleClickModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
              <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
            </Popconfirm>
          </span>
				)
			}
		}];
		return(
			<Fragment>
        <BreadcrumbCustom first="老人管理" second="水电记录" />
        {
          pageFlag?
          <Card 
            title="水电记录"
            bordered={false} 
            extra={<span>
            	 输入日期:   <DatePicker onChange={this.onChangeS} value={rq3}/>~<DatePicker onChange={this.onChangeE} value={rq4}/>&emsp;&emsp;
            	<Button type="primary" onClick={this.handleRefresh} style={{marginRight:20}}>刷新</Button> 
            	<Button type="primary" onClick={this.handleAdd} style={{marginRight:20}}>新增</Button>
                <Button type="primary" onClick={() => { this.handleClickInquire() }}>房间查询</Button>
                </span>}
          >
            <Table 
              bordered
              dataSource={data} 
              columns={columns} 
              pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
              rowKey={record => record.id}
            />
          </Card>:
          <Card 
            title="水电记录登记"
            extra={
            	<span>
		          抄表人:<Input  style={{width:150}} value={meterReaderPerson} onChange={this.changePerson}  placeholder="请输入抄表人员"/>&emsp;&emsp;
				      结算日期:<DatePicker format='YYYY-MM-DD HH:mm:ss' showTime value={regDate?moment(regDate,'YYYY-MM-DD HH:mm:ss'):null} onChange={this.changeDate} allowClear={false} showTime />&emsp;&emsp; 
		            <Button type="primary" onClick={this.handleCancle}>返回</Button>
		        </span>
            }
          >
            <Row gutter={24}>
	            <Col  xs={{ span: 24}} lg={{ span: 6}}>
	                
		              <Tree
		                defaultExpandAll
				        onSelect={this.onSelect}
				      >
				         {this.renderTreeNodes(listAreaInfo)}
					  </Tree>
				     
	            </Col>
	            <Col xs={{ span: 24}} lg={{ span:18}} >
	                <List
		              itemLayout="horizontal"
		            >        
		              {
		              	optionsList&&optionsList.map(item=>{
		              		return(
		              		<List.Item key={item.roomUuid}>
				                <List.Item.Meta
				                  avatar={<Avatar icon="star" />}
				                  title={<span style={{color:'#5695c4'}}>房间号:{item.roomName}</span>}
				                  description={
				                  	<span>
				                  	   水表:&emsp;<InputNumber  min={1} value={item.water} onChange={v=>this.handleChange(item,'water',v)} min={0} placeholder="水表度数"  style ={{width:200}}/>&emsp;&emsp;
				                  	    电表:&emsp;<InputNumber  min={1} value={item.kwh} onChange={v=>this.handleChange(item,'kwh',v)}  min={0} placeholder="电表度数" style ={{width:200}} />&emsp;&emsp;
				                      <Button type="primary" onClick={()=>{this.handleSubmit(item)}} loading={loadingRecord[item.roomUuid]} disabled={loadingRecord[item.roomUuid]===false}>确认</Button>
				                  	</span>
				                  	}
				                />
				              </List.Item>
		              		)
		              	})
		              }
		               
		            </List>
	            </Col>
            </Row>
          </Card>
        }
        {
          searchFlag?
            <Search 
              listAreaInfo={listAreaInfo} 
              customerId={this.props.auth.customerId}
              handleClickInquireCancle = {()=>{this.handleClickInquireCancle()}}
              getListRegWaterKwh = {this.getListRegWaterKwh}
            />:null
            
        }
      </Fragment>
		)
	}
}

export default WaterKwh;
 