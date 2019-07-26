import React,{Component,Fragment} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {Row,Popconfirm,notification,Col,Input,Button,Table,Divider,Tag,Card,Avatar,Modal,DatePicker} from 'antd';
import OldManInfo from './oldManInfo';
import OutHome from './outHome'
import moment from 'moment'


const Search = Input.Search;
const { Meta } = Card;
class OldManAdmission extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageFlag:true,
      customerId:'',
      oldManList:[],//老人列表数据
      oldManList_copy:[],//老人列表数据拷贝
      oldManInfoList:{},
      tab2Flag:false,
      roomDisflag:false,
      editFlag:'add',
      btnSubmitFlag:false,
      estimateGradeLists:[],//评估等级列表
      nursingGradeLists:[],
      modalFlag:false,
      recordInfo:'',
      imgSrc:'',
      outFlag:false,
      outDay:moment(), 
      outElderlyId:'',
      searchTxt:'',
    }
 
    this.handleAddOldMan = this.handleAddOldMan.bind(this);
    this.elderlyListFlagToTrue = this.elderlyListFlagToTrue.bind(this);//返回
    this.handleCancel = this.handleCancel.bind(this);//关闭弹出框
    this.handleOk = this.handleOk.bind(this);//下载二维码
  }
  componentDidMount(){
    this.getListElderlyInfo();
    this.getListNursingGrade();
  }
  //获取入院老人信息列表
  getListElderlyInfo(){
    const {customerId} = this.props.auth;
    this.setState({customerId});
    
    httpServer.listElderlyInfo({listStatus:"1,2,3",customerId,launchFlag:0}).then((res) => {
      if (res.code === 200) {
      	  const {searchTxt} = this.state;
      	  const data = res.data.map((i,k)=>({...i,orderId:k}))||[];
      		this.setState({oldManList:data},()=>{
      			  this.handleSearchElderly(searchTxt)
      		});
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
  
  handleSearchElderly=(searchText)=>{//搜索老人信息
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
       this.setState(state=>{
       	  state.oldManList_copy = state.oldManList;
       	  return state;
       })
    }
  }
  //返回
  elderlyListFlagToTrue(){
    this.setState({pageFlag:true});
    this.getListElderlyInfo();
  }
  //老人信息新增、查看、修改、删除相关操作
  handleClickRead(r){
    const {id} = r;
    const record = {...r,bedInfo:{roomName:r.roomName,roomCode:r.roomCode,bedNumber:r.bedNumber}};
    this.setState({pageFlag:false,oldManInfoList:record,tab2Flag:false,elderlyId:id,roomDisflag:true,editFlag:"read",btnSubmitFlag:false});
  }
  handleAddOldMan(){
    this.setState({pageFlag:false,oldManInfoList:{},tab2Flag:true,elderlyId:'',roomDisflag:false,editFlag:'add',btnSubmitFlag:false});
  }

  handleClickModify(r){
    const {id} = r;
    const record = {...r,bedInfo:{roomName:r.roomName,roomCode:r.roomCode,bedNumber:r.bedNumber}};
    this.setState({pageFlag:false,oldManInfoList:record,tab2Flag:false,elderlyId:id,roomDisflag:record.status && record.status === 3?true:false,editFlag:'edit',btnSubmitFlag:false});
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
 
  onChangeTxt=(e)=>{
     this.setState({searchTxt:e.target.value})
  }
  render(){
    const {pageFlag,oldManList_copy,customerId,oldManInfoList,modalFlag,recordInfo,imgSrc,outFlag,outDay,searchTxt,editFlag} = this.state;
    const columns = [{
      title: '序号',
      dataIndex:'orderId',
      width:'6%',
      align:'center',
      render:(text,record,index)=>`${text+1}`,
    },{
    	 title:'入院编号',
    	 dataIndex:'elderlyNo',
    	 width:'10%',
    	 align:'center',
    },{
      title: '老人姓名',
      dataIndex: 'name',
      key: 'name',
      width:'10%',
      align:'center'
    },{
    	title: '性别',
		  dataIndex: 'sex',
		  key: 'sex',
		  width:'6%',
		  align:'center',
		  render:(text)=>{
	   	  return text===1?<Tag color="#337AB7">男</Tag>:<Tag color="#F00">女</Tag>
		  }
    },{
      title: '房间名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width:'12%',
      align:'center'
    },{
      title:'入院时间',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      align:'center',
      width:'12%',
      render:(text,record)=>{
        return record.checkInDate && record.checkInDate.substr(0,10)
      }
    },{
      title:'状态',
      dataIndex: 'status',
      key: 'status',
      align:'center',
      width:"5%",
      render:(text,record)=>{
        if(record.status === 1){
          return <Tag color="#36ba4a">预约</Tag>
        }
        if(record.status === 2){
          return <Tag color="#2db7f5">临时</Tag>
        }
        if(record.status === 3){
          return <Tag color="#05a0a5">入住</Tag>
        }
      },
    },{
      title: '识别二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width:'5%',
      align:'center',
      render:(text,record)=>{
        return <Avatar size="small" icon="qrcode" onClick={()=>this.handleGetQrCode(record)}/>
      }
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width:'15%',
			align:'center',
      render:(text,record)=>{
        return(
          <span>
            <Button type="primary"  onClick={() => { this.handleClickRead(record) }} title="查看" icon="read" size="small"></Button>
            <Divider type="vertical" />
            <Button type="primary" title="修改" icon="edit" size="small"  onClick={() => { this.handleClickModify(record) }}></Button>
            <Divider type="vertical" />
            {record.status!==3?<Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
               <Button type="primary" title="删除" icon="delete" size="small"></Button>
            </Popconfirm>:null}
            <Divider type="vertical" />
            {
              record.status === 3?<OutHome elderlyId={record.id} refresh={()=>{this.getListElderlyInfo()}}/>:null
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
              <Card title="老人列表" bordered={false} extra={<span>
              	  <Search
							      placeholder="请输入关键字"
							      onChange={this.onChangeTxt}
							      value={searchTxt}
							      onSearch={this.handleSearchElderly}
							      style={{ width: 200 }}
							      enterButton
							    />&emsp;
              	  <Button onClick={this.handleAddOldMan} type="primary" icon="plus"></Button>
              	</span>}>
                <Table 
                  size="middle"
                  dataSource={oldManList_copy} 
                  columns={columns} 
                  pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
                  rowKey={record => record.id}
                />
              </Card>
          </Row>:<OldManInfo customerId={customerId} oldManInfoList ={oldManInfoList} tab2Flag={this.state.tab2Flag} elderlyId={this.state.elderlyId} roomDisflag={this.state.roomDisflag} editFlag={editFlag} elderlyListFlagToTrue={this.elderlyListFlagToTrue} nursingGradeLists={this.state.nursingGradeLists} estimateGradeLists={this.state.estimateGradeLists}/>
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