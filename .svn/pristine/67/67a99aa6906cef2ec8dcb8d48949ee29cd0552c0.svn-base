import React from 'react';
import { Row, Col, Card, Input, TreeSelect } from 'antd';
import MemoItem from './memoItem';
const Search = Input.Search;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;

export default ({treeData, records, searchKey, onNameSearch, onItemClick, onTreeSelect}) => {
    let renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode title={item.areaName} key={item.id} value={item.areaCode}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.areaName} key={item.id} value={item.areaCode} />;
    });
    return (
        <React.Fragment>
            <Card bordered={false}>
                <Row gutter={16}>
                    <Col md={4}>
                        <TreeSelect className="w-full"
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeDefaultExpandedKeys={['1']}
                                    onChange={onTreeSelect}
                                    treeCheckable="true"
                                    showCheckedStrategy={SHOW_PARENT}
                                    searchPlaceholder="选择楼层房间" >
                            {renderTreeNodes(treeData)}
                        </TreeSelect>
                    </Col>
                    <Col md={4}>
                        <Search
                            defaultValue={searchKey.name||''}
                            placeholder="按姓名搜索"
                            onSearch={value => onNameSearch(value)}
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
                                <MemoItem data={r} onClick={() => onItemClick(r)} />
                            </Col>
                        ) : '无搜索结果'
                    }
                </Row>
            </Card>
        </React.Fragment>
    )
}
