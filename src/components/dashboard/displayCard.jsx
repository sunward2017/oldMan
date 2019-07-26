import React from 'react';
import { Row, Col, Card, Icon, Divider } from 'antd';

export const MinCard = ({data, icon, title,bg,color,lg}) => (
    <div className="gutter-box">
        <Card bordered={false} style={{backgroundColor:bg,color:color,borderRadius:'4px',boxShadow:'0 5px 0 '+lg}}>
            <div className="clear y-center">
                <div className="pull-left mr-l">
                    <Icon type={icon} className="text-3x" />
                </div>
                <div className="clear">
                    <h2 className="white text-center mr-n" style={{fontSize:28}}>{ data || '--'}</h2>
                    <div className="text-muted">{title}</div>
                </div>
            </div>
        </Card>
    </div>
);

export const LongCard = ({data, color}) => (
    <div className="gutter-box">
        <Card bordered={false} style={{backgroundColor:color,color:'#fff',borderRadius:'4px',boxShadow:'0 5px 0 #3c68a5'}}>
            <div className="clear y-center">
                <div className="pull-left mr-m">
                    <Icon type="build" className="text-3x" />
                </div>
                <Row className="clear w-full text">
                    <Col md={8}>
                        <h2 className="white">{data.bedNumber} <Divider type="vertical" /></h2>
                        <div className="text-muted">床位总数</div>
                    </Col>
                    <Col md={8}>
                        <h2  className="white">{data.freeBedNumber} <Divider type="vertical" /></h2>
                        <div className="text-muted">空床位数</div>
                    </Col>
                    <Col md={8}>
                        <h2  className="white">{data.proportion}%</h2>
                        <div className="text-muted">床位空置率</div>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
);