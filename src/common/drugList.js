import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag,message,Tooltip} from 'antd';
import httpServer from '@/axios';

const Search = Input.Search;
class drugSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:"",
			visible:false,
			data:[],
			initData:[],
		};
	}
    componentDidMount(){
    	this.ListAllDrug();
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

	ListAllDrug = () => {
		httpServer.listDrugInfoInfo().then(res => {
			if(res.code === 200 && res.data) {
				const {value} = this.props;
				this.setState({
					data: res.data||[],
					initData:res.data,
					name:value?value.drugName:''
				})
			}else{
				this.setState({data:[]})
			}
		})
	}

	rowClick = (r, text) => {
		if(r.status===0){
			message.error('该药品已禁用');
		}else{
			this.setState({name:r.name,visible:false},function(){
	        	this.triggerChange({drugCode:r.code,drugName:r.name,minUbit:r.minUnit});
	        })
		}
        
	}
	
	filterDrug=(v)=>{
		const reg = new RegExp(v, 'gi');
	    const data = this.state.data.filter((record) =>record.name && record.name.match(reg));
	    this.setState({
	        data,
	    });
	}
	
	refresh=()=>{
		const initData = this.state.initData;
		this.setState({data:initData});
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
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },{
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width:'10%'
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
		          title="药品列表"
		          width="60%"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		        >
		        <Search
		            style={{ width: 200 }}
				    placeholder="请选择药品"
				    onSearch={v=>{ this.filterDrug(v) }}
				    enterButton
				/>&emsp;<Button onClick={this.refresh}>刷新</Button><br/><br/>
		        <Table columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)  })}/> 
	        </Modal>
        </Fragment>);
	}
}

export default drugSelect;