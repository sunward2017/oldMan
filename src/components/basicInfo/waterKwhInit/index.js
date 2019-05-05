import React,{Fragment,Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {notification,Card,Table,Divider,Popconfirm,Input} from 'antd';

class WaterKwhInit extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      edit:false,
      roomUuid:'',
    }
  }
  componentDidMount(){
    this.getWaterKwhInitList();
  }
  getWaterKwhInitList(){
    const {customerId} = this.props.auth;
    httpServer.listRoomWaterAndKwhIni({customerId}).then((res)=>{
       if (res.code === 200) {
          res.data?this.setState({dataSource:res.data}):this.setState({dataSource:[]});
        }else{
          const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          }
          notification.error(args);
        }
    }).catch((err)=>{
      console.log(err);
    });
  }

  changeHandler(record,param,e){ //表格字段值发生变化
    const roomUuid = record.roomUuid;
    const dataSource = this.state.dataSource;
    const newDataSource = dataSource && dataSource.map((item,index)=>{
      if(item.roomUuid === roomUuid){
        item[param] = e.target.value;
      }
      return item;
    });
    this.setState({dataSource:newDataSource});
  }

  handleModify(r){ //编辑
    const {roomUuid} = r;
    this.setState({edit:true,roomUuid,});
  }

  handleSave(r){
    const {customerId} = this.props.auth;
    const {id,kwh,water,roomUuid} = r;
    httpServer.setRoomWaterAndKwh({customerId,id,kwh,water,roomCode:roomUuid}).then((res)=>{
      if(res.code === 200){
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        }
        notification.success(args);
        this.setState({edit:false,roomUuid:''});
        this.getWaterKwhInitList();
      }else{
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        }
        notification.error(args);
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  handleCancle(){//取消编辑
    this.setState({edit:false,roomUuid:''},()=>{
      this.getWaterKwhInitList();
    });
  }
  render(){
    const {dataSource,roomUuid,edit} = this.state;
    const columns = [{
      title: '序号',
      render: (text, record, index) => `${index+1}`,
      width: '5%',
      key:'index'
    }, {
      title: '区域名称',
      dataIndex: 'areaName',
      key: 'areaName',
      width: '10%'
    },{
      title: '房间名称',
      dataIndex: 'roomCode',
      key: 'roomCode',
      width: '10%'
    },{
      title: '水表度数',
      dataIndex: 'water',
      key: 'water',
      render:(text,record)=>{
        return(
          edit && (record.roomUuid === roomUuid)?
          <Input 
            value={record.water} 
            onChange={(e) => this.changeHandler(record,"water",e)}
            placeholder="只允许输入正整数"
          />:record.water
        ) 
      },
      width: '10%'
    },{
      title: '电表度数',
      dataIndex:'kwh',
      key:'kwh',
      render:(text,record)=>{
        return (
          edit && (record.roomUuid === roomUuid)?
          <Input 
            value={record.kwh} 
            placeholder="只允许输入正整数"
            onChange={(e) => this.changeHandler(record,"kwh",e)}
          />:record.kwh
        ) 
      },
      width:'10%'
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '8%',
      render: (text, record) => {
        return(
          edit && (record.roomUuid === roomUuid)?
          <span>
            <a href="javascript:;" onClick={() => { this.handleSave(record) }} style={{color:'#2ebc2e'}}>保存</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleCancle() }} style={{color:'#2ebc2e'}}>取消</a>
          </span>:
          <span>
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>编辑</a>
          </span>
        )
      },
    }];
    return(
      <Fragment>
        <BreadcrumbCustom first="基础信息" second="水电表初始化" />
        <Card 
          title="水电表初始化列表" 
          bordered={false} 
        >
            <Table 
              bordered
              rowKey='roomUuid' 
              dataSource={dataSource} 
              columns={columns}
              pagination={{ defaultPageSize:10000,showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
            />
          </Card>
      </Fragment>
    )   
  }
}

export default WaterKwhInit;