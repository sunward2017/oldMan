import React, {
	Component,
	Fragment
} from 'react';
import { notification,Row,Col,Modal,Divider,Button,Form,Select,Card} from 'antd';
import BreadcrumbCustom from '@/components/BreadcrumbCustom';

import $ from 'jquery';
import zTree from 'ztree';
import 'ztree/css/zTreeStyle/zTreeStyle.css';

import httpServer from '@/axios';

const confirm = Modal.confirm
let  node =0; 
class AreaConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			customers: [],
			areaTree:[],
			parentNode:'',
		}
	}
	componentDidMount() {
		this.List() 
	}
//	componentWillReceiveProps(nextProps){
//		const {customer} = nextProps;
//		if(this.props.customer!==customer){
//			this.List(customer)
//		};
//	}
	componentWillUnmount(){
		this.setState = (state,callback)=>{
          return;
       }
	}
	List(customer) {
		const {customerId} = JSON.parse(sessionStorage.getItem('auth'));
		httpServer.listAreaInfo({customerId}).then(res => {
			if(res.code===200) {
				const data = res.data?JSON.parse(JSON.stringify(res.data).split('areaName').join('name')):{};
				this.setState({ areaTree: [{...data, open:true}]},()=>{
				 	this.initTree()
				})  
			}
		})
	}
	initTree=()=>{
		var setting = {
			view: {
				selectedMulti: false,
				addHoverDom:this.addHoverDom,
				removeHoverDom:this.removeHoverDom,
			},
			edit: {
				enable: true,
				showRemoveBtn: true,
				showRenameBtn: true,
				removeTitle:'删除',
				renameTitle:'修改'
			},
			data: {
				 
				simpleData: {
					enable: false
				}
			},
			callback: {
				beforeRename: this.beforeRename,
				beforeRemove: this.beforeRemove,
				onMouseDown: this.onMouseDown,
				onRename: this.edit,
			}
		};
		const areaTree = this.state.areaTree;
		$.fn.zTree.init($("#treeDemo"), setting,areaTree );
	}
	addHoverDom=(treeId, treeNode)=>{
		let _this = this;
        let sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        let addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        let btn = $("#addBtn_"+treeNode.tId);
        if (btn) btn.bind("click", function(){
				_this.setState({parentNode:treeNode})
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				let  newNode=zTree.addNodes(treeNode, { pId:treeNode.id, name:"新增" + (node++)});
				     newNode&&zTree.editName(newNode[0]);
				return false;
        });
    }
	removeHoverDom=(treeId, treeNode)=>{
		$("#addBtn_"+treeNode.tId).unbind().remove();
    };
    beforeRename=(treeId, treeNode, newName)=>{
    	return newName?true:false;
    }
	edit=(event, treeId, treeNode)=>{
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	    const {id,name,pid}= treeNode;
	     
	    if(id){
	    	const data = {
	    		areaName:name,
	    		pid,
	    		customerId:treeNode.customerId,
	    		id,
	    	}
	    	httpServer.updateAreaInfo(data).then(res=>{
	    		if(res.code===200){
	    		const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
			        this.List()
	    	    }else{
	    		    const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
                    zTree.editName(treeNode);
	    	    }
	    	})
	    }else{
	        const data = {
	        	areaName:name,
	        	pid:this.state.parentNode.id,
	        	customerId:this.state.parentNode.customerId
	        }
	    	httpServer.saveAreaInfo(data).then(res=>{
	    		if(res.code===200){
	    			const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
			        this.List()
	    		}else{
	    		    const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
                    zTree.editName(treeNode);
	    		}
	    	})
	    } 
	};
	beforeRemove=(id,treeNode)=>{
	   let _this = this;
	   confirm({
	    title:'警告',		
        content:'你确定删除吗',
        onOk() {
           _this.onRemove(treeNode);  
        },
        onCancel() {
            
        },
      });
      return false;
	}
	onRemove=(treeNode)=>{
	   const {id,customerId} = treeNode;
	   httpServer.deleteAreaInfo({id,customerId}).then(res=>{
	   	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	   	   if(res.code===200){
	    		const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
			        this.List()
	    	}else{
	    		    const args = {
			          message: '提示',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.info(args);
                    zTree.editName(treeNode);
	    	}
	   })
	}
	onMouseDown=(e,id,treeNode)=>{
	    if(treeNode&&treeNode.children&&treeNode.children.length===0){
	    	this.props.onClick(treeNode.id)
	    }else{
	    	this.props.onClick(null)
	    }
		
	}
	render() {
		const {
			areaTree,
		}=this.state
		return(
		    <Fragment>
		     
                <ul id='treeDemo' className="ztree"></ul>
		        <style>{`
		                    .ztree li span.button.add {
		                        margin-left:2px;
		                        margin-right: -1px;
		                        background-position:-144px 0;
		                        vertical-align:top;
		                        *vertical-align:middle
		                    }
		        `}</style> 
		    </Fragment>    
		)
	}
}
 
export default AreaConfig;