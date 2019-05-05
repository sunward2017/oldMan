import React , { Component } from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {Tag,Table,Divider,Popconfirm,notification,Button,Card} from 'antd';
import ModalInfo from './DrugInfoModal';
class DrugInfo1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      modalFlag:false,
      action:'',
      unitList:[],
      record:{},
      flag:false,
      customerId:'',
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(){
    this.getDrugList();
    this.getUnitList();
  }

  //获取药品列表
  getDrugList(){
    const {customerId} = this.props.auth;
    httpServer.listDrugInfoInfo({customerId}).then(res => {
      if (res.code === 200) {
        res.data ? this.setState({ dataSource: res.data }) : this.setState({ dataSource: [], });
      } else {
        const args = {
          message: '通信失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  //获取单位列表
  getUnitList(){
    httpServer.listParam({type:1},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({unitList:res.data},()=>{console.log(res.data);}):this.setState({unitList:[]});
      } else {
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch((err)=>{
      console.log(err);
    });
  }
  

  //查看详细药品信息
  handleRead(record){
    this.setState({modalFlag:true,action:'read',record,flag:true,});
  }
  // 添加药品
  handleAdd(){
    this.setState({modalFlag:true,record:{},flag:false,action:''});
  }

  //修改药品信息
  handleModify(record){
    this.setState({modalFlag:true,action:'',record,flag:false,});
  }

  //删除药品信息
  handleRowDelete(id,record){
    const _this = this;
    httpServer.deleteDrugInfo({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.getDrugList();
      } else {
        console.log(res.message);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  //关闭modal
  handleCancel(){
    this.setState({modalFlag:false});
  }

  render(){
    const { dataSource ,modalFlag,unitList,record,flag,action} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      width:'5%',
      key:'index'
    },{
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
      width:'10%'
    },{
      title:'单价',
      dataIndex: 'referencePrice',
      key: 'referencePrice',
      width:'5%'
    },{
      title: '是否为处方药',
      dataIndex: 'prescription',
      key: 'prescription',
      render:(text,record)=>{
        return record.prescription === 0?<Tag color="red">非处方药</Tag>:<Tag color="green">处方药</Tag>
        
      },
      width:'10%'
    },{
      title: '是否为医保用药',
      dataIndex: 'insurance',
      key: 'insurance',
      render:(text,record)=>{
        return record.insurance === 0?<Tag color="red">非医保用药</Tag>:<Tag color="green">医保用药</Tag>
      },
      width:'10%'
    },{
      title: '药品功能',
      dataIndex: 'indicationsFunction',
      key: 'indicationsFunction',
      width:'16%'
    },{
      title: '使用方式',
      dataIndex: 'usage1',
      key: 'usage1',
      width:'16%'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 0?<Tag color="red">注销</Tag>:<Tag color="green">正常</Tag>
      },
      width:'5%'
    },{
      title: '操作日期',
      dataIndex: 'operatedOn',
      key: 'operatedOn',
      render:(text,record)=>{
        return record.operatedOn && record.operatedOn.substr(0,10)
      },
      width:'12%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record)=>{
        return(
          <span>
            <a href="javascript:;" onClick={() => { this.handleRead(record) }} style={{color:'#2ebc2e'}}>查看</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
        )
      },
    }];
    return(
      <div>
        <BreadcrumbCustom first="药品管理" second="药品信息" />
        <Card 
          title="药品信息"
          bordered={false} 
          extra={<Button type="primary" onClick={this.handleAdd}>点击添加</Button>}
        >
        <Table 
          bordered
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
          rowKey={record => record.id}
        />
        </Card>
        {
          modalFlag?<ModalInfo customerId={this.props.auth.customerId} cancleClick={this.handleCancel} unitList={unitList} record={record} flag={flag} action={action} getDrugList={()=>{this.getDrugList()}} /> :null
        }
      </div>
    )
  }
}

export default DrugInfo1;
/*{
      title: '审计日期',
      dataIndex: 'auditOn',
      key: 'auditOn',
      width:'12%'
    }*/