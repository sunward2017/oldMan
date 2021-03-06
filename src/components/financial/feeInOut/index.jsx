import React from 'react';
import { Row, Col, Card, Button, notification,Popover,Calendar} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import { Charge } from './charge';
import { Balance, DetailTable } from './feeInfo';
import  Elderlys  from '@/common/elderlySelect';
import PrintPage from './printPage';
import moment from 'moment'
import {costType} from '@/utils/constant'
 
export default class HealthRecord extends React.Component {
    state = {
        elderlyArr:[],
        feeData:{},
        elderSelected:'',
        chargeFeeObj:{},
        feeDetailData:[],
        printFlag:false,
        elderlyInfo:'',
        printData:'',
        dailyData:[],
        costData:[],
        totals:0,
        cash:0,
    };
    constructor(props) {
        super(props);
    }
    
    componentDidMount(){
        this.fetchSysParams();
    }
     
    fetchElderlyBalance(id){
        httpServer.getMoneyInfo({elderlyId:id}).then(res => {
            // console.log('info :', res);
            res.code === 200 ? this.setState({feeData:res.data || {}}) : this.notice('error','费用余额获取失败');
        })
    }
    fetcheFeeListDetail(){
        const { customerId } = this.props.auth;
        const { elderSelected } = this.state;
        httpServer.listMoneyDeposits({customerId, elderlyId:elderSelected}).then(res => {
            res.code ===200 ? this.setState({feeDetailData: res.data || []}) : this.notice('error','费用明细获取失败');
        })
    }
    fetchSysParams(){
        const { customerId } = this.props.auth;
        httpServer.listParam({customerId, type:12}).then(res => {
            // console.log('param res:',res);
            this.creditList = res.data || [] ;
        })
    }
    canRecharge = (obj) => {
        const { elderSelected } = this.state;
        return !(elderSelected && obj.type && obj.money && obj.creditedAccount && obj.payName);
    };
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    elderlySelectedChangeHandler = (value) => {
        this.setState({elderSelected:value});
        this.fetchElderlyBalance(value);
    };
    feeChangeHandler = (key,val) => {
        const { chargeFeeObj } = this.state;
        this.setState({chargeFeeObj:{...chargeFeeObj, [key]:val}});
        if(key === 'money'){
            this.setState({iptColor:val < 0? 'red' :'inherit'})
        }
    };
    feeSaveHandler = () => {
        const { customerId, account, name } = this.props.auth;
        const { elderSelected, chargeFeeObj } = this.state;
        httpServer.saveMoneyDeposits({operator:account, customerId, elderlyId:elderSelected ,settlementMethod:2, recvName:name, ...chargeFeeObj})
        .then(res => {
            // console.log('save res :',res);
            if(res.code ===200){
                this.notice('success', res.msg);
                this.fetchElderlyBalance(Number(elderSelected));
            } else {this.notice('error', res.msg)}
        })
    };
    outName=(elderly)=>{
    	this.setState({elderlyInfo:elderly})
    }
    bills=(r)=>{
       	this.setState({printFlag:true,printData:r})
    }
    closePrint=()=>{
        this.setState({printFlag:false})
    }
    showFeeDetailHandler = () => {
        const showDetail = (this.state.showDetail && this.state.showDetail==='feeDetailAnimOut') ? 'feeDetailAnimIn' : 'feeDetailAnimOut';
        this.setState({ showDetail });
        if(showDetail === 'feeDetailAnimOut'){
            this.fetcheFeeListDetail();
        }
    };
    onPanelChange=(v)=>{
    	const recvTime=v.format('YYYY-MM-DD HH:ss:mm');
    	httpServer.listRecvReportDay({recvTime}).then(res=>{
    		if(res.data.tbMoneyDeposits||res.data.tbElderlySettlementInfos&&res.data.tbElderlySettlementInfos.length>0){
    		  	const costData=res.data.tbElderlySettlementInfos&&res.data.tbElderlySettlementInfos.length>0?res.data.tbElderlySettlementInfos.map(k=>{
    		  	 	let obj ={};
    		  	 	obj.name=k.tbElderlyInfo.name;
    		  	 	obj.roomName = k.tbElderlyInfo.roomName;
    		  	 	let items=[];
    		  	 	 
    		  	 	if(k.tbElderlyMealInfo&&k.tbElderlyMealInfo.length>0) items.push(k.tbElderlyMealInfo.map(item=>(`${item.year}/${item.month}${item.itemName}`)));
    		  	    if(k.tbElderlyUtilitiesInfo&& k.tbElderlyUtilitiesInfo.length>0)items.push(k.tbElderlyUtilitiesInfo.map(item=>(`${item.year}/${item.month}${item.itemName}`)));
    		  	 	if(k.tbNursingItemRecoder&&k.tbNursingItemRecoder.length>0) items.push(k.tbNursingItemRecoder.map(item=>('护理费')));
    		  	 	if(k.tbElderlyBedFeeInfo&&k.tbElderlyBedFeeInfo.length>0)items.push(k.tbElderlyBedFeeInfo.map(item=>(`${item.year}/${item.month}房费`)));
    		  	 	obj.items = items;
    		  	 	//结算字段
    		  	 	obj.cost= [];
    		  	 	if(k.tbPayMoneyDetailInfo){
    		  	 	   k.tbPayMoneyDetailInfo.forEach(i=>{
    		  	 	   	 if(i.type!==3&&i.type!==6&&i.type!==7){
    		  	 	   	   obj.cost.push({itemName:costType[i.type],money:i.money})
    		  	 	   	 }
    		  	 	   })
    		  	 	}
    		  	 	return obj;
    		  	}):[]
    		  let totals=[], cash=[];	
    		  if(res.data.tbMoneyDeposits){
    		  	 res.data.tbMoneyDeposits.forEach(i=>{
    		  	 	 totals.push(i.money)
    		  	 	 if(i.payType==="现金"){
    		  	 	 	cash.push(i.money);
    		  	 	 }
    		  	 })
    		  }
    		  if(costData.length>0){
    		     costData.forEach(k=>{
    		     	k.cost.forEach(s=>{
	    		     	totals.push(s.money)
	    		  	 	if(s.itemName==="现金"){
	    		  	 	   cash.push(s.money);
	    		  	 	}
    		     	})
    		     })
    		  }
    		  const T = totals.reduce((t,i)=>t+i);
    		  const S = cash.length>0?cash.reduce((t,i)=>t+i):0;
    		  this.setState({dailyData:res.data.tbMoneyDeposits||[],costData,totals:T,cash:S},()=>{
    		  	window.document.body.innerHTML= window.document.getElementById('table').innerHTML; 
		        window.print(); 
		        window.location.reload();
    		  })
    		}else{
    		  this.notice('info','没有日报数据')
    		}
    		
    	})
    }
    render() {
        const {feeData, chargeFeeObj, elderlyArr, showDetail, feeDetailData, iptColor,printFlag,elderlyInfo,printData,dailyData,costData,totals,cash} = this.state;
        return (
            <div>
                <BreadcrumbCustom first="财务管理" second="费用收支" />
                <Card 
                className={showDetail ? showDetail :''} 
                style={{position: 'absolute',background:'#424f63'}}
                extra={
                	<Row gutter={16}>
                	  <Col span={18}>
                	     <Elderlys  listStatus='1,2,3,4' onChange={this.elderlySelectedChangeHandler} pathname={this.props.location.pathname} outName={this.outName}/>
                	  </Col>
                	  <Col span={6}>
                	      <Popover trigger="click" content={<Calendar fullscreen={false}   onSelect={this.onPanelChange} />} title="日历">
                	        <Button type="primary">日报</Button>
                	      </Popover>
                	  </Col>
                	</Row>  
                	}>
                    <Row>
	                    <Col span={12} offset={6}>
		                    <Charge
		                        chargeFeeObj={chargeFeeObj}
		                        disabled={this.canRecharge(chargeFeeObj)}
		                        creditList={this.creditList || []}
		                        onFeeSave={this.feeSaveHandler}
		                        onFeeChange={this.feeChangeHandler}
		                        iptColor={iptColor || 'inherit'}
		                        status={elderlyInfo.status}
		                    />
		                    <div style={{marginTop:'25px'}}>
		                        <Balance feeData={feeData} showFeeDetail={this.showFeeDetailHandler} />
		                    </div>
	                    </Col>
                   </Row>    
                </Card>
                {
                    showDetail === 'feeDetailAnimOut' ?
                    <Card extra={<Button onClick={this.showFeeDetailHandler} size="small" icon="rollback" type="primary"></Button>}>
                        <DetailTable listData={feeDetailData}   bills={this.bills}/>
                    </Card> : null
                }
                <PrintPage printFlag={printFlag} close={this.closePrint} elderlyInfo={elderlyInfo} printData={printData}/>
                <div style={{display:'none'}} id="table">
                    <p style={{float:'right',marginBottom:5}}>统计日期:&emsp;<span style={{borderBottom:"1px solid #333"}}>{dailyData.length>0&&dailyData[0].recvTime.substr(0,10)}</span>
                       &emsp;总计:￥{totals}元（现金:￥{cash}元&emsp;其他:￥{totals-cash}元) 
                    </p>
                    <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
	                  <thead>
		                  <tr>
		                    <th>付款人</th>
		                    <th>房号</th>
		                    <th>付款方式</th>
		                    <th style={{width:"20%"}}>缴费项目</th>  
		                    <th style={{wordWrap: "break-word"}}>收费金额</th>
		                  </tr>
	                  </thead>
	                  <tbody>
	                    {
	                    	dailyData.map((i,k)=>(
	                    	    <tr key={k}>
			                    	<td>{i.name}</td>
			                    	<td>{i.roomName}</td>
					                <td>{i.payType}</td>
					                <td>{i.typeName}</td>
					                <td>{i.money}</td>
					           	</tr> 	
	                    	))
	                    }
	                    {
	                    	costData.length>0&&costData.map((m,n)=>(
	                    		<tr key={n+'n'}>
			                    	<td>{m.name}</td>
			                    	<td>{m.roomName}</td>
					                <td>{m.cost.map((i,s)=>{return s>0?"\n/"+i.itemName:i.itemName})}</td>
					                <td>{m.items.map(i=>i+"\n")}</td>
					                <td>{m.cost.map((i,n)=>{return n>0?"\n/"+i.money:i.money})}</td>
					           	</tr> 	
	                    	))
	                    }
	                  </tbody>
	                </table>
                </div>
            </div>
        )
    }
}

