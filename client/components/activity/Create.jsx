import React from 'react'
import { Button, Form, Input, DatePicker, Select, Flex, message } from 'antd';
import moment from 'moment';
/* request */
import { newActivity } from '../../api/activities';
/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';

import { useRouter } from 'next/router';

import './manage.less'

const Create = function create(props) {
  let { queryAllList } = props;

  let [formIns] = Form.useForm();

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
        const response = await newActivity({ ...data, state: 0 });
        message.success(response.data.title + "活动已创建成功");
        queryAllList();
        router.push('/activities');
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
    } catch (_) { }
  };

  /* reset  */
  const reset = () => {
    formIns.resetFields();
  };

  /* fill test data */
  const fill = () => {
    formIns.setFieldsValue({
      title: "2018级迎新晚会 金秋展艺 码上生花",
      description: "三院联合主办「金秋展艺 码上生花」迎新晚会,在这场热火朝天的晚会里,三个学院的同学为新生们带来了赏心悦目的艺术表演。",
      time: moment(new Date()),
      location: '学术大讲堂',
      actype: 'moral',
      score: 0.5,
      capacity: 200,
    });
  };

  return (
    <div className='acti-box'>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>新建活动</h2>
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
          <Button type="link" htmlType="button" onClick={fill}>
            填充预置值
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}

export default connect(
  state => state.acti,
  action.acti
)(Create);