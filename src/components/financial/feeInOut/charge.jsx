import React from 'react';
import { Row, Col, Button, InputNumber, Select, Input,Icon } from 'antd';

const Option = Select.Option;

export const Charge = ({ disabled, onFeeSave, onFeeChange, creditList, iptColor}) => {
    return (
        <React.Fragment>
            <Row className="mb-s">
                <Col md={24}>收费项目 :
                    <Select className="w60p ml-m"
                        onChange={(v) => onFeeChange('type', Number(v))}
                    >
                        <Option value="1">预约定金</Option>
                        <Option value="2">热水器押金 </Option>
                        <Option value="3">医疗押金 </Option>
                        <Option value="4">锁押金 </Option>
                        <Option value="5">住院押金 </Option>
                        <Option value="6">住院预交 </Option>
                        <Option value="7">其他预交 </Option>
                    </Select>
                </Col>
            </Row>
            <Row className="mb-s">
                <Col md={24}>&emsp;付款人:
                    <Input className="w60p ml-m" onChange={(e) => onFeeChange('payName', e.target.value )} />
                </Col>
            </Row>
            <Row className="mb-s">
                <Col md={24} >收款账号:
                    <Select className="ml-m w60p" onChange={(v) => onFeeChange('creditedAccount', v)}>
                        { creditList.map(o => <Option value={o.value} key={o.id}>{o.value}</Option>) }
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col md={24}>付款金额 :
                    <InputNumber className="mr-s ml-m"
                                 style={{color:iptColor,width:120}}
                                 onChange={(v) => onFeeChange('money',v)}
                                 formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    <Select className="w-120 mr-s" defaultValue="2"
                        onChange={(v) => onFeeChange('settlementMethod', Number(v))}
                    >
                        <Option value="2">支付宝</Option>
                        <Option value="3">微信</Option>
                        <Option value="4">刷卡</Option>
                        <Option value="1">现金</Option>
                        <Option value="5">其他</Option>
                    </Select>
                    <Button type="primary" onClick={onFeeSave} disabled={disabled}>充值</Button>
                </Col>
            </Row>
        </React.Fragment>
    )
};