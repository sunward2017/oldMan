import React from 'react';
import { Row, Col, Card, Button, notification } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import { Charge } from './charge';
import { Balance, DetailTable } from './feeInfo';
import  Elderlys  from '@/common/elderlySelect';
import PrintPage from './printPage';

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
    render() {
        const {feeData, chargeFeeObj, elderlyArr, showDetail, feeDetailData, iptColor,printFlag,elderlyInfo,printData} = this.state;
        return (
            <div>
                <BreadcrumbCustom first="财务管理" second="费用收支" />
                <Card className={showDetail ? showDetail :''} style={{position: 'absolute',background:'#EFF0F4'}} title={<div style={{width:300,float:'right'}}><Elderlys  listStatus='1,2,3,4' onChange={this.elderlySelectedChangeHandler} outName={this.outName}/></div>}>
                    <Row>
	                    <Col span={12} offset={6}>
		                    <Charge
		                        chargeFeeObj={chargeFeeObj}
		                        disabled={this.canRecharge(chargeFeeObj)}
		                        creditList={this.creditList || []}
		                        onFeeSave={this.feeSaveHandler}
		                        onFeeChange={this.feeChangeHandler}
		                        onElderlyChange={this.elderlySelectedChangeHandler}
		                        iptColor={iptColor || 'inherit'}
		                    />
		                    <div style={{marginTop:'25px'}}>
		                        <Balance feeData={feeData} showFeeDetail={this.showFeeDetailHandler} />
		                    </div>
	                    </Col>
                   </Row>    
                </Card>
                {
                    showDetail === 'feeDetailAnimOut' ?
                    <Card>
                        <Button onClick={this.showFeeDetailHandler} size="small">返回</Button>
                        <DetailTable listData={feeDetailData}   bills={this.bills}/>
                    </Card> : null
                }
                <PrintPage printFlag={printFlag} close={this.closePrint} elderlyInfo={elderlyInfo} printData={printData} />
            </div>
        )
    }
}
