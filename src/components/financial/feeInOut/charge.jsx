import React from 'react';
import { Row, Col, Button, InputNumber, Select, Input,Icon } from 'antd';
import {typeObj,methodObj} from '@/utils/constant';

const Option = Select.Option;

export const Charge = ({ disabled,status,onFeeSave, onFeeChange, creditList, iptColor}) => {
	let Obj = status===1?{...typeObj,1:'预约定金'}:{...typeObj}
    return (
        <React.Fragment>
            <Row className="mb-s white">
                <Col md={24}>收费项目 :
                    <Select className="w60p ml-m"
                        onChange={(v) => onFeeChange('type', Number(v))}
                    >
                       { Object.keys(Obj).map(k=>(<Option value={k} key={k}>{Obj[k]}</Option>))}
                    </Select>
                </Col>
            </Row>
            <Row className="mb-s white">
                <Col md={24}>&emsp;付款人:
                    <Input className="w60p ml-m" onChange={(e) => onFeeChange('payName', e.target.value )} />
                </Col>
            </Row>
            <Row className="mb-s white">
                <Col md={24} >收款账号:
                    <Select className="ml-m w60p" onChange={(v) => onFeeChange('creditedAccount', v)}>
                        { creditList.map(o => <Option value={o.value} key={o.id}>{o.value}</Option>) }
                    </Select>
                </Col>
            </Row>
            <Row className="mb-s white">
                <Col md={24}>&emsp;&emsp;备注:
                    <Input className="w60p ml-m" onChange={(e) => onFeeChange('memo', e.target.value )} />
                </Col>
            </Row>
            <Row>
                <Col md={24}><span className="white">付款金额 :</span>
                    <InputNumber className="mr-s ml-m"
                                 style={{color:iptColor,width:140}}
                                 onChange={(v) => onFeeChange('money',v)}
                                 formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    <Select className="w-120 mr-s" defaultValue="2"
                        onChange={(v) => onFeeChange('settlementMethod', Number(v))}
                    >
                       {
                       	 Object.keys(methodObj).map(k=>(<Option value={k} key={k+'m'}>{methodObj[k]}</Option>))
                       }
                    </Select>
                    <Button type="primary" onClick={onFeeSave} disabled={disabled}>充值</Button>
                </Col>
            </Row>
        </React.Fragment>
    )
};