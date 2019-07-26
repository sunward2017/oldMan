import React,{Fragment} from 'react';
import { Card, Input,Modal ,Button, Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Table} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';
import {typeObj} from '@/utils/constant';

 
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
        const {elderlyInfo,printData,printFlag} = this.props;
        const name = JSON.parse(sessionStorage.getItem('auth')).name; 
        return ( 
        	<Modal
		        title="收据"
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
	               <div>老人姓名: &emsp;{elderlyInfo.name}&emsp;&emsp;房间号:{elderlyInfo.roomName}&emsp;&emsp;&emsp;<span>结算单号:&emsp;{this.props.printData.docNun}</span></div>
	               <hr />
	               <h3>其他收费项:</h3>
	               <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
	                  <thead>
		                  <tr>
		                    <th>收费日期</th>
		                    <th>付款人</th>
		                    <th>收费项目</th>  
		                    <th>收费金额</th>  
		                  </tr>
	                  </thead>
	                  <tbody>
	                    <tr>
	                    	<td>{moment(printData.addtime).format('YYYY-MM-DD')}</td>
	                    	<td>{printData.payName}</td>
			                <td>{typeObj[printData.type]}</td>
			                <td>{printData.money}</td>
			           	</tr>          	 
	                  </tbody>
	                </table> 
	                <h3><div style={{float:'right'}}>开票人:&emsp;<span style={{color:'#ffaa25'}}>{name}</span></div></h3> 
                </div>   
            </Modal>    
        )
    }
}
export default Cost;