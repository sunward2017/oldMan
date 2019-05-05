import React, { Component,Fragment } from 'react';
import { Table, Tabs, Icon, notification, Button, Row, Col,Card,Tree  } from 'antd';
import httpServer from '../../../axios/index';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import urls from '@/axios/config';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

export default class Permission extends Component {
  constructor(props) {
    super(props);
    this.columns=[{
      title: '角色名称',
      dataIndex: 'roleName',
      key:'roleName',
       align:'center'
    },{
      title: '描述',
      dataIndex: 'roleDescription',
      key:'roleDescription',
    }];
    this.state = {
      listData:[],
      treeData:[],
      selectedNode:null,
      selectedRowKeys:[],
      activeKey:'1'
    };
  };
  
  componentDidMount() {
    this.getRoleList();
    this.getUserTree();
  }
  
  getRoleList = (uid) =>{
    httpServer.getUserRolesInfo({userId:uid}).then(res=>{
      if(res.code === 200){
        if (uid) {
          res.data?this.setState({selectedRowKeys:res.data.map(item => {
            if (item.checked) return item.id;
            return null;
          }).filter(i => !!i)}) : this.setState({selectedRowKeys:[]});
        }else {
          // console.log(res);
          res.data?this.setState({listData:res.data}):this.setState({listData:[]});
        }
      } else {
        notification.error({
          message: '通信失败',
          description: res.msg,
          duration: 2,
        });
      }
    }).catch(
      err => { console.log(err) }
    )
  };
  
  getUserTree = () => {
    const {customerId} = this.props.auth;
    httpServer.getDeptAndUserInfo({customerId}).then(res => {
      if(res.code === 200){
        // console.log(res);
        res.data?this.setState({treeData:[res.data]}):this.setState({treeData:[]});
      } else {
        notification.error({
          message: '通信失败',
          description: res.msg,
          duration: 2,
        });
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  
  onTreeSelect = (selectedKeys, info) => {
    // console.log('tree selected', selectedKeys, info);
    if(!info.selected) {
      this.setState({selectedNode:null,selectedRowKeys:[]});
      return;
    }
    const node = info.selectedNodes[0].props.dataRef;
    console.log(node);
    this.setState({selectedNode:node});
    this.getRoleList(node.userId);
  }
  
  onRoleSelectedChange = (selectedRowKeys,rows) => {
    // console.log('selectedRowKeys:',selectedRowKeys, 'selectedRows: ', rows);
    this.setState({selectedRowKeys})
  }
  
  handleSave = () => {
    const { selectedNode, selectedRowKeys } = this.state;
    const { userId, customerId } = selectedNode;
    const roles = selectedRowKeys.map(key => ({rid:key}));
    let request = new Request(urls.saveUserRolesInfo, {
      body: JSON.stringify({customerId, userId, roles}),
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8'
      })
    });
    fetch(request).then(resp => resp.json()).then( res => {
      // console.log('save res:',res);
      if (res.code === 200) {
        notification.success({
          message: '通信成功',
          description: res.msg,
        });
      } else {
        notification.error({
          message: '通信失败',
          description: res.msg,
        });
      }
    }).catch(err => { console.log(err) });
  }
  
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.departmentName} key={item.id+item.departmentName} selectable={false}>
            {this.renderTreeNodes(item.children.length>0?item.children:item.children1)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name+'('+item.account+')'} key={item.id} dataRef={item}/>;
    });
  }
  
  render() {
    const { treeData, listData, activeKey, selectedNode, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onRoleSelectedChange
    };
    return (
      <Fragment>
      <BreadcrumbCustom first="系统设置" second="角色权限" />
        <Row gutter={16}>
          <Col  md={10} lg={8} xl={6}>
            <Card title="用户列表" >
              <Tree onSelect={this.onTreeSelect} >
                      { treeData&&this.renderTreeNodes(treeData) }
              </Tree>
            </Card>
          </Col>
          <Col   md={14} lg={16} xl={18}>
           <Card title="角色列表" extra={<Button type='primary' onClick={this.handleSave} disabled={!selectedNode}>保存用户角色</Button>}>
            <Table bordered dataSource={listData} columns={this.columns} rowKey={record => record.id}  rowSelection={rowSelection} />
            </Card>
          </Col>
        </Row>
      </Fragment>
     
    )
  }
}
