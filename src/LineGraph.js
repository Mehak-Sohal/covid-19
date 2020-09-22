import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format('+0,0')
            }
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll'
                },
            },
        ],
        yAxes : [
            {
                gridlines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format('0a');
                    },
                },
            },
        ]
    }
}


 
const LineGraph = ({ casesType = 'cases'}) => {
    const [data, setData] = useState({});


    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases){
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
               chartData.push(newDataPoint); 
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=90')
            .then(response => response.json())
            .then(data => {
            const chartData = buildChartData(data, casesType);
            setData(chartData);
        });
        }
        
        fetchData();
    }, [casesType]);

    return (
        <div style={{ height: '300px'}}>
            {data?.length > 0 && (
                <Line
                options = {options}
                data={{
                    datasets: [
                        {
                            backgroundColor: 'rgba(75, 86, 94, 0.4)',
                            borderColor: '#CC1034',
                            data: data
                        },
                    ]
                }} />
            )}
        </div>
    )
}

export default LineGraph