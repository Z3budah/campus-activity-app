import React from 'react';
import Create from '../../../components/activity/Create';
/* request */
import { getActivity } from '../../../api/activities';


const ActivityEdit = function edit(props) {
  const { activity, id } = props;
  return (
    <Create activity={activity} id={id} />
  )
};


ActivityEdit.getInitialProps = async (context) => {
  const { activityId } = context.query;
  try {
    const { data } = await getActivity(activityId);
    return { activity: data, id: activityId };
  } catch (err) {
    const test_data = {
      "title": "测试数据",
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
    return { activity: test_data, id: activityId };
  }
};

export default ActivityEdit;