import React,{Component,Fragment} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {Row,Popconfirm,notification,Col,Input,Button,Table,Divider,Tag,Card,Avatar,Modal} from 'antd';
import OldManInfo from './oldManInfo';

const { Meta } = Card;
class OldManAdmission extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageFlag:true,
      customerId:'',
      oldManList:[],//老人列表数据
      oldManList_copy:[],//老人列表数据拷贝
      searchText:'',
      oldManInfoList:{},
      tab2Flag:false,
      roomDisflag:false,
      editFlag:false,
      btnSubmitFlag:false,
      estimateGradeLists:[],//评估等级列表
      nursingGradeLists:[],
      modalFlag:false,
      recordInfo:'',
      imgSrc:'',
    }
    this.handleInputChange = this.handleInputChange.bind(this);//老人信息搜索框发生变化
    this.handleSearchElderly = this.handleSearchElderly.bind(this);//搜索老人信息
    this.handleClickReset = this.handleClickReset.bind(this);//清楚搜索条件
    this.handleAddOldMan = this.handleAddOldMan.bind(this);
    this.elderlyListFlagToTrue = this.elderlyListFlagToTrue.bind(this);//返回
    this.handleCancel = this.handleCancel.bind(this);//关闭弹出框
    this.handleOk = this.handleOk.bind(this);//下载二维码
  }
  componentDidMount(){
    //获取入院老人信息列表
    this.getListElderlyInfo();
    this.getListEstimateGrade();
    this.getListNursingGrade();
  }
  //获取入院老人信息列表
  getListElderlyInfo(){
    const {customerId} = this.props.auth;
    this.setState({customerId});
    httpServer.listElderlyInfo({listStatus:"1,2,3",customerId,launchFlag:0}).then((res) => {
      if (res.code === 200) {
        res.data?this.setState({oldManList:res.data,oldManList_copy:res.data}):this.setState({oldManList:[],oldManList_copy:[]});
      } else {
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
             const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
         }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  //获取评估等级列表
  getListEstimateGrade(){
    const {customerId} = this.props.auth;
    httpServer.listEstimateGrade({customerId}).then((res) => {
      if (res.code === 200) {
        res.data?this.setState({estimateGradeLists:res.data}):this.setState({estimateGradeLists:[]});
      } else {
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
             const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
         }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  //获取护理等级列表
  getListNursingGrade(){
    const {customerId} = this.props.auth;
    httpServer.listNursingGrade({customerId}).then((res) => {
      if (res.code === 200) {
        res.data?this.setState({nursingGradeLists:res.data}):this.setState({nursingGradeLists:[]});
      } else {
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
             const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
         }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  //搜索老人信息相关操作
  handleInputChange(e){ //搜索框数据发生变化
    this.setState({searchText:e.target.value});
  }
  handleSearchElderly(){//搜索老人信息
    const { searchText } = this.state;
    if(searchText){
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        oldManList_copy: this.state.oldManList.map((record) => {
          const match = record.name && record.name.match(reg);
          if (!match) {
            return null;
          }
          return record;
        }).filter(record => !!record),
      });
    }else{
      const args = {
        message: '友情提示',
        description: "请先输入老人姓名",
        duration: 2,
      };
      notification.info(args);
    }
  }
  handleClickReset(){//清楚搜索条件
    this.setState({
      oldManList_copy:this.state.oldManList,
      searchText:'',
    });
  }

  //返回
  elderlyListFlagToTrue(){
  this.setState({pageFlag:true});
  this.getListElderlyInfo();
  }
  //老人信息新增、查看、修改、删除相关操作
  handleClickRead(r){
    const {id} = r;
    // const {account} = this.props.auth;
    // if(!record.opetator){
    //   record.opetator = account;
    // }
    const record = {...r,bedInfo:{roomName:r.roomName,roomCode:r.roomCode,bedNumber:r.bedNumber}};
    this.setState({pageFlag:false,oldManInfoList:record,tab2Flag:false,elderlyId:id,roomDisflag:true,editFlag:true,btnSubmitFlag:false});
  }
  handleAddOldMan(){
    //const {account} = this.props.auth;
    //opetator:account,
    this.setState({pageFlag:false,oldManInfoList:{shareProportionWater:50,shareProportionPower:50},tab2Flag:true,elderlyId:'',roomDisflag:false,editFlag:false,btnSubmitFlag:false,});
  }

  handleClickModify(r){
    const {id} = r;
    // const {account} = this.props.auth;
    // if(!record.opetator){
    //   record.opetator = account;
    // }
    const record = {...r,bedInfo:{roomName:r.roomName,roomCode:r.roomCode,bedNumber:r.bedNumber}};
    this.setState({pageFlag:false,oldManInfoList:record,tab2Flag:false,elderlyId:id,roomDisflag:record.status && record.status === 3?true:false,editFlag:false,btnSubmitFlag:false});
  }

  handleRowDelete(record){
    const {customerId} = this.props.auth;
    const {id} = record;
    httpServer.delElderlyInfo({id,customerId,status:5}).then((res)=>{
      if(res.code === 200){
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.getListElderlyInfo();
      }else{
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
            const args = {
              message: '通信失败',
              description: res.msg,
              duration: 2,
            };
          notification.error(args);
         }
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  handleOutHome(record){//出院申请
    const {id} = record;
    httpServer.outHomeInfo({id}).then((res) => {
      if (res.code === 200) {
        const args = {
            message: '通信成功',
            description: res.msg,
            duration: 2,
          };
          notification.success(args);
          this.getListElderlyInfo();
      } else {
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
             const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
         }
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  //二维码相关
  handleGetQrCode(record){
    const {id} = record;
    const {customerId} = this.props.auth;
    this.setState({modalFlag:true,recordInfo:record});
    httpServer.DispQRcode({id,customerId}).then((res)=>{
      if(res.code === 200){
        const imgSrc = "http://120.55.240.188:9803/upload/"+res.data;
        this.setState({imgSrc});
      }else{
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  handleCancel(){
    this.setState({modalFlag:false});
  }
  handleOk(){
    var iframeNode = document.getElementById('printWindow');
    if (iframeNode) {
      document.body.removeChild(iframeNode); 
      // 防止多次创建
    }
    var iframe = document.createElement('iframe');
    iframe.id = 'printWindow';
    iframe.style.display = "none";
    // iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    iframeNode = document.getElementById('printWindow');
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('img').innerHTML;
    iframeNode.contentDocument.body.appendChild(div);
    iframeNode.contentWindow.focus();
    iframeNode.contentWindow.print();
    
 
    
  }
  render(){
    const {pageFlag,oldManList_copy,customerId,oldManInfoList,modalFlag,recordInfo,imgSrc} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'6%'
    },{
      title:'入院编号',
      dataIndex: 'elderlyNo',
      key: 'elderlyNo',
      width:'10%'
    },{
      title: '老人姓名',
      dataIndex: 'name',
      key: 'name',
      width:'10%'
    },{
      title:'联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width:'12%'
    },{
      title: '房间名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width:'12%'
    },{
      title:'入院时间',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render:(text,record)=>{
        return record.checkInDate && record.checkInDate.substr(0,10)
      },
      width:'12%'
    },{
      title:'状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        if(record.status === 1){
          return <Tag color="#f50">预约</Tag>
        }
        if(record.status === 2){
          return <Tag color="#2db7f5">临时</Tag>
        }
        if(record.status === 3){
          return <Tag color="#87d068">入住</Tag>
        }
      },
      width:'12%'
    },{
      title: '获取二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width:'10%',
      render:(text,record)=>{
        return <Avatar size="large" icon="qrcode" onClick={()=>this.handleGetQrCode(record)}/>
      }
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render:(text,record)=>{
        return(
          <span>
            <a href="javascript:;" onClick={() => { this.handleClickRead(record) }} style={{color:'#2ebc2e'}}>查看</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleClickModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
              <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            {
              record.status === 3?
                <Popconfirm title="是否发起出院申请?" onConfirm={() => this.handleOutHome(record)}>
                  <a href="javascript:;" style={{color:'#2ebc2e'}}>出院申请</a>
                </Popconfirm>:null
            }    
          </span>
        )
      }
    }];
    return(
      <Fragment>
        <BreadcrumbCustom first="老人管理" second="在院管理" />
        {
          pageFlag?
          <Row>
            <Card bordered={false} style={{marginBottom:10}}>
                <Row gutter={16}>
                  <Col md={4}>
                    <Input 
                      placeholder="按老人姓名搜索"  
                      value={this.state.searchText}
                      onChange={this.handleInputChange}
                      onPressEnter={this.handleSearchElderly}
                    />
                  </Col>                
                    <Button onClick={this.handleSearchElderly} type="primary">搜索</Button>
                    <Button onClick={this.handleClickReset} type="primary">刷新</Button>
                </Row>
            </Card>
              <Card title="老人列表" bordered={false} extra={<Button onClick={this.handleAddOldMan} type="primary">新增入院老人</Button>}>
                <Table 
                  bordered
                  dataSource={oldManList_copy} 
                  columns={columns} 
                  pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
                  rowKey={record => record.id}
                />
              </Card>
          </Row>:<OldManInfo customerId={customerId} oldManInfoList ={oldManInfoList} tab2Flag={this.state.tab2Flag} elderlyId={this.state.elderlyId} roomDisflag={this.state.roomDisflag} editFlag={this.state.editFlag} elderlyListFlagToTrue={this.elderlyListFlagToTrue} nursingGradeLists={this.state.nursingGradeLists} estimateGradeLists={this.state.estimateGradeLists}/>
        }
        {
          modalFlag?
            <Modal  
              title="二维码"
              visible={true}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              okText="打印二维码"
            >
                <Card 
                  style={{marginBottom:10}}
                  title="当前选中老人的基本信息" 
                >
                  <h3>
                    姓名:&emsp;<Tag color="blue">{recordInfo.name}</Tag>&emsp;
                    性别:&emsp;<Tag color="geekblue">{recordInfo.sex===1?'男':'女'}</Tag>&emsp;
                    年龄:&emsp;<Tag color="purple">{recordInfo.age}岁</Tag>
                  </h3>
                </Card>
                <Card  title="二维码" >
                  <div style={{position:'relative',width:'100%',height:300}} id="img">
                    <img src={imgSrc} alt="没有二维码" style={{width:300,height:300,position:'absolute',left:"50%",top:'50%',marginLeft:'-150px',marginTop:'-150px'}}/>
                  </div>
                </Card>
                
            </Modal>:null
        }
      </Fragment>
    )
  }
}

export default OldManAdmission;
/*{
      title:'身份证号',
      dataIndex: 'idNumber',
      key: 'idNumber',
      width:'10%'
    },{
      title: '操作员',
      dataIndex: 'opetator',
      key: 'opetator',
      width:'10%',
    },*/
  /*
  <Meta
                      avatar={<Avatar src="http://imgsrc.baidu.com/imgad/pic/item/09fa513d269759ee03b7bedab8fb43166d22df38.jpg" />}
                      title={recordInfo.name}
                      description={<span>性别:&emsp;<Tag color="#108ee9">{recordInfo.sex===0?'女':'男'}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{recordInfo.age}岁</Tag></span>}
                  />
   */