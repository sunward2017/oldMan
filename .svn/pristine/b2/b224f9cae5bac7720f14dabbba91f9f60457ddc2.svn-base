import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

export default ({data}) => {
    const option = {
        color:['#008080','#F4A460','#D2691E','#F08080','#669999','#CC3333'],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: data.map(i => i.name)
        },
        series : [
            {
                name: '年龄分布',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return <ReactEcharts
        option={option}
        style={{height: '450px', width: '100%'}}
        className={'react_for_echarts'}
    />
}