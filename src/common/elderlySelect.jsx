import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag, notification,Divider,message } from 'antd';
import httpServer from '@/axios';
 
const column1 = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render: text => <a href="javascript:;">{text}</a>,
		},{
			title: '性别',
		    dataIndex: 'sex',
		    width:'10%',
		    key: 'sex',
		    render:(text)=>{
		      return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
		    }
		},{
			title: '年龄',
			dataIndex: 'age',
			key: 'age',
		}, {
			title: '地址',
			dataIndex: 'address',
			key: 'address',
		}];
class ElderlySelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			visible:false,
			sourceData:[],
			data:[],
			searchText:'',
			flag:false,
			selectedRows:[],
			kwh:[],
			columns:[{
					title: '姓名',
					dataIndex: 'name',
					key: 'name',
					render: text => <a href="javascript:;">{text}</a>,
				},{
					title: '性别',
				    dataIndex: 'sex',
				    width:'10%',
				    key: 'sex',
				    render:(text)=>{
				      return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#2db7f5">女</Tag>
				    }
				},{
					title: '年龄',
					dataIndex: 'age',
					key: 'age',
				},{
					title:'预估费用',
					dataIndex:'sumMoney'
				},{
					title:"水电费",
					dataIndex:'kwh'
				},{
					title:'合计',
					dataIndex:'total',
					render:(t,r)=>{
						return r.kwh?Math.round((r.sumMoney+r.kwh)*100)/100:r.sumMoney
					}
				},{
					title:'水电',
					dataIndex:'action',
					render:(t,r)=>{
						return <Kwh elderlyId={r.id} changeMoney={this.changeMoney}/>   
					}
				}]
		};
	}
	componentWillMount(){
		const {pathname}= this.props;
		if(!pathname){
			this.setState({columns:column1})
		}
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
	changeMoney=(id,money)=>{
		const {data} = this.state;
		this.setState(state=>{
			state.data.map(i=>{
				if(i.id===id){
					i.kwh=Math.round(money*100)/100;
					return i;
				}
			})
		   return state;
		})
	}
	
	render() {
        const {name,data,columns} =this.state;
        const {pathname}= this.props;
		return(<Fragment>
	        <Input.Group compact>
	            <Input value={name} disabled placeholder="搜索老人" style={{ width: '80%' }}/>
	            <Button type="primary" style={{ width: '20%' }} icon="search" onClick={this.showModal}></Button>
	        </Input.Group>
	        <Modal
		          title="老人列表"
		          visible={this.state.visible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		          width={800}
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
		        <Table columns={columns} dataSource={data} rowKey='id' size="small" onRow={
		        	(record,rowkey)=>{
		        		return pathname?{onDoubleClick:this.rowClick.bind(this,record,rowkey)}:{onClick:this.rowClick.bind(this,record,rowkey)}
		               }
		        	}/>
	        </Modal>
	        
        </Fragment>);
	}
}

export default ElderlySelect;
class Kwh extends Component{
	constructor(props){
		super(props);
		this.state={
			flag:false,
			dataSource:[],
			selectedRows:[],
		}
	}
	componentDidMount(){
	
	}
	handleRead(){
	    const {elderlyId}= this.props;
    	httpServer.listWaterRecoder({elderlyId}).then(res=>{
    		if(res.data&&Array.isArray(res.data.data)===true){
    			this.setState({dataSource:res.data.data,flag:true})
    		}else{
    			this.setState({kwh:[],flag:false});
    			message.info('没有水电信息')
    		}
    	})
    }
	handleOk=()=>{
	  const {elderlyId}= this.props;
	  const {selectedRows} = this.state;
	  let money=0;
	  selectedRows.forEach(i=>{
	  	 money+=i.money;
	  })
	  this.setState({flag:false})
	  this.props.changeMoney(elderlyId,money);
	}
	
	handleClose=()=>{
	   this.setState({flag:false})
	}
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
	    	this.setState({selectedRows})
	    }
	};
	render(){
		const columnsWC = [{
		        title: '月份',
		        dataIndex: 'month',
		    },{
		        title:'房间',
		        dataIndex:'roomName'
		    },{
		        title:'上次度数',
		        dataIndex:'lastValue'
		    },{
		        title:'本次度数',
		        dataIndex:'curValue'
		    },{
		        title:'抄表日期',
		        dataIndex:'regDate',
		        render:(t,r)=>{
		        	return t?t.substr(0,10):''
		        }
		    },{
		        title:'使用度数',
		        dataIndex:'diffValue'
		    },{
		       title:'类别',
		       dataIndex:'flag',
		       render:(text,record)=>{
		          return record.flag === 1? <Tag color="magenta">水表</Tag>:<Tag color="green">电表</Tag>  
		       }
		    },{
		        title:'单价',
		        dataIndex:'price'
		    },{
		        title:'分担比例',
		        dataIndex:'percentage'
		    },{
		        title:'应收金额',
		        dataIndex:'money',
		        width:'12%'
		    }];
		const {flag,dataSource} = this.state;    
	    return(<Fragment>
	    	<a href="javascript:;" onClick={() => {this.handleRead()}} style={{color:'#2ebc2e'}}>明细</a>
	    	 <Modal
	    	      width={1000}
		          title="水电费"
		          visible={flag}
		          onOk ={this.handleOk }
		          onCancel={()=>{this.handleClose()}}
		        >
	              <Table columns={columnsWC} dataSource={dataSource} rowKey={record => record.id}  rowSelection={this.rowSelection}/>
	        </Modal>
	    </Fragment>)
	}        
}
