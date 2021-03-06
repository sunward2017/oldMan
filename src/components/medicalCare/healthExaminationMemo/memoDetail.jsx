import React from 'react';
import { Card, notification, Button, List, Icon, Skeleton } from 'antd';
import moment from 'moment';
import ModelBox from './modelBox';
import IndicatorChart from './indicatorChart';
import NewContent from './newContent';
import EditContent from './editContent';
import httpServer from '../../../axios/index';

export default class MemoDetail extends React.Component {
    state = {
        showModel:false,
        checkItems:[],
        initLoading: false,
        loading: false,
        data: [],
        list: [],
    };
    componentDidMount() {
        this.customerId = this.props.elderly.customerId;
        this.elderlyId = this.props.elderly.id;
        this.setting = {
            'chart':{ width:'60%', title:'体检指标波动图'},
            'new':{title:'新增检查单'},
            'edit':{title:'编辑检查单'}
        };
        this.fetcheMemoList();
    }
    fetcheMemoList(){
        const {elderlyId, customerId} = this;
        httpServer.listCheckRecoder({elderlyId, customerId}).then(res => {
            console.log('record list:',res);
            res.code === 200 ? this.setState({list:res.data || []}) : this.notice('error', res.msg);
        })
    }
    fetchCheckItemAll(){
        const pid = this.props.pid;
	    httpServer.listCheckItemChild({pid}).then(res => {
	        if(res.code===200){	
	            this.setState({checkItems: res.data || []});
	        }else {
	           const args = {
	            message: '通信失败',
	            description: '获取检查项错误',
	            duration: 2,
	          };
	          notification.error(args);
	          this.setState({checkItems:[]}); 
	        }
	    }).catch((error)=>{
	      console.log(error);
	    });
        
    }
    onLoadMore = () => {
    };
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    onAddMemoHandler = () => {
        this.setState({showModel:'new'});
        this.fetchCheckItemAll()
    };
    onModelCancelHandler = () => {
        this.setState({showModel:null, chartData:{} })
    };
    onShowEChartHandler = () => {
        this.fetchCheckItemAll()
        this.setState({showModel:'chart'});
    };
    onChartItemChangeHandler = (val) => {
        const {customerId, elderlyId} = this;
        httpServer.listCheckRecoderMap({itemCode:val.key, customerId, elderlyId }).then(res => {
            if(res.code === 200 ){
                let obj = {one:[], two:[]};
                res.data && res.data.forEach(d => {
                    obj.one.push( [d.checkDate,d.value1]);
                    (d.value2 && d.value2 !== 0) && obj.two.push( [d.checkDate,d.value2]);
                });
                this.setState({chartData: {[val.label]:[obj.one, obj.two.length>0 && obj.two ]}});
            }else {
                this.notice('error', res.msg);
            }
        })
    };
    onEditMemoHandler = (record) => {
        this.setState({showModel:'edit', editMemoItem:record});
    };
    onViewMemoHandler = (record) => {
        this.setState({showModel:'view', editMemoItem:record});
    };
    onNewSaveHandler = (val) => {
        const { item, value1, value2 } = val;
        const {customerId, elderlyId} = this;
        httpServer.saveCheckRecoder({value1, value2, itemName:item.label, itemCode:item.key, customerId, elderlyId}).then(res => {
            console.log('save res:',res);
            res.code === 200 ? this.setState({showModel:null}) : this.notice('error', res.msg);
            this.fetcheMemoList();
        });
    };
    saveModifyHandler = (record) => {
        const { value1, value2, itemCode, id, customerId, elderlyId } = record;
        httpServer.updateCheckRecoder({id, value1, value2, itemCode, customerId, elderlyId}).then(res => {
            // console.log('update ...',res);
            if(res.code === 200 ){
                this.notice('success', res.msg);
                this.setState({showModel:null});
                this.fetcheMemoList();
            }else{
                this.notice('error', res.msg);
            }
        })
    };
    itemDeleteHandler = (record) => {
        httpServer.deleteCheckRecoder({id:record.id, customerId:this.customerId}).then(res => {
            // console.log('del res:',res);
            if(res.code === 200 ){
                this.notice('success', res.msg);
                this.setState({showModel:null});
                this.fetcheMemoList();
            }else{
                this.notice('error', res.msg);
            }
        })
    };
    render() {
        const { elderly, onBack } = this.props;
        const { initLoading, loading, list, showModel, checkItems, editMemoItem, itemsInfo, chartData } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div style={{
                textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
            }}
            >
                <Button onClick={this.onLoadMore}>loading more</Button>
            </div>
        ) : null;
        return (
            <Card bordered={false} title={`${elderly.name}体检详情`} extra={<Button onClick={onBack}>返回</Button>}>
                <Button type="primary" size="small" title="指标波动图" onClick={this.onShowEChartHandler}><Icon type="line-chart" /></Button>
                <Button type="primary" size="small" title="新增体检单" onClick={this.onAddMemoHandler}><Icon type="plus" /></Button>
                <List
                    className="demo-loadmore-list"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={list}
                    renderItem={item => {
                        let rNames = item.tbCheckRecordList.map(i => i.itemName);
                        return (
                            <List.Item actions={[moment(item.checkDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ?
                                <a onClick={() => this.onEditMemoHandler(item)}>编辑</a> : '',
                                <a onClick={() => this.onViewMemoHandler(item)}>查看</a>]}
                            >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        title={moment(item.checkDate).format('YYYY-MM-DD')}
                                        description={`体检项目：${rNames.filter((r,idx) => rNames.indexOf(r) === idx)}`}
                                    />
                                    <div style={{width:'250px'}}>
                                        {item.tbCheckRecordList.map((i,idx) => {
                                                if(idx<3) return <p key={i.id} className="lineH">{i.itemName}: <span className="mr-s">{i.value1}</span> {i.value2 || ''}</p>;
                                                if(idx === 3) return <p key={i.id} className="lineH">...</p>;
                                                return null;
                                            })
                                        }
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )
                    }}
                />
                {
                    showModel ? <ModelBox onCancel={this.onModelCancelHandler} setting={this.setting[showModel] || {} }>
                        {
                            showModel === 'chart' ? <IndicatorChart itemsInfo={checkItems||[]} onChange={this.onChartItemChangeHandler} data={chartData || {} } />
                                : (showModel === 'edit' ? <EditContent editMemoItem={editMemoItem} saveModify={this.saveModifyHandler} itemDelete={this.itemDeleteHandler} />
                                : (showModel === 'view' ? <EditContent editMemoItem={editMemoItem} />
                                : <NewContent name={elderly.name} checkItems={checkItems} onSave={this.onNewSaveHandler} />))
                        }
                    </ModelBox> : null
                }
            </Card>
        )
    }
}