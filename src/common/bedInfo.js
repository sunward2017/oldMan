import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'react-redux'
import {Input,Tree,Row,Col,notification,Card,Icon,Modal,Empty,Button} from 'antd';
import httpServer from '@/axios/index';
 

const TreeNode = Tree.TreeNode;
const {Meta} = Card;
class Plan extends Component {
	constructor(props) {
		super(props);
		this.state = {
		   areaTree:[],
		   visible:false,
		   southRoom:[],
		   northRoom:[],
		   elderlyInfo:{},
		   active:'',
		   bed:'',
		   room:'',
		}
	}
	componentDidMount() {
	  if(this.props.value){
	  	const {roomName,roomCode,bedNumber} = this.props.value;
	    this.setState({room:{roomName,roomCode},bed:{bedCode:bedNumber}})
	  }
	   this.AreaTree();
	   this.elderlyList()
	}
	showModal=()=>{
    	this.setState({visible:true})
    }
	AreaTree=()=>{
		httpServer.listAreaInfo().then(res=>{
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
	elderlyList() {
	   const customerId = this.props.customerId;
	   httpServer.listElderlyInfo({
			customerId,
			listStatus:'0,1,2,3',
			langchFlag:0,
		}).then(res => {
			if(res.code!==200){
				this.notice('error','获取老人失败')
			}
			const obj ={}
			res.data&&res.data.forEach(e=>{
				obj[e.id]=e.name
			})
			this.setState({elderlyInfo:obj})
		})	
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
       httpServer.getRoomAndBedTree({areaId:value[0]}).then(res => {
       	 if(res.code===200){
       	 	const data= res.data&&res.data.tbRoomInfos?res.data.tbRoomInfos:[];
       	 	var southRoom=[];
       	 	var northRoom=[];
       	 	for(var i=0,l=data.length;i<l;i++){
                if(parseInt(data[i].roomName)%2===0){
                  northRoom.push(data[i])
                }else{
                  southRoom.push(data[i])
                }
       	 	}
       	    this.setState({southRoom,northRoom})
       	 }else{
       	 	this.notice('error', res.msg) ;
       	 }
       	
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
    changeBed(bed,room){
       if(bed.elderlyId) return;
       this.setState({active:bed.bedCode,bed,room,visible:false},()=>{
       	  this.triggerChange(room,bed);
       })
    }
    triggerChange = (room,bed) => {
		const {onChange,exportBed }= this.props;
		if(onChange) {
			onChange({...room,...bed});
		}
		if(exportBed){
			exportBed(bed)
		}
	}
	render() {
		const {
			areaTree,
			visible,
			rooms,
			bedCode,
			elderlyInfo,
			active,
			bed,
			room,
			southRoom,
			northRoom
		} = this.state;
	 	 
		return(
	    <Fragment>
	        <Input.Group compact>
	            <Input value={room&&bed?`${room.roomName}室/${bed.bedCode}床`:''} disabled placeholer="请选择床位" style={{ width: '85%' }} disabled/>
	            <Button type="primary" style={{ width: '15%' }} icon="search" onClick={this.showModal} disabled={this.props.disabled?true:false}></Button>
	        </Input.Group>
	        <Modal 
		        title="床位选择"
		        width='80%'
		        okText='确定'
		        visible={visible}
		        onCancel={()=>{this.setState({visible:false})}}
		        maskClosable={false}
		        onOk= {this.handleOk}
		        footer={null}
		        >
                <Row gutter={24}>
		            <Col  xs={{ span: 24}} lg={{ span: 4}}>
                        <Tree
			                defaultExpandAll
					        onSelect={this.onTreeSelectChangeHandler}
					    >
					        {this.renderTreeNodes(areaTree)}
					    </Tree>
		            </Col>
		            <Col  xs={{ span: 24}} lg={{ span:20}}>
			            <div className="area">
			             <div>
				         {
				           southRoom.map(room=>(
				         	<div className="room" key={room.id}>
				         	   <div>{room.roomName}</div>
				         	   {
				         	   room.tbBedInfos.map(bed=>{
				         	   	  return(
				         	   	  	<div className={bed.elderlyId&&bed.flag===0?"bed":bed.elderlyId&&bed.flag===1?'bed_1':bed.bedCode===active?"bed_2 active":"bed_2"} key={bed.bedCode} onClick={()=>{this.changeBed(bed,room)}}>
					         	     <Icon type="user" style={{fontSize:'20px'}} /> 
					         	     <div>{bed.bedCode}</div>
					         	     <div>{bed.money}元</div>
					         	     <div>{elderlyInfo[bed.elderlyId]||bed.elderlyId}</div>
					         	    </div>
				         	   	 ) 
				         	   })
				         	   }
				         	</div>
				           ))
				         }
				         </div>
			            </div>
			            <div className="area">
			              <div>
				         {
				           northRoom.map(room=>(
				         	<div className="room" key={room.id}>
				         	   <div>{room.roomName}</div>
				         	   {
				         	   room.tbBedInfos.map(bed=>{
				         	   	  return(
				         	   	  	<div className={bed.elderlyId&&bed.flag===0?"bed":bed.elderlyId&&bed.flag===1?'bed_1':bed.bedCode===active?"bed_2 active":"bed_2"} key={bed.bedCode} onClick={()=>{this.changeBed(bed,room)}}>
					         	     <Icon type="user" style={{fontSize:'20px'}} /> 
					         	     <div>{bed.bedCode}</div>
					         	     <div>{bed.money}元</div>
					         	     <div>{elderlyInfo[bed.elderlyId]||bed.elderlyId}</div>
					         	    </div>
				         	   	 ) 
				         	   })
				         	   }
				         	</div>
				           ))
				         }
				         </div>
			            </div>
		            </Col>
		        </Row>
	        </Modal>
	        <style>{
	        	`
	        	.area{
	        		width:100%;
	        		overflow-x:auto;
	        	}
	        	.area>div{
	        		display: inline-flex;
	        	}
	        	.room{
	        		float:left;
	        		display:inline-block;
	        		width:108px;
	                padding:5px 0;
	        		border-radius:3px;
	        		margin:5px;
	        		text-align:center;
	        		color:yellow;
	        		background:#3693D0;
	        	}
	        	.bed,.bed_1,.bed_2{
	        		float:left;
	        		width:48px;
	        	 	height:95px;
	        	 	margin:3px;
	        	 	font-size:12px;
	        	 	border-radius:2px;
	        	 	padding-top:15px
	        	}
	        	.bed{
	        	 	color:#fff;
	        	 	background:#2777AA;
	        	 	margin:3px;
	        	}
	        	.bed_1{
	        	   color:color:#fff;
	        	   background:#00A65A;
	        	}
	        	.bed_2{
	        	   color:#333;
	        	   background:#ccc;
	        	   cursor:default;
	        	}
	        	.active,.bed_2:hover{
	        		background:#2777AA;
	        		color:#00F;
	        	}
	        	
	        	.bed>div,bed_1>div{
	        		overflow: hidden;
	        		white-space: nowrap;
	        	 	text-overflow:ellipsis
	        	}
	        	`
	        }</style>
	    </Fragment>    
		)
	}
}

export default Plan;