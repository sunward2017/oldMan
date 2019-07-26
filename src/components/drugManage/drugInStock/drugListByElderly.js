import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag,message,Tooltip,InputNumber} from 'antd';
import httpServer from '@/axios';

const Search = Input.Search;
class drugSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:"",
			visible:false,
			data:[],
			selectedRows:[],
		};
	}
    componentDidMount(){
       
    }
    
    handleImportDrug=()=>{
    	if(!this.props.elderlyId){
    		message.error('请先选择老人')
    	}else{
    		this.setState({visible:true},()=>{
	    	    this.ListDrug();
	    	})
    	}
    	
    }
    handleCancel() {
		this.setState({visible:false});
	}
	ListDrug = () => {
		const {elderlyId} = this.props;
		httpServer.listOldManDrugInfo({elderlyId}).then(res => {
			if(res.code === 200 && res.data) {
				this.setState({
					data: res.data||[],
				})
			}else{
				this.setState({data:[]})
			}
		})
	}
	rowSelection = {
	    onChange: (selectedRowKeys, selectedRows) => {
	        this.setState({selectedRows})	 
	    },
	    getCheckboxProps:record=>({disabled:!record.quantity})
	     
    };
    changeIn=(v,r)=>{
       this.setState(state=>(
       	  state.data.map(item=>{
       	  	 if(item.id===r.id){
       	  	 	item.quantity =v;
       	  	 }
       	  	 return item;
       	  })
       ))
    }
    drugConfirm=()=>{
    	const drugs =this.state.selectedRows.map(r=>({drugCode:r.code,drugName:r.name,minUbit:r.minUnit,quantity:r.quantity}));
    	this.setState({visible:false});
    	this.props.importDrug(drugs)
    }
	render() {
	const columns = [{
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '简称',
      dataIndex: 'shortName',
      width:'15%'
    },{
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width:'20%'
    },{
    	title:'单位',
    	dataIndex:'minUnit',
    	key:'minUnit',
    	align:'center',
    	width:'10%'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 0?<Tag color="red">禁用</Tag>:<Tag color="green">启用</Tag>
      },
      width:'10%'
    },{
    	title:'入库数量',
    	dataIndex:"quantity",
    	width:'25%',
    	render:(text,record)=>{
    	   return <InputNumber onChange={(v)=>this.changeIn(v,record)}/>
    	}
    }];
        const {name,data} =this.state;
		return(<Fragment>
	        <Button icon="import" type="primary" title="根据老人导入" onClick={this.handleImportDrug}></Button>
	        <Modal
		          title="药品列表"
		          width="60%"
		          visible={this.state.visible}
		          onOk={this.drugConfirm}
		          onCancel={()=>{this.handleCancel()}}
		        >
		        <Table columns={columns} dataSource={data} rowKey='id' size="small" rowSelection={this.rowSelection} pagination={ false }/> 
	        </Modal>
        </Fragment>);
	}
}

export default drugSelect;