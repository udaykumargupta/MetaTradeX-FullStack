import { Button } from "@/components/ui/button";
import { fetchMarketChart } from "@/State/Coin/Action";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
const timeSeries = [
  {
    keyword: "DIGITAL_CURRENCY_DAILY",
    key: "Time Series (Daily)",
    lable: "1 Day",
    value: 1,
  },
  {
    keyword: "DIGITAL_CURRENCY_WEEKLY",
    key: "Weekly Time Series",
    lable: "1 Week",
    value: 7,
  },
  {
    keyword: "DIGITAL_CURRENCY_MONTHLY",
    key: "Monthly Time Series",
    lable: "1 Month",
    value: 30,
  },
  {
    keyword: "DIGITAL_CURRENCY_YEARLY",
    key: "Yearly Time Series",
    lable: "1 Year",
    value: 365,
  },
];
const StockChart = ({ coinId }) => {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);

  const [activeLable, setActiveLable] = useState(timeSeries[0]);
  const searies = [
    {
      data: coin.marketChart.data,
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#FF4560', '#00E396'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#e0e0e0',
      row: {
        opacity: 0.5,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#9A9A9A',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9A9A9A',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -5,
    },
  };
  const handleActiveLable = (value) => {
    setActiveLable(value);
  };

  useEffect(() => {
    dispatch(
      fetchMarketChart({ coinId, days:activeLable.value, jwt: localStorage.getItem("jwt") })
    );
  }, [dispatch, coinId, activeLable]);
  return (
    <div>
      <div className="space-x-3">
        {timeSeries.map((item) => (
          <Button
            variant={activeLable.lable == item.lable ? "" : "outline"}
            onClick={() => handleActiveLable(item)}
            key={item.lable}
          >
            {item.lable}
          </Button>
        ))}
      </div>
      <div id="chart-timelines">
        <ReactApexChart
          options={options}
          series={searies}
          height={450}
          type="area"
        ></ReactApexChart>
      </div>
    </div>
  );
};

export default StockChart;
