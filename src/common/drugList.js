import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag} from 'antd';
import httpServer from '@/axios';

const Search = Input.Search;
class drugSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
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
		const {elderlyId} =this.props;
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
        this.setState({name:r.name,visible:false},function(){
        	this.triggerChange({drugCode:r.code,drugName:r.name,minUnit:r.minUnit});
        })
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
      width:'10%'
    }, {
      title: '处方药',
      dataIndex: 'prescription',
      key: 'prescription',
      render:(text,record)=>{
        return record.prescription === 0?<Tag color="red">非处方药</Tag>:<Tag color="green">处方药</Tag>;
      },
      width:'8%'
    },{
      title: '是否医保',
      dataIndex: 'insurance',
      key: 'insurance',
      render:(text,record)=>{
          return record.insurance === 0?<Tag color="red">否</Tag>:<Tag color="green">是</Tag>
      },
      width:'8%'
    },{
    	title:'单位',
    	dataIndex:'minUnit',
    	key:'minUnit',
    	width:'8%'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 0?<Tag color="red">注销</Tag>:<Tag color="green">正常</Tag>
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
		        <Table bordered columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)  })}/> 
	        </Modal>
        </Fragment>);
	}
}

export default drugSelect;