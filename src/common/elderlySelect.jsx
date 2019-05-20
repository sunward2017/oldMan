import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag, notification,Divider } from 'antd';
import httpServer from '@/axios';

class ElderlySelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			visible:false,
			sourceData:[],
			data:[],
			searchText:'',
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
    handleSearchElderly=()=>{
    const { searchText,sourceData } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.sourceData.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        data,
	      });
	    }else{
	      this.setState({data:sourceData})
	    }
    }
    handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
    
	ListElderly = () => {
		const {value,listStatus}= this.props
		httpServer.listElderlyInfo({
			listStatus,
		}).then(res => {
			if(res.code === 200 && res.data) {
				const elderly = res.data.find(i=>(i.id==value))
				this.setState({
					data: res.data,
					sourceData:res.data,
					name:elderly?elderly.name:''
				})
			}else{
				this.setState({data:[]})
			}
		})
	}
    handleReset = ()=>{
    	const {sourceData} = this.state;
    	this.setState({data:sourceData,searchText:''})
    }
	rowClick = (r, text) => {
        this.setState({name:r.name,visible:false},function(){
        	this.triggerChange(r.id);
        	if(this.props.outName){
        		this.props.outName(r)
        	}
        })
	}
	render() {
		const columns = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render: text => <a href="javascript:;">{text}</a>,
		}, {
			title: '年龄',
			dataIndex: 'age',
			key: 'age',
		}, {
			title: '地址',
			dataIndex: 'address',
			key: 'address',
		}];
        const {name,data} =this.state;
		return(<Fragment>
	        <Input.Group compact>
	            <Input value={name} disabled placeholder="搜索老人" style={{ width: '90%' }}/>
	            <Button type="primary" style={{ width: '10%' }} icon="search" onClick={this.showModal}></Button>
	        </Input.Group>
	        <Modal
		          title="老人列表"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		        >
		        <Input 
                  placeholder="按老人姓名搜索" 
                  style={{width:'40%',marginRight:'10px'}}
                  ref={ele => this.searchInput = ele}
                  value={this.state.searchText}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearchElderly}
                />
                <Button type="primary" onClick={this.handleSearchElderly}>搜索</Button>
                <Button type="primary" onClick={this.handleReset}>刷新</Button>
                <Divider/>
		        <Table bordered columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)})}/> 
	        </Modal>
        </Fragment>);
	}
}

export default ElderlySelect;