import React, {
	Component,
	Fragment
} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { Row, Col, Table, notification, Button, Input, Tabs, Card, TreeSelect, Tag, Avatar, Divider, Calendar ,Badge} from 'antd';
import httpServer from '../../../axios';
import PersonInfo from './personInfo';
import HealthCarePlan from './healthCarePlan';
import CaseCare from './caseCare';
import Evaluate from './evaluate';
import NursingRecord from './nursingRecord'
import Tentative from './tentative'
import './index.css';

const TabPane = Tabs.TabPane;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
const Search = Input.Search;
const {
	Meta
} = Card;
class CarePlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldManList: [], //老人列表数据
			elderlyListFlag: true, //列表开关
			eldlerlyInfo: {},
			nursingScheduledId: '',
			elderlyCasePlans: {}, //老人对应的护理计划列表
			activeKey: '1',
			treeData: [],
			nursingGradeList: [], //护理等级
			casePlan: {}, //个案详情
		}
	}

	componentDidMount() {
		//获取入院老人信息列表
		this.getListElderlyInfo();
		this.fetchElderlyRoomTree();
		this.getListNursingGrade();
	}
	//获取入院老人信息列表
	getListElderlyInfo = (searchKey) => {
		const {
			customerId
		} = this.props.auth;
		this.setState({
			customerId
		});
		httpServer.listElderlyInfo({
			listStatus: "3",
			customerId,
			launchFlag: 0,
			...searchKey
		}).then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					oldManList: res.data
				}) : this.setState({
					oldManList: []
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

	getListNursingGrade = () => { //获取护理等级
		httpServer.listNursingGrade().then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					nursingGradeList: res.data
				}) : this.setState({
					nursingGradeList: []
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

	//获取老人对应的护理计划列表
	getListNursingScheduled() {
		const {
			id
		} = this.state.elderlyInfo;
		httpServer.listNursingScheduled({
			elderlyId: id
		}).then((res) => {
			if(res.code === 200) {
				let obj={};
				res.data&&res.data.forEach(i=>{
					obj[i.addtime.split(' ')[0]]= i.nursingScheduledId;
				})
				this.setState({elderlyCasePlans:obj})
			} else {
				const args = {
					message: '通信失败',
					description: res.msg,
					duration: 2,
				};
				notification.error(args);
				this.setState({
					elderlyCasePlans: {}
				})
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	//护理计划相关操作
	hangdleCheck(record) { //单击选中老人信息
		this.setState({
			elderlyInfo: record,
			elderlyListFlag:false
		}, () => {
			this.getListNursingScheduled();
		});
	}
	handleAddCarePlan() { //新增当前选中老人的护理计划

	}
    rebackList=()=>{ //返回到老人信息列表
		this.setState({
			elderlyListFlag: true,
		});
	}

	setNursingScheduledId(id) { //获取nursingScheduledId
		this.setState({
			nursingScheduledId: id
		});
	}
  
	tabsChange = (v) => {
		this.setState({
			activeKey: v
		})
	}
	fetchScheduledIdDetail=()=>{ //获取计划详情
		const {elderlyInfo,nursingScheduledId}= this.state;
		httpServer.getNursingScheduledDetail({
			nursingScheduledId,
			elderlyId:elderlyInfo.id
		}).then((res) => {
			if(res.code === 200) {
				this.setState({
					casePlan: res.data || {},
					elderlyListFlag: false
				})
			} else {
				const args = {
					message: '错误提示',
					description: res.msg,
					duration: 2,
				};
				notification.error(args);
				this.setState({
					casePlan: {},
					elderlyListFlag: true
				})
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	fetchElderlyRoomTree() {
		httpServer.listAreaInfo({}).then(res => {
			res.code === 200 ? this.setState({
				treeData: [res.data]
			}) : this.setState({
				treeData: []
			});
		})
	}
	renderTreeNodes = data => data.map(item => {
		if(item.children) {
			return(
				<TreeNode title={item.areaName} key={item.id} value={item.areaCode}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
			);
		}
		return <TreeNode title={item.areaName} key={item.id} value={item.areaCode} />;
	});
	onTreeSelectChangeHandler = (value) => {
		value.length > 0 ? this.getListElderlyInfo({
			areaCode: value.join(',')
		}) : this.setState({
			oldManList: []
		});
	};
	onNameSearchHandler = (value) => {
		/\S+/.test(value) && this.getListElderlyInfo({
			name: value.trim()
		});
	};
	saveEvaluate = (v) => {
		const {
			elderlyInfo,
			nursingScheduledId,
			casePlan,
		} = this.state;
		const values = {
			...v,
			elderlyId:elderlyInfo.id,
			id: casePlan['tbNursingScheduledOne'].id,
			elderlyMz: JSON.stringify(v)
		};
		httpServer.updateNursingScheduledSheet1(values).then((res) => {
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
		}).catch((err) => {
			console.log(err);
		});
	}

	saveCasePlan = (type, v) => {
		const {
			elderlyInfo,
			nursingScheduledId
		} = this.state;
	    let values = { ...v,
			elderlyId:elderlyInfo.id,
		}
		if(nursingScheduledId){
			values.nursingScheduledId=nursingScheduledId; 
		}
		let url = '';
		switch(type) {
			case 'info':
				url = v.id ? 'updateNursingScheduledSheet1' : 'saveNursingScheduledSheet1';
				break;
			case 'health':
				url = v.id ? 'updateNursingScheduledSheet2' : 'saveNursingScheduledSheet2';
				break;
			case 'work':
				url = v.id ? 'updateNursingScheduledSheet3' : 'saveNursingScheduledSheet3';
				break;
			case 'record':
				url = v.id ? 'updateNursingScheduledSheet4' : 'saveNursingScheduledSheet4';
				break;
			case 'plan':
				url = v.id ? 'updateNursingScheduledSheet5' : 'saveNursingScheduledSheet5';
		}
		let _this = this;
		httpServer[url](values).then(res => {
			if(res.code === 200) {
				const args = {
					message: '通信成功',
					description: res.msg,
					duration: 2,
				};
				notification.success(args);
				if(!this.state.nursingScheduledId){
					this.setState({nursingScheduledId:res.data.nursingScheduledId},()=>{
					   this.getListNursingScheduled() 
					})
				}else{
					_this.fetchScheduledIdDetail();
				}
			} else {
				const args = {
					message: '通信失败',
					description: res.msg,
					duration: 2,
				};
				notification.error(args);
			}
		})
	}
	
	onPanelChange=(v,mode)=>{
	   const d= v.format('YYYY-MM-DD');
	   const {elderlyCasePlans} = this.state; 
	   if(elderlyCasePlans[d]){
	   	 this.setState({nursingScheduledId:elderlyCasePlans[d]},()=>{
	   	 	this.fetchScheduledIdDetail();
	   	 })
	   }else{
	   	 this.setState({nursingScheduledId:'',casePlan:{}})
	   }
	}
	
	dateCellRender=(value)=>{
	  const v = value.format("YYYY-MM-DD");
	  const {elderlyCasePlans} = this.state; 
	  if(elderlyCasePlans[v]){
	  	return   <Badge status="success" />
	  }
	}
	
	handleAdd=()=>{
	   this.setState({activeKey:'1',casePlan:{},nursingScheduledId:''})	
	}
	render() {
		const {
			oldManList,
			elderlyListFlag,
			elderlyInfo,
			elderlyCasePlans,
			tbNursingRecoder,
			treeData,
			tabFlag,
			nursingGradeList,
			casePlan
		} = this.state;
		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			key: 'serialNumber',
			width: '10%'
		}, {
			title: '入院编号',
			dataIndex: 'elderlyNo',
			key: 'elderlyNo',
			width: '10%'
		}, {
			title: '老人姓名',
			dataIndex: 'name',
			key: 'name',
			width: '10%'
		}, {
			title: '身份证号',
			dataIndex: 'idNumber',
			key: 'idNumber',
			width: '20%'
		}, {
			title: '房间名称',
			dataIndex: 'roomName',
			key: 'roomName',
			width: '15%'
		}, {
			title: '评估等级',
			dataIndex: 'estimateGradeCode',
			key: 'estimateGradeCode',
			width: '15%'
		}, {
			title: '护理等级',
			dataIndex: 'nursingGradeCode',
			key: 'nursingGradeCode',
			render: (text, record) => {
				const arr = nursingGradeList && nursingGradeList.find(item => (item.nursingGradeCode === record.nursingGradeCode));
				return arr ? arr.nursingGradeName : '无';
			},
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => {
				return <Button size="small" type="primary" onClick={()=>this.hangdleCheck(record)}>个案护理</Button>
			}
		}];

		return(
	    <Fragment>
        <BreadcrumbCustom first="医护管理" second="护理计划" />
        {
          elderlyListFlag?
               <Row>
                    <Card bordered={false} style={{marginBottom:10}}>
                        <Row gutter={16}>
                            <Col md={4}>
                                <TreeSelect className="w-full"
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeDefaultExpandedKeys={['1']}
                                    onChange={this.onTreeSelectChangeHandler}
                                    treeCheckable="true"
                                    showCheckedStrategy={SHOW_PARENT}
                                    searchPlaceholder="选择楼层房间" >
                                    {this.renderTreeNodes(treeData)}
                                </TreeSelect>
                            </Col>
                            <Col md={4}>
                              <Search
                                placeholder="按姓名搜索"
                                onSearch={value => this.onNameSearchHandler(value)}
                                enterButton
                              />
                            </Col>
                        </Row>
                      </Card>
                      <Row>
                        <Card bordered={false} title="老人列表">
                          <Table 
                            bordered
                            dataSource={oldManList} 
                            columns={columns} 
                            pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
                            rowKey={record => record.id}
                          />
                        </Card>
                      </Row>
                </Row>:
            <Card title="个案计划"  extra={<Button type="primary" onClick={this.rebackList} size="small">回退</Button>}>
                <Row gutter={16}>
                   <Col xs={24} md={24} sm={24}>
                   	  <Card 
                   	     bordered
		              > <h4>
		                  姓名:&emsp;<Tag color="blue">{elderlyInfo.name}</Tag>&emsp; 性别:&emsp;<Tag color="geekblue">{elderlyInfo.sex===1?'男':'女'}</Tag>&emsp;
		                   年龄:&emsp;<Tag color="purple">{elderlyInfo.age}岁</Tag>
		                  护理等级:&emsp;<Tag color="blue">{nursingGradeList.find(item=>(item.nursingGradeCode===elderlyInfo.nursingGradeCode)).nursingGradeName}</Tag>&emsp; 
		                    房号:&emsp;<Tag color="geekblue">{elderlyInfo.roomName}</Tag>&emsp;床号:&emsp;<Tag color="purple">{elderlyInfo.bedNumber}</Tag>
		                </h4>
		                
		              </Card>
                   </Col>
                   
                </Row>
                <Divider />
                <Row gutter={2}>
                    <Col xs={24} md={4} sm={4}>
                      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                        <Calendar fullscreen={false} onSelect={this.onPanelChange}  dateCellRender={this.dateCellRender}/>
                      </div>  
                   </Col>
                    <Col xs={24} md={20} sm={20}>
                         <Tabs onChange={this.tabsChange} type="card"  tabBarExtraContent={<Button size="small" type="primary" onClick={this.handleAdd}>新增个案护理</Button>}>
		                  <TabPane tab="人员信息" key="1">
		                    <PersonInfo 
		                     tbScheduledOne={casePlan['tbNursingScheduledOne']||{}}
		                     saveCasePlan={this.saveCasePlan} 
		                    />
		                  </TabPane>
		                  <TabPane tab="日常生活能力评估" key="2" disabled={tabFlag}>
		                    <Evaluate saveEvaluate={this.saveEvaluate} tbScheduledOne={casePlan['tbNursingScheduledOne']||{}}/>
		                  </TabPane>
		                  <TabPane tab="健康护理计划" key="3" disabled={tabFlag}>
		                    <HealthCarePlan
		                      key = {casePlan['tbNursingScheduledTwos']?casePlan['tbNursingScheduledTwos'].id:''}
		                      healthInfo = {casePlan['tbNursingScheduledTwos']||{}} 
		                      saveCasePlan={this.saveCasePlan}
		                    />
		                  </TabPane>
		                  <TabPane tab="个案工作计划" key="4" disabled={tabFlag}>
		                    <CaseCare 
		                      key = {casePlan['tbNursingScheduledThree']?casePlan['tbNursingScheduledThree'].id:''}
		                      work = {casePlan['tbNursingScheduledThree']||{}}
		                      saveCasePlan={this.saveCasePlan}
		                    />
		                  </TabPane>
		                  <TabPane tab="个案护理记录" key="5" disabled={tabFlag}>
		                    <NursingRecord  saveCasePlan={this.saveCasePlan} record={casePlan['tbNursingRecoder']||{}}    key = {casePlan['tbNursingRecoder']?casePlan['tbNursingRecoder'].id:''}/>
		                  </TabPane>
		                  <TabPane tab="7日评估及初步护理计划" key="6" disabled={tabFlag}>
		                    <Tentative 
		                     key = {casePlan['tbNursingScheduled7day']?casePlan['tbNursingScheduled7day'].id:''}
		                     saveCasePlan={this.saveCasePlan} 
		                     planByDays={casePlan['tbNursingScheduled7day']||{}} 
		                     />
		                  </TabPane>
		                </Tabs>
                    </Col>  
                </Row>
           </Card>
        }
      </Fragment>
		)
	}
}

export default CarePlan;