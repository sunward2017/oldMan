import React from 'react';
import { Tabs ,Tag} from 'antd';
import { BillInfo } from './billInfo';
import moment from 'moment';
const TabPane = Tabs.TabPane;


export const FeeTabs = ({data, selected, onBillSubmit, onTabChange}) => {
    const columnsN=[{
        title:'日期',
        dataIndex:'addtime',
        render:(text,record)=>{
            return moment(record.addtime,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
        }
    },{
        title:'项目名称',
        dataIndex:'itemName'
    },{
        title:'单价',
        dataIndex:'price'
    },{
        title:'次数',
        dataIndex:'times'
    },{
        title:'金额',
        dataIndex: 'money',
    },{
        title:'护理员',
        dataIndex:'workerName'
    },{
        title:'说明',
        dataIndex:'meno',
    }];
    const columnsM =[{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'项目名称',
        dataIndex:'itemName'
    },{
        title:'费用/月',
        dataIndex:'mealFee'
    },{
        title:'外出天数',
        dataIndex:'outDays'
    },{
        title:'减免金额',
        dataIndex:'returnMoney'
    },{
        title:'应收金额',
        dataIndex:'money',
        width:'12%'
    }];
    const columnsWC = [{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'房间',
        dataIndex:'roomName'
    },{
        title:'上次度数',
        dataIndex:'lastValue'
    },{
        title:'本次度数',
        dataIndex:'curValue'
    },{
        title:'抄表日期',
        dataIndex:'addtime'
    },{
        title:'使用度数',
        dataIndex:'diffValue'
    },{
       title:'类别',
       dataIndex:'flag',
       render:(text,record)=>{
          return record.flag === 1? <Tag color="magenta">水表</Tag>:<Tag color="green">电表</Tag>  
       }
    },{
        title:'单价',
        dataIndex:'price'
    },{
        title:'金额',
        dataIndex:'sumMoney'
    },{
        title:'分担比例',
        dataIndex:'percentage'
    },{
        title:'应收金额',
        dataIndex:'money',
        width:'12%'
    }];
    const columnsR = [{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'房间',
        dataIndex:'roomName'
    },{
        title:'入住天数',
        dataIndex:'days'
    },{
        title:'床位费/月',
        dataIndex:'bedFee'
    },{
        title:'金额',
        dataIndex:'money',
        width:'12%'
    }];
    const columnsD = [{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'发生日期',
        dataIndex:'finishtime'
    },{
        title:'药品名称',
        dataIndex:'drugName'
    },{
        title:'单价',
        dataIndex:'price'
    },{
        title:'金额',
        dataIndex:'money',
        width:'12%'
    }];
    return (
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
            <TabPane tab="检查护理结算" key="nursingFee" >
                <BillInfo data={{...data.nursingFee, type:'1'}} columns={columnsN} onBillSubmit={onBillSubmit} />
            </TabPane>
            <TabPane tab="餐费结算" key="mealFee" disabled={!selected} >
                <BillInfo data={{...data.mealFee, type:'2'}} columns={columnsM} onBillSubmit={onBillSubmit} />
            </TabPane>
            <TabPane tab="水电费结算" key="waterFee" disabled={!selected} >
                <BillInfo data={{...data.waterFee, type:'3'}} columns={columnsWC} onBillSubmit={onBillSubmit} />
            </TabPane>
            <TabPane tab="房费结算" key="roomFee" disabled={!selected} >
                <BillInfo data={{...data.roomFee, type:'4'}} columns={columnsR} onBillSubmit={onBillSubmit} />
            </TabPane>
            {/*<TabPane tab="药费结算" key="drugFee" disabled={!selected} >
                <BillInfo data={{...data.drugFee, type:'6'}} columns={columnsD} onBillSubmit={onBillSubmit} />
            </TabPane>*/}
        </Tabs>
    )
};