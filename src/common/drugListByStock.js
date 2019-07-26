import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag,message} from 'antd';
import httpServer from '@/axios';

class drugSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:"",
			visible:false,
			data:[]
		};
	}
    componentDidMount(){
    	this.ListDrugByElderly();
    }
    
    showModal=()=>{
    	this.setState({visible:true})
    }
    handleCancel() {
		this.setState({visible:false});
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if(onChange) {
			onChange(changedValue);
		}
	}

	ListDrugByElderly = () => {
		const {elderlyId} =this.props;
		httpServer.listDrugStockInfo({elderlyId}).then(res => {
			if(res.code === 200 && res.data) {
				const {value} = this.props;
				const data = res.data.map(m=>({...m,...m.tbDrugInfo}))
				this.setState({
					data,
					name:value?value.name:'',
				})
			}else{
				this.setState({data:[]})
			}
		})
	}

	rowClick = (r, text) => { 
	   this.setState({name:r.name,visible:false},function(){
	      	this.triggerChange(r);
	    })
	}
	render() {
		const columns = [{
	      title: '序号',
	      render:(text,record,index)=>`${index+1}`,
	      width:'5%',
	      key:'index'
	    },{
	      title: '药品名称',
	      dataIndex: 'name',
	      key: 'name',
	      width:'12%'
	    },{
	      title: '简称',
	      dataIndex: 'shortName',
	      width:'8%'
	    },{
	      title: '生产厂家',
	      dataIndex: 'vender',
	      width:'15%',
	      onCell: () => {
	        return {
	          style: {
	            maxWidth: 150,
	            overflow: 'hidden',
	            whiteSpace: 'nowrap',
	            textOverflow:'ellipsis',
	            cursor:'pointer'
	          }
	        }
	      }
	    },{
	      title: '规格',
	      dataIndex: 'specification',
	      key: 'specification',
	      width:'10%'
	    },{
	      title: '库存数量',
	      dataIndex:'quantity',
	      width:'5%',
	      align:'center',
	    },{
	    	title:'单位',
	    	dataIndex:'minUnit',
	    	key:'minUnit',
	    	align:'center',
	    	width:'5%'
	    },{
	      title: '状态',
	      dataIndex: 'status',
	      key: 'status',
	      render:(text,record)=>{
	        return record.status === 0?<Tag color="red">禁用</Tag>:<Tag color="green">启用</Tag>
	      },
	      width:'5%'
	    }];
        const {name,data} =this.state;
       
		return(<Fragment>
	        <Input.Group compact>
	            <Input value={name} disabled placeholer="药品选取" style={{ width: '90%' }} disabled/>
	            <Button type="primary" style={{ width: '10%' }} icon="search" onClick={this.showModal}></Button>
	        </Input.Group>
	        <Modal
		          title="药品库存列表"
		          width="60%"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		        >
		        <Table  rowKey={record => record.id} columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)  })}/> 
	        </Modal>
        </Fragment>);
	}
}

export default drugSelect;