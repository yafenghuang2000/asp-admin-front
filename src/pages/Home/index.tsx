import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from 'antd';
import { addMenu } from '@/service/userService';
import XmsHeader from '@/components/xms-header';
import { BarChartdata, LineChartData, PieChartCOLORS, PieChartdata } from './data';
import './index.scss';

const Home: React.FC = () => {
  const handelAddmens = async () => {
    const res = await addMenu({
      // id: '1', // 菜单ID
      // label: '首页', // 菜单名称
      // path: '/', // 菜单路径
      id: 'menu3', // 菜单ID
      label: 'submenu子菜单', // 菜单名称
      path: '/submenu/list', // 菜单路径
      parentId: 'menu2', // 父节点ID
    });
    console.log(res, 'res');
  };
  return (
    <div className='home'>
      <XmsHeader title='首页' />
      <div className='home-content'>
        <BarChart
          width={500}
          height={300}
          data={BarChartdata}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='pv' fill='#8884d8' />
          <Bar dataKey='uv' fill='#82ca9d' />
        </BarChart>

        <LineChart
          width={500}
          height={300}
          data={LineChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
          <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
        </LineChart>

        <PieChart width={400} height={400}>
          <Pie
            data={PieChartdata}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {PieChartdata.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PieChartCOLORS[index % PieChartCOLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <Button type='primary' onClick={handelAddmens}>
          新增菜单
        </Button>
      </div>
    </div>
  );
};

export default Home;
