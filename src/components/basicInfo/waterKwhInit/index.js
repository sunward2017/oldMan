import React,{Fragment,Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {notification,Card,Table,Divider,Popconfirm,Input,DatePicker,message} from 'antd';
import moment from 'moment';

class WaterKwhInit extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      edit:false,
      roomUuid:'',
      type:'',
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

  changeHandler(record,param,value){ //表格字段值发生变化\
    const roomUuid = record.roomUuid;
    const dataSource = this.state.dataSource;
    const newDataSource = dataSource && dataSource.map((item,index)=>{
      if(item.roomUuid === roomUuid){
        item[param] = value;
      }
      return item;
    });
    this.setState({dataSource:newDataSource});
  }

  handleModify(r,type){ //编辑
    const {roomUuid} = r;
    this.setState({edit:true,roomUuid,type});
  }

  handleSave(r){
  	const {type} = this.state;
    const {id,kwh,water,roomUuid,regDate} = r;
    if(!regDate){message.error("请输入出始化日期")}
    const data = {id,kwh,water,roomCode:roomUuid,regDate};
    httpServer.setRoomWaterAndKwh(data).then((res)=>{
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
      align:'center',
      key:'index'
    }, {
      title: '区域名称',
      dataIndex: 'areaName',
      key: 'areaName',
      align:'center',
      width: '10%'
    },{
      title: '房间名称',
      dataIndex: 'roomCode',
      key: 'roomCode',
      width: '10%',
      defaultSortOrder: 'ascend',
			sorter: (a, b) => a.roomCode-b.roomCode,
    },{
      title: '水表度数',
      dataIndex: 'water',
      key: 'water',
      align:'center',
      render:(text,record)=>{
        return(
          edit && (record.roomUuid === roomUuid)?
          <Input 
            value={record.water} 
            onChange={(e) => this.changeHandler(record,"water",e.target.value)}
            placeholder="只允许输入正整数"
          />:record.water
        ) 
      },
      width: '10%'
    },{
      title: '电表度数',
      dataIndex:'kwh',
      key:'kwh',
      align:'center',
      render:(text,record)=>{
        return (
          edit && (record.roomUuid === roomUuid)?
          <Input 
            value={record.kwh} 
            placeholder="只允许输入正整数"
            onChange={(e) => this.changeHandler(record,"kwh",e.target.value)}
          />:record.kwh
        ) 
      },
      width:'10%'
    },{
    	title:'出始化日期',
    	dataIndex:'regDate',
    	width:'15%',
    	align:'center',
    	render:(t,record)=>{
    		return(
    			 edit && (record.roomUuid === roomUuid)?
           <DatePicker 
            allowClear={false}
            format="YYYY-MM-DD HH:mm:ss"
            value={t?moment(t):moment()}
            onChange={(d,t) => this.changeHandler(record,"regDate",t)}
          />:t
    		)
    	}
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
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>初始化</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleModify(record,"reset") }} style={{color:'#606d10'}}>更换水电表</a>
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
              rowKey='roomUuid' 
              dataSource={dataSource} 
              columns={columns}
              pagination={{ defaultPageSize:10,showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
            />
          </Card>
      </Fragment>
    )   
  }
}

export default WaterKwhInit;