import React from 'react';
import { Card, Input, Col, Row, TreeSelect, notification } from 'antd';
import { healthRecords } from '../../../action';
import httpServer from '../../../axios/index';
import RecordItem from './recordItem';
import { connect } from 'react-redux';
const Search = Input.Search;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;

class RecordList extends React.Component {
    state = {
        records:[],
        treeData:[],
        searchKey:{},
        chargeItemList:[],
    };
    componentDidMount(){
        // console.log('list props:',this.props);
        // if(this.props.history.action === 'POP'){
        //     const { healthRecord } = this.props;
        //     this.setState({
        //         records:(healthRecord && healthRecord.records) || [],
        //         searchKey: (healthRecord && healthRecord.searchKey) || {}
        //     })
        // }
        this.customerId = this.props.auth.customerId;
        this.fetchElderlyRoomTree();
        this.getPayItemChild();
        this.fetchElderlyByKey();
    }

    //关联收费项目选取
  getPayItemChild(){
    httpServer.selectPayItemChild({customerId:this.customerId}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({chargeItemList:res.data}):this.setState({chargeItemList:[]});
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

    fetchElderlyRoomTree(){
        httpServer.listAreaInfo({customerId:this.customerId}).then(res => {
            console.log('room info:',res);
            res.code ===200 ? this.setState({treeData:[res.data]}) : this.setState({treeData:[]});
        })
    }
    fetchElderlyByKey(searchKey){
        // console.log('search key:',searchKey);
        httpServer.listCurrentMonthEnterElderly({customerId:this.customerId,  ...searchKey,}).then(res => {
            console.log(res);
            this.setState({records: res.data || []});
            res.code ===200 ? this.notice('success', res.msg) : this.notice('error', res.msg) ;
            // this.props.recordsStatus({records: res.data || [], searchKey});
        })
    }
    renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode title={item.areaName} key={item.id} value={item.areaCode}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.areaName} key={item.id} value={item.areaCode} />;
    });
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    onTreeSelectChangeHandler = (value) => {
        value.length >0 ? this.fetchElderlyByKey({areaCode:value.join(',')}) : this.setState({records: []});
    };
    onNameSearchHandler = (value) => {
        /\S+/.test(value) && this.fetchElderlyByKey({name:value.trim()});
    };
    onRecordDeleteHandler = (record) => {
        console.log('go to delete:',record);
        const { id, customerId } = record;
        httpServer.deleteHealthInfo({id, customerId}).then(res => {
            res.code===200 ? this.notice('success', res.msg) : this.notice('error', res.msg);
        })
    };
    render() {
        const { treeData, records, searchKey } = this.state;
        const  url  = this.props.location.pathname;
        return (
            <React.Fragment>
                <Card bordered={false}>
                    <Row gutter={16}>
                        <Col md={4}>
                            <TreeSelect className="w-full"
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeDefaultExpandedKeys={['1']}
                                onChange={this.onTreeSelectChangeHandler}
                                treeCheckable="true"
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder="选择楼层房间" >
                                {this.renderTreeNodes(treeData)}
                            </TreeSelect>
                        </Col>
                        <Col md={4}>
                            <Search
                                defaultValue={searchKey.name||''}
                                placeholder="按姓名搜索"
                                onSearch={value => this.onNameSearchHandler(value)}
                                enterButton
                            />
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false} style={{marginTop:'10px'}}>
                    <Row>
                        {
                            records.length>0 ? records.map(r =>
                                <Col xxl={4} xl={5} lg={8} md={12} key={r.id}>
                                    <RecordItem data={r} baseUrl={url} onDel={() => this.onRecordDeleteHandler(r)} customerId={this.customerId} chargeItemList={this.state.chargeItemList}/>
                                </Col>
                            ) : '无搜索结果'
                        }
                    </Row>
                </Card>

            </React.Fragment>
        )
    }
}
// const mapStateToProps = state => {
//     const { healthRecord } = state.temporaryData;
//     return {healthRecord};
// };
// const mapDispatchToProps = dispatch => ({
//     recordsStatus:(data) => {
//         dispatch(healthRecords(data))
//     }
// });
export default RecordList;
//connect(mapStateToProps, mapDispatchToProps)(RecordList)