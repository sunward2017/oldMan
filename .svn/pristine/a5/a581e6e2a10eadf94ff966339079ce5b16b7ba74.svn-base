import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag } from 'antd';
import httpServer from '@/axios';

class drugSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			visible:false,
			data:[]
		};
	}
    componentDidMount(){
    	this.ListElderly();
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

	ListElderly = () => {
		const customerId = JSON.parse(sessionStorage.getItem('auth')).customerId;
		httpServer.listDrugTemplate({customerId}).then(res => {
			if(res.code === 200 && res.data) {
				const {value} = this.props;
				const name = res.data.find(i=>(i.templateCode===value))?res.data.find(i=>(i.templateCode===value)).name:'';
				this.setState({
					data: res.data,
					name,
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
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		}, {
			title: '模板名称',
			dataIndex: 'name',
			key: 'name',
			width: '10%'
		}, {
			title: '排序号',
			dataIndex: 'orderId',
			key: 'orderId',
			width: '10%'
		},{
			title:'类型',
			dataIndex:'type',
			key:'type',
			width:'8%',
			render: text => {
			 switch(text){
			   	 case 2: return <Tag color ="cyan">按日</Tag>;  
			   	 case 3: return <Tag color = "#2db7f5">按周</Tag>; break;	
			   	 case 4: return <Tag color = "#87d068">按月</Tag>; break;	
			   	 default: return <Tag color = "#108ee9">按需</Tag>
			  }
			}
		}, {
			title: '重复',
			dataIndex: 'days',
			key: 'days',
			width: '10%'
		}, {
			title: '时长(分)',
			dataIndex: 'longTime',
			key: 'longTime',
			width: '8%',
		}, {
			title: '语音提示',
			dataIndex: 'hint',
			key: 'hint',
			width: '15%'
		}, {
			title: '描述',
			dataIndex: 'describes',
			key: 'describes',
		}, ];
        const {name,data} =this.state;
		return(<Fragment>
	        <Input.Group compact>
	            <Input value={name} disabled placeholer="模板选取" style={{ width: '90%' }} disabled/>
	            <Button type="primary" style={{ width: '10%' }} icon="search" onClick={this.showModal}></Button>
	        </Input.Group>
	        <Modal
		          title="模板列表"
		          width="60%"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		        >
		        <Table bordered columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)  })}/> 
	        </Modal>
        </Fragment>);
	}
}

export default drugSelect;