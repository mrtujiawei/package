/**
 * echarts
 * 获取格式化后的chart option
 * 普通折线图
 * @param {object} options - 配置
 * @param {object[]} options.series - 列数据
 * @param {object[]} options.xAxisData - 行数据,一般就是日期
 * @param {object} options.extra 额外的参数
 * @returns [object]
 */
export function getNormalOptions(options = {}) {
  const { series = [], xAxisData = [], extra = {} } = options;
  let normalOptions = {
    animation: true,
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      data: series.map((item) => item.name),
      bottom: '12px',
    },
    series: options.series,
  };

  // 是否转换成百分比
  if (extra.usePercent) {
    normalOptions.yAxis.axisLabel = {
      show: true,
      interval: 'auto',
      formatter: '{value}%',
    };
    normalOptions.tooltip.formatter = (params) => {
      let html = [params[0].name, '<br>'];
      for (let i = 0; i < params.length; i++) {
        html.push(
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'
        );
        html.push(
          params[i].color,
          ';"></span>',
          params[i].seriesName,
          ':',
          params[i].value,
          '%',
          '<br>'
        );
      }
      return html.join('');
    };
  }

  return normalOptions;
}

/**
 * 图表
 * @filename: index.js
 * @author: Mr Prince
 * @date: 2020-09-11 10:31:09
 */
import React, { useRef, useEffect } from 'react';
import Charts from '@/config/charts';
import { useDidRecover } from 'react-router-cache-route';

export function Chart(props) {
  const chart = useRef();
  const instance = useRef();

  // 如果需要不同的表格
  // 只需要修改一下这里获取options的函数就可以
  const { options, loading } = props;

  useEffect(() => {
    const chartInstance = Charts.init(chart.current, 'tdTheme');
    instance.current = chartInstance;
    const resizeEvent = () => chartInstance.resize();
    window.addEventListener('resize', resizeEvent);

    return () => {
      window.removeEventListener('resize', resizeEvent);
      chartInstance && chartInstance.dispose();
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    instance.current && instance.current.setOption(options, true);
  }, [options]);

  useDidRecover(() => {
    instance.current && instance.current.resize();
  });

  useEffect(() => {
    const chartInstance = instance.current;
    if (!chartInstance) {
      return;
    }
    if (loading) {
      chartInstance.showLoading('default', {
        text: '数据正在加载...',
        fontSize: 30,
        color: '#1890ff',
      });
    } else {
      chartInstance.hideLoading();
    }
  }, [loading]);

  return <section ref={chart} className="chart-container" />;
}
