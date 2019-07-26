import React, {Component,Fragment} from 'react';
import httpServer from '../../../axios';
import moment from 'moment';
import {Row,Col,Input,Button,Table,Tabs,Card,List,Avatar,Tag} from 'antd';
import { Balance} from '../../financial/feeInOut/feeInfo';

const TabPane = Tabs.TabPane;
const { Meta } = Card;
class FeeList extends Component{
  constructor(props){
    super(props);
    this.handleGoback = this.handleGoback.bind(this);
  }

  handleGoback(){
    this.props.handleGoback();
  }
  
  render(){
    const {f1,f2,f3,f4,f5,feeList1,feeList2,feeList3,feeList4,feeList5,record,feeData} = this.props;
    const columns1=[{
      title:'结算日期',
      dataIndex:'endTime',
      render:(text,record)=>{
          return  text.substr(0,10)
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
    }];
    const columns2 =[{
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
        width:'12%',
        align:'center'
    }];
    const columns3 = [{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'房间',
        dataIndex:'roomName'
    },{
        title:'上次度数',
        dataIndex:'lastValue',
        align:'center'
    },{
        title:'本次度数',
        dataIndex:'curValue',
        align:'center'
    },{
        title:'抄表日期',
        dataIndex:'regDate',
        render:(t,r)=>{
        	return t&&t.substr(0,10)
        }
    },{
        title:'使用度数',
        dataIndex:'diffValue',
        align:'center'
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
        dataIndex:'sumMoney',
        align:'center'
    },{
        title:'分担比例',
        dataIndex:'percentage',
        align:'center',
        render:(t,r)=>{
        	 return t?t+'%':'';
        }
    },{
        title:'应收金额',
        dataIndex:'money',
        width:'12%'
    }];
    const columns4 = [{
        title: '月份',
        dataIndex: 'month',
    },{
        title:'房间',
        dataIndex:'roomName'
    },{
        title:'床位费/月',
        dataIndex:'bedFee'
    },{
        title:'金额',
        dataIndex:'money',
        width:'12%',
        align:'center'
    }];
    return(
      <div>
        <Card 
          className="mb-l"
          title="基本信息"
          extra={<span>未结算合计:&emsp;<span className="blue">{Math.round(+(f1+f2+f3+f4+f5))}元</span>&emsp;&emsp;<Button title="返回" type="primary" onClick={this.handleGoback} icon="rollback"></Button></span>}
        >
        <h3>
           姓名:&emsp;<Tag color="#2db7f5">{record.name}</Tag>&emsp;性别:&emsp;<Tag color="#87d068">{record.sex===1?'男':'女'}</Tag>&emsp;年龄:&emsp;<Tag color="#108ee9">{record.age}岁</Tag>   
        </h3>
        </Card>
        <Row gutter={16}>
           <Col sm={24} md={20}>
            <Col sm={24} md={12}>
		        <Card title="检查护理费" className="mb-l" extra={<span>合计:&emsp;<span className="blue">{f1}元</span></span>}>
		            <Table size='small' columns={columns1} dataSource={feeList1} rowKey={record => record.id}/>  
		        </Card>
	        </Col>
	        <Col sm={24} md={12}>
		        <Card title="餐费"  className="mb-l"  extra={<span>合计:&emsp;<span className="blue">{f2}元</span></span>}>
		            <Table size='small' columns={columns2} dataSource={feeList2} rowKey={record => record.id}/>  
		        </Card>
	        </Col>
	        <Col sm={24} md={14}>
		        <Card title="水电费"  className="mb-l"  extra={<span>合计:&emsp;<span className="blue">{f3}元</span></span>}>
		            <Table size='small' columns={columns3} dataSource={feeList3} rowKey={record => record.id}/>  
		        </Card>
	         </Col>
	        <Col sm={24} md={10}>
		        <Card title="床位费"  className="mb-l"  extra={<span>合计:&emsp;<span className="blue">{f4}元</span></span>}>
		            <Table size='small' columns={columns4} dataSource={feeList4} rowKey={record => record.id}/>  
		        </Card>
		    </Col>
		   </Col>
		   <Col sm={24} md={4}>
	           <Balance feeData={feeData}/>
	       </Col>
        </Row>
      </div>
    )
  }
}

export default FeeList;
 