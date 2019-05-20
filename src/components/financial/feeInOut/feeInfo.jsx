import React from 'react';
import { Card, Button, Divider, Table,Row,Col } from 'antd';

export const Balance = ({feeData, showFeeDetail}) => {
    return (
        <Card>
            
	            <h2 style={{textAlign:'center'}}>费用余额:</h2>
	            <Divider dashed="true" orientation="left" >定金</Divider>
	            <Row gutter={32}><Col span={12} className="label"> 预约定金 :</Col><Col span={12} className="content">{feeData.je1 || 0}元</Col> </Row>
	            <Divider dashed="true" orientation="left" >押金</Divider>
	            <Row gutter={32}><Col span={12} className="label"> 热水器押金:</Col><Col span={12} className="content">{feeData.je2 || 0}元</Col> </Row>
	            <Row gutter={32}><Col span={12} className="label"> 医疗押金 :</Col><Col span={12} className="content">{feeData.je3 || 0}元</Col> </Row>
	            <Row gutter={32}><Col span={12} className="label"> 锁押金 :</Col><Col span={12} className="content">{feeData.je4 || 0}元</Col> </Row>
	            <Divider dashed="true" orientation="left" >预交</Divider>
	            <Row gutter={32}><Col span={12} className="label"> 住院押金:</Col><Col span={12} className="content">{feeData.je5 || 0}元</Col> </Row>
	            <Row gutter={32}><Col span={12} className="label"> 住院预交 :</Col><Col span={12} className="content">{feeData.je6 || 0}元</Col> </Row>
	            <Row gutter={32}><Col span={12} className="label"> 其他预交 :</Col><Col span={12} className="content">{feeData.je7 || 0}元</Col> </Row>
	            <Divider dashed="true" />
	            {showFeeDetail?<Button size="small" onClick={showFeeDetail}  type="danger"  disabled={!feeData.id}>费用明细</Button>:null}
            
            <style>{
            	`
            	  .label{
            	  	text-align:right;
            	  }
            	  .content{
            	  	color:red;
            	  }
            	`
            }</style>
        </Card>
    )
};

export const DetailTable = ({listData,bills}) => {
    const typeObj={1:'预约定金', 2:'热水器押金', 3:'医疗押金', 4:'锁押金',5:'住院押金', 6:'住院预交', 7:'其他预交'};
    const methodObj = {1:'现金', 2:'支付宝', 3:'微信', 4:'刷卡', 5:'其它'};
    const columns = [{
        title: '老人',
        dataIndex: 'name',
    },{
    	title: '付款人',
        dataIndex: 'payName',
    },{
        title: '付款项目',
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
    },{
    	title:'操作',
    	dataIndex:'action',
    	render:(t,r)=>{
    		return  <Button type="primary" icon="printer"  onClick={()=>bills(r)}></Button>
    	}
    }];
    return (
        <Table columns={columns} dataSource={listData} rowKey={record => record.id} />
    )
};