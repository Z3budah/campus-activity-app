import React from 'react'

/* request */
import { getActivity } from '../../api/activities';
import useRequest from '../../hooks/use-request';

import { Button } from 'antd';
import Detail from '../../components/activity/Detail';

const ActivityShow = ({ activity }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/regs',
    method: 'post',
    onSuccess: (regs) => {
      console.log(regs);
    }
  });

  const onReg = async () => {
    await doRequest({
      activityId: activity.id
    });
    console.log(
      errors
    )
  }

  return (
    <>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>活动详情页</h2>
      </div>
      {/*detail*/}
      <div className='d-flex'>
        <Detail activity={activity} />
        <div>
          <p>活动注册情况</p>
          {
            activity.regsId.map((item) => {
              return (
                <p key={item}>注册Id:{item}</p>)
            })
          }
        </div>
      </div>
      <div className='bottom'>
        <div >活动执行</div>
        <Button type='primary' onClick={onReg}>测试：注册活动</Button>
        {errors &&
          (<div className='alert alert-danger'>
            <h4>Ooops...</h4>
            <ul className='my-0'>
              {errors.map(err => <li key={err.message}> {err.message} </li>)}
            </ul>
          </div>)
        }
      </div>s
    </>
  );
}

ActivityShow.getInitialProps = async (context) => {
  const { activityId } = context.query;
  /*test data */

  try {
    const { data } = await getActivity(activityId);
    return { activity: data };
  } catch (_) {
    const test_data = {
      "title": "2018级迎新晚会 金秋展艺 码上生花",
      "description": "三院联合主办「金秋展艺 码上生花」迎新晚会,在这场热火朝天的晚会里,三个学院的同学为新生们带来了赏心悦目的艺术表演。",
      "time": { "start": "2024-02-23T17:18:23", "end": null },
      "location": { "text": "学术大讲堂" },
      "actype": "moral",
      "score": 0.5,
      "capacity": 200,
      "pubId": "65d860fec6be34b740c813fe",
      "state": 0,
      "regsId": [
        "65d963101fa4ead690df750f"
      ],
      "version": 0,
      "id": "65d862e0cd11956a99e8728a"
    };
    return { activity: test_data };
  }

};

export default ActivityShow;