
import React, { useState, useEffect, useRef } from 'react'
import './manage.less'
import { Button, Tag, Table, Popconfirm, Modal, Form, Input, DatePicker, Select, message } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { deleteActivity, getActivities, newActivity, updateState, updateActivity } from '../../api/activities';

const { RangePicker } = DatePicker;

interface ActiRecord {
  id: number;
  activity: string;
  state: number;
  time: string;
}
const zero = (text: string) => {
  return text.length < 2 ? '0' + text : text;
};

const formateTime = function formateTime(time: string) {
  let arr = time.match(/\d+/g),
    [, month, day, hours = '00', minutes = '00'] = arr;

  return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
};

export default function manage() {
  const columns: ColumnsType<ActiRecord> = [
    {
      title: '活动',
      dataIndex: 'title',
      width: '40%',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text: string) => {
        switch (+text) {
          case 0:
            return '待审核';
          case 1:
            return '不通过';
          case 2:
            return '进行中';
          case 3:
            return '已完成';
        }
      }
    },
    {
      title: '开始时间',
      dataIndex: 'time',
      render: (date: { start: Date; end: Date }) => {
        let text = date.start.toString();
        return formateTime(text);
      }
    },
    {
      title: '操作',
      render: (_, record: any) => {
        let { id, state } = record;
        return (<>
          <Popconfirm title="确认删除活动吗?"
            onConfirm={removeHandler.bind(null, id)}>
            <Button type='link'>删除</Button>
          </Popconfirm>
          {+state === 2 ?
            <Popconfirm title="确认标记活动为已完成吗?"
              onConfirm={finishHandler.bind(null, id)}>
              <Button type='link'>完成</Button>
            </Popconfirm> : null}
          {+state === 0 ?
            <Popconfirm title="确认修改活动信息吗?活动将被重新审核。"
              onConfirm={updateHandler.bind(null, id)}>
              <Button type='link'>编辑</Button>
            </Popconfirm> : null}

        </>);
      }
    },

  ];

  let [selectedIndex, setSelectedIndex] = useState(0),
    [tableData, setTableData] = useState([]),
    [tableLoading, setTableLoading] = useState(false),
    [modalVisible, setModalVisible] = useState(false),
    [confirmLoading, setConfirmLoading] = useState(false);


  let [formIns] = Form.useForm();


  // close dialog and clean form content
  const closeModal = () => {
    setModalVisible(false);
    setConfirmLoading(false);

    formIns.resetFields();
  };

  // submit new activity
  const submit = async () => {
    console.log(formIns);
    try {
      await formIns.validateFields();
      let data = formIns.getFieldsValue();
      data.time = {
        start: data.time[0].format('YYYY-MM-DDTHH:mm:ss'),
        end: data.time[1].format('YYYY-MM-DDTHH:mm:ss'),
      }
      data.location = { text: data.location }
      console.log(data);
      setConfirmLoading(true);
      try {
        const response = await newActivity({ ...data, state: 0 });
        message.success(response.data.title + "活动已创建成功");
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
      queryData();
      closeModal();
    } catch (_) { }
    setConfirmLoading(false);
  };

  //process table data
  const queryData = async () => {
    setTableLoading(true);
    try {
      const response = await getActivities(selectedIndex - 1);
      if (response.data) {
        setTableData(response.data);
      }
    } catch (error) {
      message.error('拉取数据失败', error);
    }
    setTableLoading(false);
  }

  useEffect(() => { queryData() }, [selectedIndex]);

  //
  const removeHandler = async (id: number) => {
    try {
      try {
        const response = await deleteActivity(id);
        message.success(response.data.title + "活动已删除");
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
      queryData();
    } catch (_) { }
  }
  const finishHandler = async (id: number) => {
    try {
      try {
        //state:3, finished
        const response = await updateState(3, id);
        message.success(response.data.title + "活动已完成");
      } catch (error) {
        message.error('当前操作失败，请稍后重试', error);
      }
      queryData();
    } catch (_) { }
  }
  const updateHandler = async (id: number) => {

  }

  return (
    <div className='acti-box'>
      {/*header*/}
      <div className='header'>
        <h2 className='title'>我的活动</h2>
        <Button type="primary" onClick={() => {
          setModalVisible(true);
        }}>创建新活动</Button>
      </div>
      {/*tag*/}
      <div className="tag-box">
        {['全部', '审核中', '不通过', '进行中', '已完成'].map((item, index) => {
          return <Tag className="tag" key={index}
            color={index === selectedIndex ? '#1677ff' : ''}
            onClick={() => {
              setSelectedIndex(index);
            }}>{item}</Tag>;
        })}
      </div>

      {/*table*/}
      <Table<ActiRecord> dataSource={tableData}
        columns={columns}
        loading={tableLoading}
        pagination={false}
        rowKey="id" />

      {/* dialog & form */}
      <Modal title="新活动"
        open={modalVisible}
        confirmLoading={confirmLoading}
        keyboard={false} maskClosable={false}
        onOk={submit} okText="提交" onCancel={closeModal} cancelText="取消">
        <Form form={formIns}
          layout='horizontal' initialValues={{
            title: "2018级迎新晚会 金秋展艺 码上生花",
            description: "三院联合主办「金秋展艺 码上生花」迎新晚会,在这场热火朝天的晚会里,三个学院的同学为新生们带来了赏心悦目的艺术表演。",
            location: '学术大讲堂',
            actype: 'moral',
            score: 0.5,
            capacity: 200,
          }}>
          <Form.Item label="活动名称" name="title" validateTrigger='onBlur'
            rules={[
              { required: true, message: "活动标题是必填项" },
            ]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="活动描述" name="description">
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item label="活动日期" name="time" validateTrigger='onBlur'
            rules={[
              { required: true, message: "活动日期是必填项" },
            ]}>
            <RangePicker showTime></RangePicker>
          </Form.Item>
          <Form.Item label="活动地点" name="location">
            <Input></Input>
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
          <Form.Item label="活动人数" name="capacity">
            <Input></Input>
          </Form.Item>
        </Form>

      </Modal>

    </div>
  );

}
