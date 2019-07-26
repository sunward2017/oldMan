import React from 'react';
import { Card, notification, Table, Collapse, Tag, Tree, Row, Col, Input, DatePicker,Pagination,Tooltip} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import moment from 'moment';

const Panel = Collapse.Panel;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

export default class DrugUsageInfo extends React.Component {
    state = {
    	dataSource:[],
        list: [],
        treeData:[],
        oneDayDrugListObj:{},
    };
    componentDidMount() {
        this.fetchElderlyRoomTree();
    }
    fetchElderlyRoomTree(){
        httpServer.listAreaInfo().then(res => {
            res.code ===200 ? this.setState({treeData:res.data ? [res.data] : []}) : this.setState({treeData:[]});
        })
    }
    fetchElderlyUseDrugInfoList(elderlyId, date){
        httpServer.listElderlyUseDrugInfo({ elderlyId, runtime:date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : undefined}).then(res => {
            this.setState({oneDayDrugListObj : {...this.state.oneDayDrugListObj, [elderlyId]:res.data || []}});
            res.code !== 200 && this.notice('error', res.msg);
        })
    }
    fetchElderlyByKey(searchKey){
        httpServer.listElderlyInfo({listStatus:'3', launchFlag:0, ...searchKey }).then(res => {
        	 res.code ===200 ? this.notice('success', res.msg) : this.notice('error', res.msg) ;
            const dataSource = res.data || [];
            const list = dataSource.slice(0,10)
            this.setState({dataSource,list, activeKey:dataSource[0]&& dataSource[0].id.toString()},()=>{
            	 list.length>0 && !this.state.oneDayDrugListObj[list[0].id] && this.fetchElderlyUseDrugInfoList(list[0].id, this.state.runtime);
            });
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    paginationChange=(page,pageSize)=>{
    	const {dataSource} = this.state;
    	const list = dataSource.slice((page-1)*10,page*10);
    	this.setState({list})
    }
    renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode title={item.areaName} key={item.areaCode} value={item.areaCode}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.areaName} key={item.id} value={item.areaCode} />;
    });
    onCollapseChangeHandler = (key) => {
        this.setState({activeKey: key});
        !this.state.oneDayDrugListObj[key] && this.fetchElderlyUseDrugInfoList(key);
    };
    onTreeSelectChangeHandler = (value) => {
        if(value.length>0){
        	this.fetchElderlyByDrug(value[0])
        }
    };
    fetchElderlyByDrug=(areaCode)=>{
    	httpServer.listElderlyDrugScheduledInfo({listStatus:'3', launchFlag:0, areaCode}).then(res => {
            const dataSource = res.data || [];
            const list = dataSource.slice(0,10)
            this.setState({dataSource,list, activeKey:dataSource[0]&& dataSource[0].id.toString()},()=>{
            	 list.length>0 && !this.state.oneDayDrugListObj[list[0].id] && this.fetchElderlyUseDrugInfoList(list[0].id, this.state.runtime);
            });
    	})
    }
    onNameSearchHandler = (value) => {
        /\S+/.test(value) && this.fetchElderlyByKey({name:value.trim()});
    };
    onDateChange = (date, dateString) => {
        this.setState({runtime: dateString, oneDayDrugListObj:{}});
        const { list, activeKey } = this.state;
        list.length>0 && this.fetchElderlyUseDrugInfoList(activeKey, date);
    };
    render() {
        const { list,dataSource,activeKey, treeData, oneDayDrugListObj, runtime } = this.state;
        const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		},{
            title: '药品名',
            dataIndex: 'tbDrugInfo.name',
        },{
            title:'条码',
            dataIndex:'tbDrugInfo.barcode'
        },{
        	title:'服用时间',
        	dataIndex:'point',
        	render:(t,r)=>{
        		return r.runtime?r.runtime.split(' ')[0]+t:t;
        	}
        },{
            title:'功效',
            dataIndex:'tbDrugInfo.indicationsFunction',
            width:'20%',
            onCell: () => {
		        return {
		          style: {
		            maxWidth: 150,
		            overflow: 'hidden',
		            whiteSpace: 'nowrap',
		            textOverflow:'ellipsis',
		            cursor:'pointer'
		          }
		        }
		    },
		    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },{
            title: '数量',
            dataIndex: 'quantity',
        },{
        	title:'状态',
        	dataIndex:'state',
        	render:(t,r)=>{
        		return t==1?<Tag color="green">已服用</Tag>:<Tag color="red">未服用</Tag>;
        	}
        }];
        return (
            <div>
                <BreadcrumbCustom first="医护管理" second="用药信息" />
                <Row gutter={16}>
	                <Col  xs={{ span: 24}} md={{ span: 4}}>
		                <Card title="房间楼层" bordered={false} >
			              <Tree
			                defaultExpandAll
					         onSelect={this.onTreeSelectChangeHandler}
					      >
					        {this.renderTreeNodes(treeData)}
					      </Tree>
					    </Card>  
		            </Col>
		            <Col  xs={{ span: 24}} md={{ span: 20}} style={{background:'#fff'}}>
		                <Card title="入住老人" extra={<Row gutter={16}>
		                   <Col span={12}>
		                	 <Search  placeholder="入住老人(全名)" onSearch={value => this.onNameSearchHandler(value)} enterButton/>
		                   </Col>
		                   <Col span={12}>
		                      日期: <DatePicker onChange={this.onDateChange} defaultValue={moment(new Date(), 'YYYY-MM-DD')} />
		                   </Col>
		                </Row>}>
		                   {
		                        list.length>0?
		                            <Collapse  bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
		                                {
		                                    list.map(item => (
		                                        <Panel
		                                            header={<div><Tag color="#108ee9">{item.name}</Tag> -- {item.age}岁 -- {item.roomName}房间</div>}
		                                            key={item.id}
		                                        >
		                                            <p>{runtime || moment(new Date()).format('YYYY-MM-DD') } 用药信息：</p>
		                                            <Table columns={columns} dataSource={oneDayDrugListObj[item.id]} size="small" rowKey={record => record.id} />
		                                        </Panel>
		                                    ))
		                                }
		                            </Collapse> : '无搜索结果'
		                    }
		                   <Pagination defaultCurrent={1} total={dataSource.length} onChange={this.paginationChange}/>
		                </Card>
		            </Col>
                </Row> 
            </div>
        )
    }
}
