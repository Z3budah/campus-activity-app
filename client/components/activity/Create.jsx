import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Select, Upload, message, Modal } from 'antd';
import dayjs from 'dayjs';
/* request */
import { newActivity, deletePicture, updateActivity } from '../../api/activities';
/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';

import { useRouter } from 'next/router';

import './manage.less'

const Create = function create(props) {
  let { queryAllList } = props;

  let [formIns] = Form.useForm();

  const router = useRouter();

  const [fileList, setFileList] = useState([]);

  const { activity, id } = props;
  useEffect(() => {

    if (activity) {
      const { title, description, time, location, actype, score, capacity } = activity;
      formIns.setFieldsValue({
        title,
        description,
        time: dayjs(time.start, "YYYY-MM-DDTHH:mm:ss"),
        location: location.text,
        actype,
        score,
        capacity,
      });

      if (activity.pictures) {
        const pics = activity.pictures.map((url, index) => ({
          uid: index.toString(),
          name: url.split('/').pop(),
          status: 'done',
          url: `https://campus-activity.dev/api/activities${url}`
        }));
        setFileList(pics);
      }

    }

  }, [activity])

  const beforeUpload = (file) => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 2;
    if (!isLt5M) {
      message.error('图片大小不能超过 2MB！');
      return Upload.LIST_IGNORE;
    }
    const isDuplicate = fileList.some(item => item.name === file.name);
    if (isDuplicate) {
      console.log('文件已存在');
      return Upload.LIST_IGNORE;
    }
    return true;
  }

  /*============================================picture upload ============================================ */
  const optimizeFileList = (data, fileList) => {
    const { name, url: serverUrl } = data;
    const file = fileList.pop();
    const { uid, url, originFileObj } = file;
    const newFile = { uid, name, url, serverUrl, originFileObj };
    fileList.push(newFile);
  }
  const onChange = ({ file, fileList }) => {
    console.log(file);
    const { status, response } = file;
    if (status === 'done') {
      const { ok, message: msg, data } = response;
      if (ok) {
        optimizeFileList(data, fileList);
        message.success(msg)
      } else {
        message.error(msg)
      }
    }
    // fileList must be set everytime onChange emitted,
    // or status of file will be stuck in 'uploading'
    setFileList(fileList);
  };

  const onRemove = async (file) => {
    const { name, serverUrl } = file;
    if (serverUrl) {
      try {
        const response = await deletePicture(name);
        console.log(response);
        const { ok, message: msg } = response.data;
        if (ok) {
          message.success(msg);
          return true;
        } else {
          message.error(msg);
          return false
        }
      }
      catch (err) {
        message.error(msg);
        return false
      }
    }
  }

  // const onPreview = async (file) => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };

  const [previewVisible, setPreviewVisible] = useState(false),
    [previewImage, setPreviewImage] = useState(''),
    [previewImageName, setPreviewImageName] = useState('');
  const showPreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewImageName(file.name);
    setPreviewVisible(true);
  };
  const hidePreview = () => {
    setPreviewVisible(false);
  };
  /* ==================================================end================================================== */

  /* submit new activity*/
  const submit = async () => {
    try {
      await formIns.validateFields();
      let data = formIns.getFieldsValue();
      data.time = {
        start: data.time.format('YYYY-MM-DDTHH:mm:ss'),
        end: null,
      }
      data.pictures = data.pictures.fileList.map(file => file.serverUrl);
      data.location = { text: data.location }
      try {
        console.log(data);
        if (id) {
          data.version = data.version + 1;
          const response = await updateActivity({ ...data, state: 0 }, id);
          message.success(response.data.title + "活动已修改成功");
        } else {
          const response = await newActivity({ ...data, state: 0 });
          message.success(response.data.title + "活动已创建成功");
        }
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

  /* fill test data */
  const fill = () => {
    formIns.setFieldsValue({
      title: "预填充数据",
      description: "三院联合主办「金秋展艺 码上生花」迎新晚会,在这场热火朝天的晚会里,三个学院的同学为新生们带来了赏心悦目的艺术表演。",
      time: dayjs(new Date()),
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
        <h2 className='title'>{id ? "创建活动" : "新建活动"}</h2>
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
        <Form.Item label="活动图片" name="pictures">
          <Upload
            action="/api/activities/upload"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onRemove={onRemove}
            beforeUpload={beforeUpload}
            onPreview={showPreview}
            accept="image/jpeg,image/png"
            maxCount={3}
            maxFileSize={2 * 1024 * 1024}
          >
            {fileList.length <= 3 && '+ Upload'}
          </Upload>
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
          {(!id) && <Button type="link" htmlType="button" onClick={fill}>
            填充预置值
          </Button>}
        </Form.Item>
      </Form>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={hidePreview}
      >
        <img
          src={previewImage}
          alt={previewImageName}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  )
}

export default connect(
  state => state.acti,
  action.acti
)(Create);