import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'react-redux'
import { Table, Tag,Tree,Row,Col,notification,Card,Icon,Modal,Empty} from 'antd';
import BreadcrumbCustom from '../components/BreadcrumbCustom';
import httpServer from '@/axios/index';
import { drugElderlyInfo } from '@/action';
import ChangeNursingGrade from '../components/elderlyManage/changeNursingGrade';
import ChangeRoom from '../components/elderlyManage/changeRoom';
import ChangeProportion from '../components/elderlyManage/changeProportion';
import imgUrl from '@/style/imgs/room.jpg';

const TreeNode = Tree.TreeNode;
const {Meta} = Card;
class Plan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			record: {},
			customerId:'',
			operator:'',
			areaTree:[],
			visible:false,
			second:'用药计划',
			elderlyInfo:{},
			deptFlag:'1',
			nursingGrade:{},
			Grades:[],
			rooms:[],
			tbVisible:false,
			roomUuid:'',
		}
	}
	componentDidMount() {
		const auth = this.props.auth;
		var url = this.props.location.pathname;
		var second = '';
		if(url.indexOf('drugUsePlan')>-1){
			second = '用药计划';
		}else if(url.indexOf('changeRoom')>-1){
			second = '换房处理';
		}else if(url.indexOf('nursingGradeChange')>-1){
			second = '护理等级变更';
		}else{
			second ='水电比例变更';
		}
		this.setState({second,customerId:auth.customerId,operator:auth.account},function(){
			this.getNursingGradeList()
			this.AreaTree()
		})
		 
	}
	AreaTree=()=>{
		const customerId = this.state.customerId;
		httpServer.listAreaInfo({customerId}).then(res=>{
			if(res.code===200){
				const data = res.data?[res.data]:[];
				this.setState({areaTree:data})
			}else{
				const args = {
		          message: '失败',
		          description: res.msg,
		          duration: 2,
		        };
		        notification.error(args);
			}
		})
	}
	List() {
		const customerId = this.state.customerId;
		httpServer.listDrugTemplate({customerId}).then(res => {
			if(res.code===200) {
				this.setState({
					dataSource: res.data?res.data:[]
				})
			}else{
				console.log(res)
			}
		})
	}
	 

	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteDrugScheduled({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '通信成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      } else {
	         const args = {
	          message: '失败',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.error(args);
	      }
	      this.setState({modalFlag:false,record:{}});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd(r) {
		this.props.dispatch(drugElderlyInfo(r));
		const url= this.props.location.pathname;
		this.props.history.replace(url+'/edit');
	}
	
	renderTreeNodes = data => data.map((item) => {
	    if (item.children) {
	      return (
	        <TreeNode title={item.areaName} key={item.id} value={item.id}>
                 {this.renderTreeNodes(item.children)}
            </TreeNode>
	      );
	    }
	    return <TreeNode {...item} />;
	})
    onTreeSelectChangeHandler = (value) => {
       httpServer.listRoomInfo({areaId:value[0]}).then(res => {
       	 if(res.code===200){
       	 	const data= res.data||[];
       	 	this.setState({rooms:data})
       	 }else{
       	 	this.notice('error', res.msg) ;
       	 }
       	
       })
    }
    editElderly=(r)=>{
    	this.setState({roomUuid:r.roomUuid},function(){
    		this.fetchElderly();
    	})
    }
    fetchElderly=()=>{
    	const roomUuid = this.state.roomUuid;
    	const searchKey = sessionStorage.getItem('key')
        httpServer.listElderlyInfo({customerId:this.state.customerId, listStatus:'3', roomCode:roomUuid }).then(res => { 
            if(res.code !==200){this.notice('error', res.msg);return };
            const data = res.data?res.data:[];
            this.setState({dataSource:data,tbVisible:true});
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    handleChange=(r,flag)=>{
    	this.setState({visible:true,elderlyInfo:r});
    }
    registerComponent=()=>{
    	const {elderlyInfo,Grades} = this.state;
    	if(this.state.second==='换房处理'){
    		return <ChangeRoom elderlyInfo={elderlyInfo} close={this.cancel} auth={this.props.auth}/>
    	}else if(this.state.second==='护理等级变更'){
    		return <ChangeNursingGrade elderlyInfo={elderlyInfo}  close={this.cancel} auth={this.props.auth} grades={Grades}/>
    	}else{
    		return <ChangeProportion elderlyInfo={elderlyInfo} close={this.cancel} />
    	}
    }
    cancel=()=>{
	    this.setState({visible:false},()=>{
	    	this.fetchElderly();
	    })
    }
    getNursingGradeList(){
	    const {customerId} = this.props.auth;
	    httpServer.listNursingGrade({customerId}).then((res)=>{
	       if (res.code === 200) {
	           let nursingGrade = {};
	           res.data&&res.data.forEach(t=>{
	           	  nursingGrade[t.nursingGradeCode]= t.nursingGradeName;
	           })
	           this.setState({nursingGrade,Grades:res.data})
	        } else {
	           this.setState({nursingGrade:{},Grades:[]})
	        }
	    }).catch((err)=>{
	      console.log(err);
	    });
	}
	render() {
		const {
			dataSource,
			areaTree,
			visible,
			rooms,
			tbVisible
		} = this.state;
	 	const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      width:'5%'
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
		      title: '年龄',
		      dataIndex: 'age',
		      key: 'age',
		      width:'10%'
		    },{
		      title: '性别',
		      dataIndex: 'sex',
		      key: 'sex',
		      width:'10%',
		      render:(text)=>{
		      	 return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
		      }
		    },{
		      title: '房间名称',
		      dataIndex: 'roomName',
		      key: 'roomName',
		      width:'10%'
		    },{
		      title:'护理等级',
		      dataIndex: 'nursingGradeCode',
		      key: 'nursingGradeCode',
		      width:'15%',
		      render:(t,r)=>{
		      	 return this.state.nursingGrade[t]||t;
		      }
		    },{
		      title: '操作',
		      dataIndex: 'action',
		      key: 'action',
		      width:'15%',
		      render:(text,record)=>{
		      	switch(this.state.second){
		      		case '用药计划': return(
							          <span>
							            <a href="javascript:;" onClick={() => { this.handleAdd(record) }} style={{color:'#2ebc2e'}}>用药计划</a>
							          </span>
							        );
                    
                    case '换房处理': return(
                    	             <a href="javascript:;" onClick={() => { this.handleChange(record) }} style={{color:'#2ebc2e'}}>换房</a>
                                   )
                    
                    case '护理等级变更':return(
                    	<span>
	                    	<a href="javascript:;" onClick={() => { this.handleChange(record) }} style={{color:'#2ebc2e'}}>护理等级变更</a>
                     	</span>
                        )
                    case '水电比例变更': return(
                    	<span>
	                    	<a href="javascript:;" onClick={() => { this.handleChange(record) }} style={{color:'#2ebc2e'}}>水电比例变更</a>
                     	</span>
                    )
		      	}
		      }
		    }];
		return(
	    <Fragment>
	        <BreadcrumbCustom first="医护管理" second={this.state.second} />
	        <Row gutter={24}>
	            <Col  xs={{ span: 24}} lg={{ span: 4}}>
	                <Card title="房间楼层" bordered={false} >
		              <Tree
		                defaultExpandAll
				        onSelect={this.onTreeSelectChangeHandler}
				      >
				        {this.renderTreeNodes(areaTree)}
				      </Tree>
				    </Card>  
	            </Col>
	            <Col  xs={{ span: 24}} lg={{ span: 20}} style={{background:'#fff'}}>
		         { rooms.length>0?rooms.map(item=>(
		         	<Col span={3} key={item.id}>
		             <Card
		                style={{marginBottom:16}}
					    actions={[<span onClick={()=>{this.editElderly(item)}}>入住老人</span> ]}
					    cover={<img alt="room" src={imgUrl} />}
					  >
					    <Meta
					      title={item.roomName+"/床"+item.bedNumber+"张"}
					    />
					  </Card>
					</Col>  
		          )
		         ):<Empty style={{marginTop:200}}/>}
	            </Col>
	        </Row>
	        <Modal 
		        title="入住老人"
		        width='60%'
		        okText='提交'
		        visible={tbVisible}
		        onCancel={()=>{this.setState({tbVisible:false})}}
		        maskClosable={false}
		        footer={null}
		        >
                <Table 
		            bordered
		            rowKey='id' 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
		          />
	        </Modal>
	        {
	        	visible?this.registerComponent():null
	        }
        </Fragment>
		)
	}
}
 
 
export default  connect()(Plan);