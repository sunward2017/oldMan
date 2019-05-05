import React , { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import httpServer from '../../axios';
import {notification ,Row, Col, Tree, Icon, Button} from 'antd';
import {host} from '@/axios/config'

const { TreeNode } = Tree;
class AuthManage extends Component{
  constructor(props){
    super(props);
    this.state = {
      customerList:[],
      menuList:[],
      customerId:'',
      checkedKeys: [],
      children:[],
      dataArry:[],
    }
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
  }
  componentDidMount(){
    this.getCustomerList();
    this.getMenuList();
  }
  //获取客户列表
  getCustomerList(){
    httpServer.listCustomerInfo().then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: '客户信息列表获取成功',
          duration: 2,
        };
        notification.success(args);
        res.data?this.setState({customerList:res.data}):this.setState({customerList:[]});
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
      
    }).catch((err)=>{
      console.log(err);
    });
  }
  //获取菜单列表
  getMenuList(customerId){
    const _this = this;
     httpServer.getCustomerPermission({customerId}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: '菜单列表获取成功',
          duration: 2,
        };
        notification.success(args);
        res.data?_this.setState({menuList:[res.data],checkedKeys:[]}):_this.setState({menuList:[],checkedKeys:[]});
        if(customerId){
          _this.setState({dataArry:[res.data]},()=>{
            _this.getCheckedKeysArry(this.state.dataArry);
          });
        }
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
    }).catch((err)=>{
      console.log(err);
    });
  }
  

  getCheckedKeysArry(data){
    const _this = this;
    const {checkedKeys} = _this.state;
    const arry = checkedKeys;
   
    data && data.map((item,index)=>{
      if(item.checked === true){
        arry.push(item.id.toString());
        _this.setState({checkedKeys:[...arry]});
      }
      if(item.children){
        _this.getCheckedKeysArry(item.children);
      }
      return item;
    });
    
  }


  //保存用户权限
  handleBtnClick(){
    const _this = this;
    const {customerId,children} = _this.state;
    const data = {};
    data.customerId = customerId;
    data.children = children;
    console.log(customerId.length);
    if(customerId.length === 0){
      const args = {
            message: '友情提示',
            description: '请先单击选中客户名称',
            duration: 2,
          };
          notification.info(args);
    }else{
      let request = new Request(host.api+'/saveCustomerPermission', {
        body: JSON.stringify(data),
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json;charset=utf-8'
        })
      });
      fetch(request).then(resp => resp.json()).then( res => {
        if (res.code === 200) {
           notification.success({
            message: '通信成功',
            description: res.message,
          });
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
      }).catch(err => { console.log(err) });
    }
  }

  handleOnSelect(selectedKeys,e){
    if(!e.selected) return;
    const {selectedNodes} = e;
    const customerId = selectedNodes[0].props.data_customerId;
    this.getMenuList(customerId);
    this.setState({customerId});
  }

  onCheck = (checkedKeys, info) => {
    const _this = this;
    this.setState({ checkedKeys: checkedKeys.checked},()=>{
      const {checkedKeys} = _this.state;
      const children = [];
      for(let i=0;i<checkedKeys.length;i++){
         children.push({"id":checkedKeys[i]});
      }
      _this.setState({children});
    });
  };

   renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.id} dataRef={item} />;
  })


  render(){
    const {menuList,customerList,checkedKeys} = this.state;
    return (
      <div>
        <BreadcrumbCustom first="系统管理" second="权限管理" />
        <div>
          <span style={{marginRight:20,fontSize:"16px"}}>tips:请先单击选中左侧客户列表中的客户名称</span>
          <Button type='primary' onClick={this.handleBtnClick}>保存权限</Button>
        </div>
        <Row gutter={16}>
          <Col md={8} style={{border:'1px solid #ccc',backgroundColor:'#fff',paddingBottom:'20px',height:'820px',overflow:'auto'}}>
            <Tree
              showIcon
              defaultExpandAll
              switcherIcon={<Icon type="down" />}
              style = {{maxHeight:'666px',overflow:'auto'}}
              onSelect = {this.handleOnSelect}

            >
              <TreeNode 
                icon={<Icon type="smile-o" />} 
                title="客户列表" key="0-0" 
                selectable={false}
              >
                {
                  customerList && customerList.map((item,index)=>{
                    return <TreeNode icon={<Icon type="meh-o" />} title={item.customerName} key={item.id} data_customerId={item.customerId} />
                  })
                }
              </TreeNode>
            </Tree>
          </Col>
          <Col md={16}>
            <Tree
             defaultExpandAll
             checkable
             onCheck={this.onCheck}
             checkedKeys={checkedKeys}
             checkStrictly
            >
              {this.renderTreeNodes(menuList)}
            </Tree>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AuthManage;