import React, { useState } from 'react';
import { Modal, Input, Button, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PublishChartModal.css';

const { Option } = Select;

const modules = {
  toolbar: [
    ['bold', 'italic', 'strike'],
    [{'list': 'bullet'}],
    ['clean']
  ],
};

const formats = [
  'bold', 'italic', 'strike',
  'list', 'bullet'
];

const PublishChartModal = ({ visible, onClose }) => {
  const [editorState, setEditorState] = useState('');

  const handleEditorChange = (value) => {
    setEditorState(value);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="publish-chart-modal"
      centered
      width="100%"
      bodyStyle={{ height: '100vh', padding: 0 }}
    >
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-title">Publish script</h2>
          <Input placeholder="Enter your chart's name here" className="modal-input" />
          <div className="ql-wrapper">
            <ReactQuill
              value={editorState}
              onChange={handleEditorChange}
              modules={modules}
              formats={formats}
              className="modal-textarea"
              placeholder="Enter your chart description here"
            />
          </div>
          <Select
            placeholder="Choose at least one category"
            className="custom-select"
            dropdownStyle={{ marginBottom: '100%' }} // To give space for the dropdown to appear upwards
            placement="topLeft" // Align the dropdown to appear upwards
          >
            <Option value="category1">Category 1</Option>
            <Option value="category2">Category 2</Option>
            <Option value="category3">Category 3</Option>
          </Select>
          <Button type="primary" className="continue-button">Continue</Button>
        </div>
      </div>
    </Modal>
  );
};

export default PublishChartModal;
