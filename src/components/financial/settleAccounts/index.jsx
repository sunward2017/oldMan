 import React, {
	Component,
	Fragment
} from 'react';
import { Modal, Button, Input, Icon, Table, Tag, notification,Divider,Card,message,Tooltip} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '@/axios';
import ElderlyInfo from '@/common/elderlyInfo'
import  Cost  from '@/common/costDetail'
import CostDetail from './costDetail'

class ElderlySelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sourceData:[],
			data:[],
			searchText:'',
			modalFlag:false,
			elderly:{},
			fledgeVisible:true,
			feeData:{},
			costFlag:false,
			pageTxt:'',
			page:1,
			pageSize:10,
			meelObj:{},
			gradeObj:{}
		};
	}
	componentWillMount(){
    	const pageTxt=(this.props.location.pathname.indexOf('settleAccounts')>-1)?'在院':'出院';
    	this.setState({pageTxt})        
    }
    componentDidMount(){
    	this.ListElderlyByCost();
        this.getNursingGrade();
	    this.getPayItemChild()
	  }
	getPayItemChild(){
	    httpServer.selectPayItemChild().then((res)=>{
	      if (res.code === 200) {
	            if(res.data){
		         	let obj = {};
		         	res.data.forEach(k=>{
		         		obj[k.itemCode]=k.name;
		         	})
		        	this.setState({
		        		meelObj:obj
		        	})
		        }
	      } else {
	        if(res.message ==='Request failed with status code 500'){
	            console.log(res.message);
	         }else{
	            const args = {
	            message: '通信失败',
	            description: res.msg,
	            duration: 2,
	          };
	          notification.error(args);
	         }
	      }
	    }).catch((error)=>{
	      console.log(error);
	    });
	}
	getNursingGrade(){
	    httpServer.listNursingGrade().then((res) => {
	      if (res.code === 200) {
	        if(res.data){
	        	let obj = {};
	        	res.data.forEach(i=>{
	        		obj[i.nursingGradeCode]=i.nursingGradeName;
	        	})
	        	this.setState({
	        		gradeObj:obj
	        	})
	        }
	      } else {
	        if(res.message ==='Request failed with status code 500'){
	            console.log(res.message);
	         }else{
	             const args = {
	            message: '通信失败',
	            description: res.msg,
	            duration: 2,
	          };
	          notification.error(args);
	         }
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
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
	        this.setState(state=>{
	        	state.data= state.sourceData;
	        	return state;
	        })
	    }
    }
    handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
    
	ListElderlyByCost = () => {
		const {pageTxt} = this.state;
		httpServer.listSettlementInfo({
			listStatus:'3',
			launchFlag:pageTxt==="在院"?"0":"1",
		}).then(res => {
			if(res.code === 200) {
			    const data = res.data?res.data.map(d=>{
			    	const m = d.amountMoney||0;
			    	const n = d.closeMoney||0;
			    	const z = d.tbMoneyLibrary&&d.tbMoneyLibrary.je6||0;
			    	const q = d.tbMoneyLibrary&&d.tbMoneyLibrary.je7||0;
			        return {...d,lack:0-(m-n-z-q)}
			    }):[];
				this.setState({
					data,
					sourceData:data,
				},()=>{
					if(this.state.searchText){
					   this.handleSearchElderly()	
					}	
				})
			}else{
				this.setState({data:[],sourceData:[]});
				message.error('获取老人失败')
			}
		})
	}
    handleReset = ()=>{ 
    	 this.setState(state=>{
    	 	    state.searchText='';
	        	state.data= state.sourceData;
	        	return state;
	        })
    }
    lookAt=(r)=>{
    	this.setState({modalFlag:true,elderly:r})
    }
    fetchCostByElderly=(r)=>{
    	this.setState({elderly:r,fledgeVisible:false}) 
    }
     
    handleCancel=()=>{
    	this.setState({feeData:{},fledgeVisible:true},()=>this.ListElderlyByCost())
    }
    
    showCost=(r)=>{
        this.setState({costFlag:true,elderly:r})	
    }
    
    close =()=>{
    	this.setState({costFlag:false})	
    }
    pageChange=(page,pageSize)=>{
    	this.setState({page,pageSize}) 
    }
	render() {
		const columns = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      align: 'center',
		      width:'5%'
		    },{
				title: '姓名',
				dataIndex: 'name',
				align: 'center',
				render: text => <a href="javascript:;">{text}</a>,
			},{
			      title: '性别',
			      dataIndex: 'sex',
			      key: 'sex',
			      align:'center',
			      render:(text)=>{
			      	 return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#F50">女</Tag>
			      }
			},{
				title: '房间号',
				dataIndex: 'roomName',
				align: 'center',
				defaultSortOrder: 'ascend',
			    sorter: (a, b) => a.roomName - b.roomName,
			},{
				title: '入院日期',
				dataIndex: 'checkInDate',
			 
				render:(t,r)=>{
					return t&&<Tag color="geekblue">{t.substr(0,10)}</Tag>
				}
				 
			}, {
				title: '应收费用',
				dataIndex: 'amountMoney',
				align: 'center',
				 
				render:(t,r)=>{
					return t&&Math.round(t)
				}
			},{
				title: '已收费',
				dataIndex: 'closeMoney',
				align: 'center',
				 
				render:(t,r)=>{
					return t&&Math.round(t)
				}
			},{
				title: '未收费',
				dataIndex: 'qf',
				align: 'center',
			 
				render:(t,r)=>{
					return r.openMoney&&Math.round(r.openMoney)
				}
			},{
				title: '住院预交',
				dataIndex: 'tbMoneyLibrary.je6',
				align: 'center',
				 
			},{
				title: '其他预交',
				dataIndex: 'tbMoneyLibrary.je7',
				align: 'center',
			},{
				title: '医疗押金',
				dataIndex: 'tbMoneyLibrary.je3',
				align: 'center',
			 
			},{
				title: '费用结余',
				dataIndex: 'lack',
				align: 'center',
				 
				render:(t,r)=>{
					return t>0?Math.round(t):<span style={{color:'red'}}>{Math.round(t)}</span>
				},
				defaultSortOrder: 'ascend',
			    sorter: (a, b) => a.lack - b.lack,
			},{
				title: '操作',
				dataIndex: 'action',
				width:200,
				align:'center',
				fixed: 'right',
				filters: [
			      {
			        text: '已欠费',
			        value: '2',
			      }, {
			        text: '未欠费',
			        value: '1',
			      },
			    ],
				filterMultiple: false,
				onFilter: (value, record) =>value==1?record['lack']>=0:record['lack']<0, 
				render:(t,r)=>{
				return <span>
				         <Button size="small" icon="alipay" type="primary" title="结算" onClick={() => { this.fetchCostByElderly(r)}}></Button>
				      	 <Divider type="vertical"/>
						 <Button size="small" icon="read" type="primary" title="基础信息" onClick={() => { this.lookAt(r)}}></Button>
				      	 <Divider type="vertical"/>
				      	 <Button size="small" icon="file-done" type="primary" title="历史结算" onClick={() => { this.showCost(r)}}></Button>
				      	 
				      </span>
				}
			}];
			const columns_ = [{
		      title: '序号',
		      render:(text,record,index)=>`${index+1}`,
		      key:'serialNumber',
		      align: 'center',
		      width:'5%'
		    },{
				title: '姓名',
				dataIndex: 'name',
				align: 'center',
				render: text => <a href="javascript:;">{text}</a>,
			},{
			      title: '性别',
			      dataIndex: 'sex',
			      key: 'sex',
			      
			      align:'center',
			      render:(text)=>{
			      	 return text===1?<Tag color="#87d068">男</Tag>:<Tag color="#F50">女</Tag>
			      }
			},{
				title: '房间号',
				dataIndex: 'roomName',
				align: 'center',
				 
				defaultSortOrder: 'ascend',
			    sorter: (a, b) => a.roomName - b.roomName,
			},{
				title: '应收费用',
				dataIndex: 'amountMoney',
				align: 'center',
				 
				render:(t,r)=>{
					return t&&Math.round(t)
				}
			},{
				title: '已收费',
				dataIndex: 'closeMoney',
				align: 'center',
				 
				render:(t,r)=>{
					return t&&Math.round(t)
				}
			},{
				title: '未收费',
				dataIndex: 'qf',
				align: 'center',
				 
				render:(t,r)=>{
					return r.openMoney&&Math.round(r.openMoney)
				}
			},{
				title: '住院预交',
				dataIndex: 'tbMoneyLibrary.je6',
				align: 'center',
				 
			},{
				title: '其他预交',
				dataIndex: 'tbMoneyLibrary.je7',
				align: 'center',
				 
			},{
				title: '费用结余',
				dataIndex: 'lack',
				align: 'center',
				 
				render:(t,r)=>{
					return t>0?Math.round(t):<span style={{color:'red'}}>{Math.round(t)}</span>
				},
				defaultSortOrder: 'ascend',
			    sorter: (a, b) => a.lack - b.lack,
			},{
				title: '操作',
				dataIndex: 'action',
				width:200,
				align:'center',
				fixed: 'right',
				filters: [
			      {
			        text: '已欠费',
			        value: '2',
			      }, {
			        text: '未欠费',
			        value: '1',
			      },
			    ],
				filterMultiple: false,
				onFilter: (value, record) =>value==1?record['lack']>=0:record['lack']<0, 
				render:(t,r)=>{
				return <span>
				         <Button size="small" icon="alipay" type="primary" title="结算" onClick={() => { this.fetchCostByElderly(r)}}></Button>
				      	 <Divider type="vertical"/>
						 <Button size="small" icon="read" type="primary" title="基础信息" onClick={() => { this.lookAt(r)}}></Button>
				      	 <Divider type="vertical"/>
				      	 <Button size="small" icon="file-done" type="primary" title="历史结算" onClick={() => { this.showCost(r)}}></Button>
				      	 
				      </span>
				}
			}];
        const {name,data,modalFlag,elderly,costFlag,pageTxt,fledgeVisible,page,pageSize,meelObj,gradeObj} =this.state;
		return(<Fragment>
			<BreadcrumbCustom first="财务管理" second={`${pageTxt}结算`} />
			{ fledgeVisible?
			   <div>
					<Card>
				        <Input 
		                  placeholder="按老人姓名搜索" 
		                  style={{width:300,marginRight:'10px'}}
		                  ref={ele => this.searchInput = ele}
		                  value={ this.state.searchText }
		                  onChange={this.handleInputChange}
		                  onPressEnter={this.handleSearchElderly}
		                />
		                <Button type="primary" onClick={this.handleSearchElderly}>搜索</Button>
		                <Button type="primary" onClick={this.handleReset}>刷新</Button>
		                <Divider/>
				        <Table  scroll={{ x: 1500}} columns={pageTxt==="在院"?columns_:columns} dataSource={data} rowKey='id' size="middle"   pagination={{showSizeChanger:true , showQuickJumper:true ,current:page,pageSize:pageSize,onChange:this.pageChange, pageSizeOptions:['10','20','30','40','50']}} /> 
				    </Card> 
				    <ElderlyInfo visible={modalFlag} data={elderly} close={()=>{this.setState({modalFlag:false})}} meelObj={meelObj} gradeObj={gradeObj}/>
				    {costFlag?<Cost visible={this.state.costFlag} elderlyInfo={elderly} close={this.close} />:null}
			    </div>:<CostDetail elderlyInfo={elderly} reback={()=>{this.handleCancel()}} auth={this.props.auth} />
			}
			
        </Fragment>)
	}
}

export default ElderlySelect;
/*
  *  <Modal
		          title="押金明细"
		          visible={this.state.fledgeVisible}
		          footer={null}
		          onCancel={()=>{this.handleCancel()}}
		          width={400}
		    >
		       <Balance feeData={this.state.feeData} />
		    </Modal>	
  */
