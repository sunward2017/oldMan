import React from 'react';
import { Card, Button, Divider, Table } from 'antd';

export const Balance = ({feeData, showFeeDetail}) => {
    return (
        <Card>
            <h2 style={{textAlign:'center'}}>费用余额:</h2>
            <Divider dashed="true" orientation="left" >定金</Divider>
            <h3> 预约定金 : {feeData.je1 || ''}</h3>
            <Divider dashed="true" orientation="left" >押金</Divider>
            <h3> 热水器押金 : {feeData.je2 || ''}</h3>
            <h3> &emsp;医疗押金 : {feeData.je3 || ''}</h3>
            <h3> &emsp;&emsp;锁押金 : {feeData.je4 || ''}</h3>
            <Divider dashed="true" orientation="left" >预交</Divider>
            <h3> 住院押金 : {feeData.je5 || ''}</h3>
            <h3> 住院预交 : {feeData.je6 || ''}</h3>
            <h3> 其他预交 : {feeData.je7 || ''}</h3>
            <Divider dashed="true" />
            <Button size="small" onClick={showFeeDetail}  type="danger"  disabled={!feeData.id}>费用明细</Button>
        </Card>
    )
};

export const DetailTable = ({listData}) => {
    const typeObj={1:'预约定金', 2:'热水器押金', 3:'医疗押金', 4:'锁押金',5:'住院押金', 6:'住院预交', 7:'其他预交'};
    const methodObj = {1:'现金', 2:'支付宝', 3:'微信', 4:'刷卡', 5:'预交扣款', 6:'其它'};
    const columns = [{
        title: '老人',
        dataIndex: 'name',
    },{
        title: '缴费项目',
        dataIndex: 'type',
        render: (text, record) => typeObj[text],
    },{
        title: '付款方式',
        dataIndex: 'settlementMethod',
        render: (text, record) => methodObj[text],
    },{
        title: '金额',
        dataIndex: 'money',
        render: (text) => <span style={{color:text >0 ? 'inherit':'red'}}>{text}</span>
    },{
        title: '付款时间',
        dataIndex: 'addtime',
    },{
        title:'操作员',
        dataIndex:'operator'
    }];
    return (
        <Table columns={columns} dataSource={listData} rowKey={record => record.id} />
    )
};