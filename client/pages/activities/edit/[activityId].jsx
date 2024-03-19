import React from 'react'
import { Button, Form, Input, DatePicker, Select, Flex, message } from 'antd';
import dayjs from 'dayjs';
/* request */
import { updateActivity, getActivity } from '../../../api/activities';
/* redux */
import { connect } from 'react-redux';
import action from '../../../store/actions';

import { useRouter } from 'next/router';

import '../../../components/activity/manage.less'

const ActivityEdit = function edit(props) {
  const { activity, id, queryAllList } = props;
  const { title, description, time, location, actype, score, capacity } = activity;
  let [formIns] = Form.useForm();
  formIns.setFieldsValue({
    title,
    description,
    time: dayjs(time.start, "YYYY-MM-DDTHH:mm:ss"),
    location: location.text,
    actype,
    score,
    capacity,
  });



  const router = useRouter();

  /* submit new activity*/
  const submit = async () => {
    try {
      await formIns.validateFields();
      let data = formIns.getFieldsValue();
      data.time = {
        start: data.time.format('YYYY-MM-DDTHH:mm:ss'),
        end: null,
      }
      data.location = { text: data.location }
      try {
        const response = await updateActivity({ ...data, state: 0 }, id);
        message.success(response.data.title + "活动已修改成功");
        queryAllList();
        router.push('/');
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
    } catch (_) { }
  };

  /* reset  */
  const reset = () => {
    formIns.resetFields();
  };

  return (
    <div className='acti-box'>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>编辑活动</h2>
      </div>
      {/*form*/}
      <Form
        className='acti-form'
        form={formIns}
        layout='horizontal'
        onFinish={submit}>
        <Form.Item label="活动名称" name="title" validateTrigger='onBlur'
          rules={[
            { required: true, message: "活动标题是必填项" },
          ]}>
          <Input></Input>
        </Form.Item>

        <Form.Item label="活动日期" name="time" validateTrigger='onBlur'
          rules={[
            { required: true, message: "活动日期是必填项" },
          ]}>
          <DatePicker showTime></DatePicker>
        </Form.Item>
        <Form.Item label="活动分类型" name="actype">
          <Select>
            <Select.Option value="culsport">文体分</Select.Option>
            <Select.Option value="intellectual">智育分</Select.Option>
            <Select.Option value="moral">德育分</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="活动分值" name="score">
          <Input></Input>
        </Form.Item>
        <Form.Item label="活动地点" name="location">
          <Input></Input>
        </Form.Item>
        <Form.Item label="活动人数" name="capacity">
          <Input></Input>
        </Form.Item>
        <Form.Item label="活动描述" name="description"
          rules={[
            { required: true, message: "活动日期是必填项" },
          ]}>
          <Input.TextArea rows={4}></Input.TextArea>
        </Form.Item>

        <Form.Item className='bottom'>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" onClick={reset}>
            重置
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}


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


export default connect(
  state => state.acti,
  action.acti
)(ActivityEdit);