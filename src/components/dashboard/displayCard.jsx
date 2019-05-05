import React from 'react';
import { Row, Col, Card, Icon, Divider } from 'antd';

export const MinCard = ({data, icon, title, color}) => (
    <div className="gutter-box">
        <Card bordered={false} style={{backgroundColor:color}}>
            <div className="clear y-center">
                <div className="pull-left mr-m">
                    <Icon type={icon} className="text-2x" />
                </div>
                <div className="clear">
                    <div className="text-muted">{title}</div>
                    <h2>{ data || '--'}</h2>
                </div>
            </div>
        </Card>
    </div>
);

export const LongCard = ({data, color}) => (
    <div className="gutter-box">
        <Card bordered={false} style={{backgroundColor:color}}>
            <div className="clear y-center">
                <div className="pull-left mr-m">
                    <Icon type="build" className="text-2x" />
                </div>
                <Row className="clear w-full">
                    <Col md={8}>
                        <div className="text-muted">床位总数</div>
                        <h2>{data.bedNumber} <Divider type="vertical" /></h2>
                    </Col>
                    <Col md={8}>
                        <div className="text-muted">空床位数</div>
                        <h2>{data.freeBedNumber} <Divider type="vertical" /></h2>
                    </Col>
                    <Col md={8}>
                        <div className="text-muted">床位空置率</div>
                        <h2>{data.proportion}%</h2>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
);