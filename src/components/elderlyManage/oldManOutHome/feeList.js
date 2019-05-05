import React, {Component,Fragment} from 'react';
import httpServer from '../../../axios';
import moment from 'moment';
import {Row,Col,Input,Button,Table,Modal,Tabs,Card,List,Avatar,Tag} from 'antd';

const TabPane = Tabs.TabPane;
const { Meta } = Card;
class FeeList extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalFlag:false,
      activeKey:'',
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleGoback = this.handleGoback.bind(this);
  }

  handleGoback(){
    this.props.handleGoback();
  }
  handleCancel(){//关闭弹出框
    this.setState({modalFlag:false});
  }
  handleClickViewDetails(param){
    this.setState({modalFlag:true,activeKey:param})
  }
  render(){
    const {f1,f2,f3,f4,f5,feeList1,feeList2,feeList3,feeList4,feeList5,record} = this.props;
    const {modalFlag,activeKey} = this.state;
    const columns1=[{
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
        width:'12%'
    }];
    const columns3 = [{
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
    const columns4 = [{
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
        dataIndex:'price'
    },{
        title:'金额',
        dataIndex:'money',
        width:'12%'
    }];
    const columns5 = [{
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
    return(
      <div>
        <Card 
          style={{marginBottom:10}}
          title="当前选中老人的基本信息" 
        >
          <h3>
            姓名:&emsp;<Tag color="blue">{record.name}</Tag>&emsp;
            性别:&emsp;<Tag color="geekblue">{record.sex===1?'男':'女'}</Tag>&emsp;
            年龄:&emsp;<Tag color="purple">{record.age}岁</Tag>
          </h3>
        </Card>
        <Card 
          title="未结算费用信息"
        >
          <List
            itemLayout="horizontal"
          >
            <List.Item actions={[<Button type="primary" onClick={()=>{this.handleClickViewDetails('nursingFee')}}>查看详情</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>检查护理费：</span>}
                description={<Input disabled value={f1} />}
              />
            </List.Item>
            <List.Item actions={[<Button type="primary" onClick={()=>{this.handleClickViewDetails('mealFee')}}>查看详情</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>餐费：</span>}
                description={<Input disabled value={f2}/>}
              />
            </List.Item>
            <List.Item actions={[<Button type="primary" onClick={()=>{this.handleClickViewDetails('waterFee')}}>查看详情</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>水电费：</span>}
                description={<Input disabled value={f3}/>}
              />
            </List.Item>
            <List.Item actions={[<Button type="primary" onClick={()=>{this.handleClickViewDetails('roomFee')}}>查看详情</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>住宿费：</span>}
                description={<Input disabled value={f4}/>}
              />
            </List.Item>
           
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>未结算金额合计：</span>}
                description={<Input disabled value={`${(f1+f2+f3+f4+f5).toFixed(2)}`}/>}
              />
            </List.Item>
            <List.Item>
              <Button type="primary" onClick={this.handleGoback} style={{position:'relative',left:'50%'}}>返回</Button>
            </List.Item>
          </List>
        </Card>
        {
          modalFlag?
            <Modal  
              title="未结算费用明细"
              visible={true}
              footer = {null}
              onCancel={this.handleCancel}
              width="80%"
            >
              <Tabs activeKey={activeKey}>
                <TabPane tab="检查护理费明细" key="nursingFee" disabled>
                  <Table columns={columns1} dataSource={feeList1} rowKey={record => record.id}/>  
                </TabPane>
                <TabPane tab="餐费明细" key="mealFee" disabled >
                  <Table columns={columns2} dataSource={feeList2} rowKey={record => record.id}/> 
                </TabPane>
                <TabPane tab="水电费明细" key="waterFee" disabled >
                  <Table columns={columns3} dataSource={feeList3} rowKey={record => record.id}/> 
                </TabPane>
                <TabPane tab="房费明细" key="roomFee" disabled >
                  <Table columns={columns4} dataSource={feeList4} rowKey={record => record.id}/> 
                </TabPane>
              </Tabs>
            </Modal>:null
        }
      </div>
    )
  }
}

export default FeeList;
/*<Meta
            avatar={<Avatar src="http://imgsrc.baidu.com/imgad/pic/item/09fa513d269759ee03b7bedab8fb43166d22df38.jpg" />}
            title={record.name}
            description={<span>性别:&emsp;<Tag color="#108ee9">{record.sex===0?'女':'男'}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{record.age}岁</Tag></span>}
          />*/
/* <TabPane tab="药费明细" key="drugFee" disabled >
                    <Table columns={columns5} dataSource={feeList5} rowKey={record => record.id}/> 
                </TabPane>*/
/* <List.Item actions={[<Button type="primary" onClick={()=>{this.handleClickViewDetails('drugFee')}}>查看详情</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon="star" />}
                title={<span>药费：</span>}
                description={<Input disabled value={f5}/>}
              />
            </List.Item>*/