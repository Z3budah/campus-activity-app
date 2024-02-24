import React from 'react';
import { Descriptions } from 'antd';
import { formateTime } from '../../public/timeutils';

const actype = {
  "culsport": "文体分",
  "intellectual": "智育分",
  "moral": "德育分"
};

const state = ['待审核', '不通过', '进行中', '已完成'];

const Detail = ({ activity }) => {
  const items = [
    {
      label: '活动名称',
      children: (<>{activity.title}</>),
      span: 2,
    },
    {
      label: '活动状态',
      children: (<>{state[activity.state]}</>),
    },
    {
      label: '活动日期',
      children: (<>{formateTime(activity.time.start.toString(), 'detail')}</>),
      span: 3,
    },
    {
      label: '人数限制',
      children: (<>{activity.capacity}</>),
    },
    {
      label: '活动分类型',
      children: (<>{actype[`${activity.actype}`]}</>),
    },
    {
      label: '活动分值',
      children: (<>{activity.score}</>),
    }
  ];

  return (
    <Descriptions
      title="基本信息"
      bordered
      column={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      items={items}
      style={
        {
          margin: '1rem'
        }
      }
    />
  );
};

export default Detail;