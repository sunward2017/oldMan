import React from 'react';
import { Row, Col,Button, Table, Radio,Select, notification} from 'antd';
import httpServer from '../../../axios/index';
const Option = Select.Option;

export class BillInfo extends React.Component{
    state = {
        isPreFee:false,
        subData:{},
        moneyLeft:'',
        isSubmit:false,
    };
    componentDidUpdate(prevProps){
        if(prevProps.data.list && prevProps.data.list.money && this.props.data.list && !this.props.data.list.money){
            this.fetchMyMoney();
        }
    }
    fetchMyMoney(){
        const {type, elderly, param} = this.props.data;
        if(!elderly) return;
        httpServer.getMyMoney({type,customerId:param.customerId, elderlyId:elderly.key}).then(res => {
            res.code === 200 && this.setState({moneyLeft:res.data ? res.data[`je${type}`] : ''});
        })
    }

    onRadioChangeHandler = (e) => {
        const val = e.target.value;
        this.setState({isPreFee: val === '5', subData:{...this.state.subData, settlementMethod:val} });
        val === '5' && this.fetchMyMoney();
    };
    onBillSubmitHandler = () => {
       const { data }= this.props;
       this.setState({isSubmit:true},()=>{
       	 this.props.onBillSubmit(data.list,data.type)
       })
    };
    onFeeChangeHandler = (val) => {
        this.setState({subData:{...this.state.subData,sumMoney:val}});
    };
    onCreditChangeHandler = (val) => {
        this.setState({subData:{...this.state.subData,creditedAccount:val}});
    };
    render() {
        const {data, columns} = this.props;
        // console.log('data:',data);
        const { isPreFee, subData, moneyLeft } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col>{/*data.elderly ?
                        <h3>
                            <Tag color="#108ee9">{data.elderly.label[0]}</Tag>-- <Tag color="#108ee9">{data.elderly.label[6] || '暂无'}</Tag>房间
                        </h3>
                        : '暂无费用信息'*/}
                    </Col>
                </Row>
                <Table columns={columns} dataSource={data.list ? data.list.data: []} rowKey={record => record.id}
                       footer={() => <span><span >总计 : {data.list && data.list.money}</span> <Button size="small" type="primary" disabled={this.state.isSubmit||!data.list||data.list.data.length===0} className="pull-right tb-footer-text" onClick={this.onBillSubmitHandler}>结算</Button></span>}
                />
                
            </React.Fragment>
        )
    }
}