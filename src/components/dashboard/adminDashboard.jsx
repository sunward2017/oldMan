import React from 'react';
import { Card } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';

export default class AdminDashboard extends React.Component {
    state = {
    };
    componentDidMount(){
    }

    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Card>
                    admin dashboard ~
                </Card>
            </div>
        )
    }
}
