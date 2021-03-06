import React from 'react';
import { notification } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import ElderlyList from './elderlylist';
import MemoDetail from './memoDetail';

export default class HealthExMemo extends React.Component {
    state = {
        records:[],
        treeData:[],
        searchKey:{},
        targetElderly:{}
    };
    componentDidMount(){
//      console.log('list props:',this.props);
        this.customerId = this.props.auth.customerId;
        this.fetchElderlyRoomTree();
    }
    fetchElderlyRoomTree(){
        httpServer.listAreaInfo({customerId:this.customerId}).then(res => {
//          console.log('room info:',res);
            res.code ===200 ? this.setState({treeData:res.data ? [res.data] : []}) : this.setState({treeData:[]});
        })
    }
    fetchElderlyByKey(searchKey){
        // console.log('search key:',searchKey);
        httpServer.listElderlyInfo({customerId:this.customerId, listStatus:'3', launchFlag:0, ...searchKey }).then(res => {
            // console.log(res);
            this.setState({records: res.data || []});
            res.code ===200 ? this.notice('success', res.msg) : this.notice('error', res.msg) ;
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    onTreeSelectChangeHandler = (value) => {
        // console.log('onChange ', value);
        value.length >0 ? this.fetchElderlyByKey({areaCode:value.join(',')}) : this.setState({records: []});
    };
    onNameSearchHandler = (value) => {
        // console.log('search...');
        /\S+/.test(value) && this.fetchElderlyByKey({name:value.trim()});
    };
    onMemoClickHandler = (elderly) => {
        console.log('go to click:',elderly);
        this.setState({showDetail: true, targetElderly:elderly});
    };
    onBackHandler = () => {
        this.setState({showDetail: false});
    };
    render() {
        const { treeData, records, searchKey, showDetail, targetElderly } = this.state;
        return (
            <div>
                <BreadcrumbCustom first="医护管理" second="体检记录" />
                {
                    showDetail ? <MemoDetail elderly={targetElderly} pid={this.props.auth.deptId} onBack={this.onBackHandler}  auth/> : <ElderlyList
                        treeData={treeData}
                        records={records}
                        searchKey={searchKey}
                        onNameSearch={this.onNameSearchHandler}
                        onTreeSelect={this.onTreeSelectChangeHandler}
                        onItemClick={this.onMemoClickHandler}
                    />
                }
            </div>
        )
    }
}