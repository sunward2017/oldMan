import React,{Fragment} from 'react';
import { Card, Input,Modal ,Button,Select, Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Table} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';

const { Meta } = Card;
const Option = Select.Option;

class Cost extends React.Component {
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
    	window.document.body.innerHTML= window.document.getElementById('cost').innerHTML; 
		window.print(); 
		window.location.reload();
    }
    componentDidMount(){
    	 
    }
     
    
    render() {
       const elderlyInfo = this.props.printData.tbElderlyInfo||{};
       const data = this.props.printData.tbElderlyImmediateFeeInfos||[]; 
       const printFlag = this.props.printFlag;
       const sumMoney = this.props.printData.sumMoney;
       const name = JSON.parse(sessionStorage.getItem('auth')).name; 
        return ( 
        	<Modal
		        title="费用清单"
		        okText='确认'
		        width="40%"
		        visible={printFlag}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		        footer={[
		            <Button key="back" onClick={this.cancel}>取消</Button>,
		            <Button key="submit" type="primary" onClick={this.handleOk}>
		              打印
		            </Button>,
		        ]}
		      >
        	   <div  id={"cost"}>
	               <h2 style={{textAlign:'center'}}>欢乐之家养老院</h2> 
	               <div>老人姓名: &emsp;{elderlyInfo.name}&emsp;&emsp;房间:{elderlyInfo.roomName}&emsp;&emsp;&emsp;<span>结算单号:&emsp;{this.props.printData.settlementNum}</span></div>
	               <hr />
	                <h3>其他收费项:</h3>
	                <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
	                  <thead>
	                  <tr>
	                    <th>产生日期</th>
	                    <th>收费项目</th>  
	                    <th>收费金额</th>  
	                  </tr>
	                  </thead>
	                  <tbody>
	                    {
	                    	data.map(item=>(
	                    		<tr key={item.id+'n'}>
	                    	      <td>{moment(item.addtime).format('YYYY-MM-DD')}</td>
			                   	  <td>{item.itemName}</td>
			                   	  <td>{item.money}</td>
			                   	</tr>  
	                    	))
	                    }
	                  </tbody>
	                </table> 
	                <h3>已收费用:&emsp;{sumMoney||0}元 <div style={{float:'right'}}>开票人:&emsp;<span style={{color:'#ffaa25'}}>{name}</span></div></h3> 
                </div>   
            </Modal>    
        )
    }
}
export default Cost;