import React, { Component,Fragment } from 'react';
import { Tabs, Icon, notification, Button, Row, Col,Card,Tree  } from 'antd';
import httpServer from '@/axios/index';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import ItemList from './table' 

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

export default class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData:[],
      activeKey:'',
    };
  };
  
  componentDidMount() {
    this.getTypeTree();
  }
  
  getTypeTree = () => {
    httpServer.listEstimateType({}).then(res => {
        if(res.code === 200 ) {
            const zNodes = {typeName:'根目录',id:"0",open:true};
            zNodes.children = res.data?res.data:[];
            this.setState({treeData:[zNodes]})
        } 
    })
  }
  
  onTreeSelect = (selectedKeys, info) => {
      this.setState({activeKey:selectedKeys[0]})
  }
   
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.typeName} key={item.id} selectable={false}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.typeName} key={item.id} dataRef={item}/>;
    });
  }
  
  render() {
    const { treeData, activeKey} = this.state;
    const rowSelection = {
      onChange: this.onRoleSelectedChange
    };
    return (
      <Fragment>
        <BreadcrumbCustom first="基础信息" second='评估库' />
        <Row gutter={16}>
          <Col  md={10} lg={8} xl={6}>
            <Card title="评估类别" >
              <Tree onSelect={this.onTreeSelect} >
                { treeData&&this.renderTreeNodes(treeData) }
              </Tree>
            </Card>
          </Col>
          <Col   md={14} lg={16} xl={18}>
             <ItemList key={activeKey} classId ={activeKey}/>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
