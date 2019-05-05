import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag, notification,Divider } from 'antd';
import httpServer from '@/axios';
import moment from 'moment'

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
    const { searchText } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.sourceData.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        data,
	      });
	    }else{
	      const args = {
	        message: '友情提示',
	        description: "请先输入老人姓名",
	        duration: 2,
	      };
	      notification.info(args);
	    }
    }
    handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
    
	ListElderly = () => {
		const {value,listStatus}= this.props
		httpServer.listElderlyInfo({
			listStatus:'3',
			launchFlag:this.props.launchFlag,
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
        	this.triggerChange(r);
        })
	}
	render() {
		const columns =[{
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
		      title: '性别',
		      dataIndex: 'sex',
		      key: 'sex',
		      width:'10%',
		      render:(text)=>{
		      	 return text===1?<Tag  color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
		      }
		    },{
		      title: '房间',
		      dataIndex: 'roomName',
		      key: 'roomName',
		      width:'8%'
		    },{
		      title: '结算状态',
		      dataIndex: 'settlementFlag',
		      key: 'settlementFlag',
		      width:'5%',
		      
		      render:(t,r)=>{
		      	 return t==1? <Icon style={{fontSize:20}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> :<Icon style={{fontSize:20}} type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
		      }
		    },{
		      title: '最近结算日期',
		      dataIndex: 'settlementDate',
		      key: 'settlementDate',
		      width:'10%',
		      render:(t,r)=>{
		      	return t?moment(t).format('YYYY-MM-DD'):t;
		      }
		    }] 
        const {name,data} =this.state;
		return(<Fragment>
	        <Input.Group compact>
	            <Input value={name} disabled placeholder="搜索老人" style={{ width: '90%' }} disabled/>
	            <Button type="primary" style={{ width: '10%' }} icon="search" onClick={this.showModal}></Button>
	        </Input.Group>
	        <Modal
		          title="老人列表"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		          width="60%"
		        >
		        <Input 
                  placeholder="按老人姓名搜索" 
                  style={{width:'40%',marginRight:'10px'}}
                  ref={ele => this.searchInput = ele}
                  value={this.state.searchText}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearchElderly}
                />
                <Button type="primary" onClick={this.handleSearchElderly}>开始搜索</Button>
                <Button type="primary" onClick={this.handleReset}>刷新</Button>
                <Divider/>
		        <Table bordered columns={columns} dataSource={data} rowKey='id' size="small" onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)})}/> 
	        </Modal>
        </Fragment>);
	}
}

export default ElderlySelect;