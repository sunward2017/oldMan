import React from 'react';
import { Row, Col, Card, Button, notification, Icon } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import Tree from '../../../common/tree';
import httpServer from '../../../axios/index';
import DeptAdd from './DeptAdd';

export default class DeptInfo extends React.Component {
    state = {
        zNodes :[],
        selectedNode:null,
        dataSource:[],
    };
    componentDidMount() {
        this.fetchTreeData();
    }
    fetchTreeData() {
        httpServer.getDeptInfoTree({customerId:this.props.auth.customerId}).then(res => {
            if(res.code === 200 ) {
                res.data ? this.setState({ zNodes : [{...res.data, open:true}]}) : this.setState({ zNodes : []})
            }
        })
    }
    
    nodeEditHandler = (nodeData, cb) => {
        const { customerId,id,departmentName } = nodeData;
        httpServer.updateDeptInfo({ customerId,id,departmentName }).then(res => {
            if(res.code ===200) {
                cb(true);
                this.fetchTreeData();
                this.notice('success',res.msg);
                this.setState({selectedNode:nodeData});
            }else{
                cb(false);
                this.notice('error',res.msg);
            }
        });
    };
    nodeDeleteHandler = (nodeData, cb) => {
        const { customerId,id } = nodeData;
        const {selectedNode} = this.state;
        httpServer.deleteDeptInfo({customerId,id}).then(res => {
            if(res.code === 200) {
                cb(true,nodeData);
                this.fetchTreeData();
                this.notice('success', res.msg);
                if(selectedNode && selectedNode.id === nodeData.id){
                    this.setState({selectedNode:null});
                }
            }else {
                this.notice('error', res.msg);
            }
        });
    };
    nodeAddHandler = (pNode, cb) => {
        const { customerId ,parentId,id} = pNode;
        httpServer.saveDeptInfo({departmentName:'new', customerId, parentId:id}).then(res => {
            if(res.code ===200) {
                cb(true,res.data);
                this.fetchTreeData();
                this.notice('success', res.msg);
            }else {
                this.notice('error', res.msg);
            }
        }).catch(err => {});
    };
    nodeClickHandler = (nodeData) => {
        const {selectedNode} = this.state;
        const _this = this;
        if(nodeData.parentId ===0 || (selectedNode && selectedNode.id === nodeData.id)) return;
        _this.setState({selectedNode:nodeData},()=>{
            _this.getDeptStaffList();
        });
    };
   
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }

        //获取部门员工列表
      getDeptStaffList(){
        const {departmentId} = this.state.selectedNode;
        const {customerId} = this.props.auth;
        httpServer.listOperator({customerId,deptId:departmentId}).then((res)=>{
          if (res.code === 200) {
            res.data?this.setState({dataSource:res.data}):this.setState({dataSource:[]});
          }else{
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

    render() {
        const { zNodes,selectedNode,dataSource} = this.state;
        return (
            <div>
                <BreadcrumbCustom first="基本信息" second="部门信息" />
                <Row gutter={16}>
                    <Col className="gutter-row"  lg={6} xl={6}>
                        <div className="gutter-box">
                            <Card bordered={false} size="small" title="部门列表:">
                                <Tree id={'payItemTree'} zNodes={zNodes}
                                      onEdit={this.nodeEditHandler}
                                      onDelete={this.nodeDeleteHandler}
                                      onAddNew={this.nodeAddHandler}
                                      onNodeClick={this.nodeClickHandler}
                                      editableTree="true"
                                      levelMax={1}
                                      nodeName='departmentName'
                                />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row"  lg={18} xl={18}>
                        <div className="gutter-box" >
                            <Card bordered={false}>
                               {
                                selectedNode?<DeptAdd customerId={this.props.auth.customerId} selectedNode={selectedNode} dataSource={dataSource} getDeptStaffList={()=>{this.getDeptStaffList()}} />:<p style={{color:'rgb(208,208,208)'}}>请先在右侧选择部门!</p>
                               }
                            </Card>
                        </div>
                    </Col>
                </Row>
                <style>{`
                    .sliderNameIpt{
                        border:none;
                        border-bottom:1px solid #d9d9d9;
                        position: relative;
                        z-index:50;
                        width:100%;
                        background-color:transparent;
                    }
                    .sliderNameIpt:focus{
                        outline:none;
                    }
                    .payItemAddBtn{
                        position:absolute;
                    }
                `}</style>
            </div>
        )
    }
}