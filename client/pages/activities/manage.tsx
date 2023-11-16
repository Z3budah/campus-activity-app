
import React from 'react'
import './manage.less'
import { Button, Tabs, Table, Popconfirm, Modal, Form, Input, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';


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

const data: ActiRecord[] = [
  {
    id: 1,
    activity: "校园读书会",
    state: 0,
    time: '2022-11-29 14:00:00'
  },
  {
    id: 2,
    activity: "学院校运会",
    state: 1,
    time: '2022-11-29 08:00:00'
  }
];


export default class manage extends React.Component {

  colitems = [
    { label: '全部', children: 'Content of Tab ALL', key: '0' },
    { label: '进行中', children: 'Content of Tab 1', key: '1' },
    { label: '已完成', children: 'Content of Tab 2', key: '2' },
    {
      label: '已过期',
      children: 'Content of Tab 3',
      key: '3',
      closable: false,
    },
  ];


  state = {
    tableData: data,
    tableLoading: false,
    modalVisible: false,
    confirmLoading: false
  };

  formIns: any;

  columns: ColumnsType<ActiRecord> = [
    {
      title: 'Id',
      dataIndex: 'id'
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      width: '40%',
      ellipsis: true
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: (text: string) => {
        switch (+text) {
          case 0:
            return 'Pending';
          case 1:
            return 'Finished';
          case 2:
            return 'Expired';
        }
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: (text: string) => {
        return formateTime(text);
      }
    },
    {
      title: 'Operation',
      render: (_, record: any) => {
        let { state } = record;
        return (<>
          <Popconfirm title="Are you sure to delete this activity?"
            onConfirm={() => { }}>
            <Button type='link'>Delete</Button>
          </Popconfirm>
          {+state !== 1 ?
            <Popconfirm title="Are you sure to finish the activity?"
              onConfirm={() => { }}>
              <Button type='link'>Finish</Button>
            </Popconfirm> : null}
          {+state !== 1 ?
            <Popconfirm title="Are you sure to delay the activity?"
              onConfirm={() => { }}>
              <Button type='link'>Extend</Button>
            </Popconfirm> : null}

        </>);
      }
    },

  ];

  // close dialog and clean form content
  closeModal = () => {
    this.setState({
      modalVisible: false
    });

    this.formIns.resetFields();

  };


  submit = async () => {
    try {
      await this.formIns.validateFields();
      message.success('表单校验通过');
    } catch (_) {

    }

  };


  render() {
    let { tableData, tableLoading, modalVisible, confirmLoading } = this.state;
    return (
      <div className='acti-box'>
        {/*header*/}
        <div className='header'>
          <h2 className='title'>我的活动</h2>
          <Button type="primary" onClick={() => {
            this.setState({
              modalVisible: true
            });
          }}>创建新活动</Button>
        </div>
        {/*tag*/}
        <Tabs className="tag-box" type='card' items={this.colitems} />
        {/*table*/}
        <Table<ActiRecord> dataSource={tableData}
          columns={this.columns}
          loading={tableLoading}
          pagination={false}
          rowKey="id" />

        {/* dialog & form */}
        <Modal title="新活动" open={modalVisible} confirmLoading={confirmLoading} keyboard={false} maskClosable={false}
          okText="提交" onCancel={this.closeModal} cancelText="取消">
          <Form ref={x => this.formIns = x}
            layout='horizontal' initialValues={{
              title: '',
              description: '',
              time: ''
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
            <Form.Item label="活动日期" name="date" validateTrigger='onBlur'
              rules={[
                { required: true, message: "活动日期是必填项" },
              ]}>
              <DatePicker showTime></DatePicker>
            </Form.Item>
          </Form>

        </Modal>
      </div>
    );

  }
};
