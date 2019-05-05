import React from 'react';
import { Card, notification, Table, Collapse, Tag, TreeSelect, Row, Col, Input, DatePicker } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import moment from 'moment';
const Panel = Collapse.Panel;
const Search = Input.Search;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;

export default class DrugUsageInfo extends React.Component {
    state = {
        list: [],
        treeData:[],
        oneDayDrugListObj:{},
    };
    componentDidMount() {
        this.fetchElderlyRoomTree();
    }
    fetchElderlyRoomTree(){
        const { customerId } = this.props.auth;
        httpServer.listAreaInfo({customerId}).then(res => {
            // console.log('room info:',res);
            res.code ===200 ? this.setState({treeData:res.data ? [res.data] : []}) : this.setState({treeData:[]});
        })
    }
    fetchElderlyUseDrugInfoList(elderlyId, date){
        const { customerId } = this.props.auth;
        httpServer.listElderlyUseDrugInfo({customerId, elderlyId, runtime:date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : undefined}).then(res => {
            console.log('drug list: ',res);
            this.setState({oneDayDrugListObj : {...this.state.oneDayDrugListObj, [elderlyId]:res.data || []}});
            res.code !== 200 && this.notice('error', res.msg);
        })
    }
    fetchElderlyByKey(searchKey){
        // console.log('search key:',searchKey);
        const { customerId } = this.props.auth;
        httpServer.listElderlyInfo({customerId, listStatus:'3', launchFlag:0, ...searchKey }).then(res => {
            // console.log(res);
            const list = res.data || [];
            this.setState({list, activeKey:list[0] && list[0].id.toString()});
            res.code ===200 ? this.notice('success', res.msg) : this.notice('error', res.msg) ;
            list.length>0 && !this.state.oneDayDrugListObj[list[0].id] && this.fetchElderlyUseDrugInfoList(list[0].id, this.state.runtime);
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
    renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode title={item.areaName} key={item.id} value={item.areaCode}>
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
        // console.log('onChange ', value);
        value.length >0 ? this.fetchElderlyByKey({areaCode:value.join(',')}) : this.setState({list: []});
    };
    onNameSearchHandler = (value) => {
        // console.log('search...');
        /\S+/.test(value) && this.fetchElderlyByKey({name:value.trim()});
    };
    onDateChange = (date, dateString) => {
        console.log(date, dateString);
        this.setState({runtime: dateString, oneDayDrugListObj:{}});
        const { list, activeKey } = this.state;
        list.length>0 && this.fetchElderlyUseDrugInfoList(activeKey, date);
    };
    render() {
        const { list, activeKey, treeData, oneDayDrugListObj, runtime } = this.state;
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
            dataIndex:'tbDrugInfo.indicationsFunction'
        },{
            title: '数量',
            dataIndex: 'quantity',
        },{
            title: '单位',
            dataIndex: 'tbDrugInfo.minUnit',
        }];
        return (
            <div>
                <BreadcrumbCustom first="医护管理" second="用药信息" />
                <Card bordered={false}>
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
                                placeholder="按老人姓名(全名)搜索"
                                onSearch={value => this.onNameSearchHandler(value)}
                                enterButton
                            />
                        </Col>
                        <Col md={4}>
                            <DatePicker onChange={this.onDateChange} defaultValue={moment(new Date(), 'YYYY-MM-DD')} />
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} style={{marginTop:'10px'}}>
                    {
                        list.length>0 ?
                            <Collapse bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
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
                </Card>
            </div>
        )
    }
}
