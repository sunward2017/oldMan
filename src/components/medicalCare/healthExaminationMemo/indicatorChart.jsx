/**
 * Created by hao.cheng on 2017/4/17.
 */
import React from 'react';
import { Select, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
// import moment from 'moment';
const Option = Select.Option;

export default ({itemsInfo, onChange, data}) => {
    let series = [];
    Object.keys(data).forEach(k => {
        data[k].forEach(arrItem => {
            series.push({
                name: k,
                type:'line',
                smooth:true,
                data: arrItem
            })
        })
    });

    const option = {
        color:['#d14a61','#008080','#F4A460','#D2691E','#F08080','#800000','#40E0D0','#DDA0DD','#4F4F2F'],
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        // dataZoom: [{
        //     type: 'inside',
        //     start: 0,
        //     end: 10
        // }, {
        //     start: 0,
        //     end: 10,
        //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //     handleSize: '80%',
        //     handleStyle: {
        //         color: '#fff',
        //         shadowBlur: 3,
        //         shadowColor: 'rgba(0, 0, 0, 0.6)',
        //         shadowOffsetX: 2,
        //         shadowOffsetY: 2
        //     }
        // }],
        series: series
    };

    return (
        <React.Fragment>
            <Select labelInValue style={{width:'100px'}} placeholder="选择指标项" onChange={onChange}>
                { itemsInfo.map(i => <Option key={i.id} value={i.id} >{i.name}</Option>) }
            </Select>
            <ReactEcharts
                option={option}
                style={{height: '300px', width: '100%'}}
                className={'react_for_echarts'}
            />
        </React.Fragment>
    )
}
