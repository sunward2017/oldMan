import React, {
	Component,
	Fragment
} from 'react';
import { Row, Col, Input, Button, message, Modal, Divider, Popconfirm, Table, Form, Radio, notification, Tag, InputNumber, Card, Tabs, List, Select,Avatar } from 'antd';
import httpServer from '@/axios';
import { host } from '@/axios/config'
import EvaItem from './evaItem'
import moment from 'moment'
import img from '@/style/imgs/smile.jpg'

const { Meta} = Card;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class EvaluateInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalFlag: false, //搜索老人
			infoFlag: false, //新建老人
			dataSource: [], //老人信息列表
			dataSource_copy: [], //老人信息列表复制
			dataList: {}, //老人信息（age，name，sex）
			searchText: '', //搜索框内容
			estimateElderly: props.evaluateByElderly || {}, //老人信息
			newData: [], //老人表原始数据
			subLoading: false,
			evaluateLib: [],//评估库
			elderlyEvaluate: {},//
			itemResult: {},
			result:'',
		}
		this.handleCancel = this.handleCancel.bind(this); //关闭弹出框
		this.handleSearch = this.handleSearch.bind(this); //搜索获取老人列表
		this.handleAdd = this.handleAdd.bind(this); //添加老人信息
		this.handleCancelClick = this.handleCancelClick.bind(this); //取消添加/修改老人信息
		this.handleSubmit = this.handleSubmit.bind(this); //提交新增老人信息
		this.handleInputChange = this.handleInputChange.bind(this); //老人搜索框发生变化
		this.handleSearchElderly = this.handleSearchElderly.bind(this); //按老人姓名搜索
		this.handleClickReset = this.handleClickReset.bind(this); //重新获取老人列表，清楚查询条件
	}
	componentDidMount() {
		this.getListElderlyInfo(); //老人
		this.listEvaluateType(); //评估库
		if(this.props.rowId){
			this.getEvaluateByElderly();
		}
	}
	getEvaluateByElderly=()=>{
		const id = this.props.rowId;
		httpServer.getEvaluateDetail({id}).then(res=>{
			if(res.code===200){
				const obj = {};
				res.data&&res.data.tbEstimateTypes.forEach(item=>{
					obj[item.id]=item.tbElderlyEstimateItems
				})
				this.setState({elderlyEvaluate:obj,result:res.data.estimateGradeCode})
			}else{
				message.error('获取老人评估详情失败')
			}
		})
	}
	getListElderlyInfo() {
		const listStatus = this.props.isRegular ? '3' : '0,1,2,3';
		httpServer.listElderlyInfo({
			listStatus
		}).then((res) => {
			if(res.code === 200) {
				res.data ? this.setState({
					dataSource: res.data,
					dataSource_copy: res.data
				}) : this.setState({
					dataSource: [],
					dataSource_copy: []
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

	handleAdd() { //新增老人
		this.setState({
			infoFlag: true,
			dataList: {}
		});
	}

	handleIptText(target, e) { //老人信息各字段发生变化
		let dataList = Object.assign({}, this.state.dataList);
		dataList[target] = e.target ? e.target.value : e;
		this.setState({
			dataList
		});
	}

	handleSubmit() { //提交新增老人信息
		const _this = this;
		const {
			name,
			sex,
			age
		} = _this.state.dataList;
		if(!(name && sex && age)) {
			notification.warning({
				message: '提示：',
				description: '单据存在数据未填的情况，请仔细核对！',
			});
			return false
		}
		const data = _this.state.dataList;
		data.status = 2;
		httpServer.saveElderlyInfo(data).then((res) => {
			if(res.code === 200) {
				const args = {
					message: '通信成功',
					description: res.msg,
					duration: 2,
				};
				notification.success(args);
				_this.getListElderlyInfo();
				_this.handleCancelClick();
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
		}).catch((err) => {
			console.log(err);
		});
	}
	handleCancelClick() { //取消添加/修改老人信息
		this.setState({
			infoFlag: false,
			dataList: {}
		});
	}

	handleInputChange(e) { //老人姓名搜索框发生变化
		this.setState({
			searchText: e.target.value
		});
	}

	handleSearchElderly() {
		const {
			searchText
		} = this.state;
		if(searchText) {
			const reg = new RegExp(searchText, 'gi');
			const data = this.state.dataSource.filter((record) => record.name && record.name.match(reg));
			this.setState({
				dataSource_copy: data
			});
		} else {
		  this.setState(state=>{
		  	state.dataSource_copy = state.dataSource;
		  })
		}
	}

	handleClickReset() { //清楚搜索条件
		this.setState({
			dataSource_copy: this.state.dataSource,
			searchText: '',
		});
	}

	handleSearch() { //搜索货物老人列表
		this.setState({
			modalFlag: true
		});
	}

	handleCancel() { //取消弹框
		this.setState({
			modalFlag: false
		});
	}

	hangdleCheck(record) { //单击选中老人
		this.setState({
			estimateElderly: record,
			modalFlag: false
		});
	}
	//评估库
	listEvaluateType = () => {
		httpServer.listEvaluateType({}).then(res => {
			if(res.code === 200) {
				const data = res.data ? res.data : []
				this.setState({
					evaluateLib: data
				})
			} else {
				message.error('评估库通信故障')
			}
		})
	}
	changeResult = (typeId,result) => {
		let {
			evaluateLib,
			itemResult
		} = this.state;
		const type = evaluateLib.find(i => (i.id === typeId));
		itemResult[type.id] = {
			type,
			result
		};
		this.setState({
			itemResult
		})
	}
	handleChange = (value) => {
		this.setState({result:value})
	}
	saveEstimate=()=>{
	  	const {itemResult,estimateElderly,result}=this.state;  
	  	if(!estimateElderly.id){
	  		  message.info('请选择待评估老人');
	  		return;
	  	}
	  	if(!result){
	  		  message.info('请选择最终护理等级');
	  		return;
	  	}
	  	 
	  	let data = [];
	  	for(var k in itemResult){
	  		data=data.concat(itemResult[k].result.data)
	  	}
	  	this.setState({subLoading:true})
		  var values = {
						  "elderlyId": estimateElderly.id,
						  "estimate":moment().format("YYYY-MM-DD HH:mm:ss"),
						  "estimateGradeCode":result,
						  "estimateGradeName":result,
						  "tbElderlyEstimateItem":data,
						  'flag':this.props.isRegular?'2':'1',
		  }
		  const {rowId}= this.props;
		  
		  if(rowId){
		  	values.id = rowId;
		  }
		  const url = rowId?'/updateEvaluateDetail':'/saveEvaluateDetail';
	  
		  let request = new Request(host.api+url, {
				        body: JSON.stringify(values),
				        method: 'POST',
				        headers: new Headers({
				          'Content-Type': 'application/json;charset=utf-8'
				        })
				      });
				      fetch(request).then(resp => resp.json()).then( res => {
				      	this.setState({subLoading:false})
				      	 const args = {
										message:rowId?'修改成功':'新增成功',
										duration: 2,
									};
									notification.success(args);
									this.props.reback()
				      })
	  }
	render() {
		const {
			modalFlag,
			dataSource_copy,
			infoFlag,
			estimateElderly,
			newData,
			score,
			estimateGrade,
			subLoading,
			elderlyEvaluate,
			evaluateLib,
			itemResult,
			result
		} = this.state;
		const {
			name,
			sex,
			age
		} = this.state.dataList;
		const {
			isRegular
		} = this.props;

		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 5
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 19
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
			key: 'serialNumber',
			width: '10%'
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			width: '25%'
		}, {
			title: '年龄',
			dataIndex: 'age',
			key: 'age',
			align:'center',
			width: '25%'
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex',
			align:'center',
			render: (text, record) => {
				return record.sex === 1 ? < Tag color = "green" > 男 < /Tag>:<Tag color="red">女</Tag >
			},
		}];
		return(
			<Fragment>
        <Row gutter={16}>
           
           <Col xs={24} sm={18}>
              
	              <Tabs type="card">
				          {
				            evaluateLib.length>0&&evaluateLib.map((item,index)=>(
				          	  <TabPane tab={item.typeName} key={item.id}>
				          	      {elderlyEvaluate[item.id]?<EvaItem key={item.id} evaItem={item.tbEstimateLibraries} elderlyEvaluate={elderlyEvaluate[item.id]} changeGrade={this.changeResult}/>:<EvaItem key={index} evaItem={item.tbEstimateLibraries} changeGrade={this.changeResult}/>}
				          	  </TabPane>
				            ))
				          }
				        </Tabs>
			         
           </Col>
           <Col xs={24} sm={6}>
		         <Card
			        title="老人基础信息"
			        extra={<span>
			        	     <Button type="primary" onClick={this.props.reback} title="返回" icon="rollback"></Button>
				             <Button type="primary" onClick={this.handleSearch} title="搜索老人" icon="search"></Button>
				           </span>  
				          }
			        >
			           <Meta
			                avatar={<Avatar src={img} />}
			                title={estimateElderly.name?`${estimateElderly.name} -- ${estimateElderly.age}岁`:null}
			                description={estimateElderly.sex?<span>性别:&emsp;<Tag color="#108ee9">{estimateElderly.sex===1?'男':'女'}</Tag></span>:null}
			            />
			     </Card>
		        <Divider/>
		        <List
					size="small"
					bordered
		            header={<div>评估报告</div>}
					footer={<div style={{textAlign:'right'}}><Button type="primary" onClick={this.saveEstimate} loading={subLoading}>提交</Button></div>}
				    dataSource={Object.keys(itemResult)}
					renderItem={item => (<List.Item><Col span={10}>{itemResult[item].type.typeName}:&nbsp;</Col><Col span={14}><Tag color="purple">{itemResult[item].result.estimateGradeName}</Tag></Col></List.Item>)}
				>
				    <List.Item>
					    <Col span={10}><span className="gradeType">最终等级:&nbsp;</span></Col>
					    <Col span={14}>
							<Select style={{ width: 120 }} value={result} onChange={this.handleChange} size="small">
								<Option value="能力完好">能力完好</Option>
							    <Option value="轻度失能">轻度失能</Option>
							    <Option value="中度失能">中度失能</Option>
								<Option value="重度失能">重度失能</Option>
						    </Select>
					    </Col>
					</List.Item>				      
			</List>
           </Col>
        </Row>
       
       
            <Modal
              title="老人信息"
              visible={modalFlag}
              onCancel={this.handleCancel}
              footer={null}
              maskClosable={false}
            >
	           
	                <Modal
						title="老人信息"
						visible={infoFlag}
						onCancel={this.handleCancel}
						footer={null}
						maskClosable={false}
					>
                    <Form hideRequiredMark onSubmit={this.handleSubmit}>
                      <Form.Item
                        label='姓名'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        <Input placeholder='必填项' value={name} onChange={(e) => this.handleIptText('name',e)} />
                      </Form.Item>
                      <Form.Item
                        label='性别'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        <RadioGroup value={sex} onChange={(e) => this.handleIptText('sex',e)}>
                          <Radio value={"1"}>男</Radio>
                          <Radio value={"0"}>女</Radio>
                        </RadioGroup>
                      </Form.Item>
                      <Form.Item
                        label='年龄'
                        {...formItemLayout}
                        style={{marginBottom:'4px'}}
                      >
                        <InputNumber min={1} max={200} value={age} onChange={(e) => this.handleIptText('age',e)}/>
                      </Form.Item>
                      <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">确认</Button>
                        <Button type="primary" onClick={this.handleCancelClick}>取消</Button>
                      </Form.Item>
                    </Form>
                </Modal>
             
              <div style={{marginBottom:"20px"}}>
                <Input 
                  placeholder="按老人姓名搜索" 
                  style={{width:'40%',marginRight:'10px'}}
                  ref={ele => this.searchInput = ele}
                  value={this.state.searchText}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearchElderly}
                />
                <Button type="primary" onClick={this.handleSearchElderly}>查询</Button>
                <Button type="primary" onClick={this.handleClickReset}>刷新</Button>
                {isRegular?null:<Button type="primary" onClick={this.handleAdd}>临时新增</Button>}
              </div>
              <Table 
                size="middle"
                dataSource={dataSource_copy} 
                columns={columns} 
                pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
                rowKey={record => record.id}
                onRow={(record) => {
                  return {
                    onClick: () => {this.hangdleCheck(record);},       
                  };
                }}
              />
            </Modal>
      </Fragment>
		)
	}
}
export default EvaluateInfo;