import { NextPage } from "next";
import { Button, Modal, Table, Input, Spin } from "antd";
import 'antd/dist/reset.css';
import { useState, useRef, useEffect } from "react";
import styles from "../../styles/ListJobs.module.scss";
import * as Api from "../../api";
import React from "react";
import { InboxItem } from "../../api/dto/add-inbox-list.dto";
import { DeleteFilled, RetweetOutlined } from '@ant-design/icons';
import { stateType } from "../../constans";
import { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";

const InboxListJobsPage: NextPage<InboxItem[]> = () => {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [activeItem, setActiveItem] = useState<InboxItem | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<InboxItem['id'] | null>(null);
  const [selectedText, setSelectedText] = useState<stateType['string']>("");
  const [isModalVisible, setIsModalVisible] = useState<stateType['boolean']>(false);
  const [isEditing, setIsEditing] = useState<stateType['boolean']>(false);
  const [editedText, setEditedText] = useState<stateType['string']>("");
  const [urlInput, setUrlInput] = useState<stateType['string']>("");
  const [isListOpen, setIsListOpen] = useState<stateType['boolean']>(false);
  const handleTabItemRowFocus = (record: InboxItem) => setActiveItem(record);

  const sortByDateDescending = (a: any, b: any): number => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA > dateB
      ? -1
      : dateA < dateB
        ? 1
        : 0;  
}

  const getListInboxJobs = async () => {
    try {
      const response = await Api.inbox.getAllInbox();
      const reversedData = response.sort(sortByDateDescending);
      setInboxItems(reversedData);
      setIsListOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addUrlToInbox = async () => {
    try {
      await Api.inbox.setUrlToInbox(urlInput);
      setUrlInput("");
      await getListInboxJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const addAIAunswerToPost = async (answer: string, isAnswer: boolean = false) => {
    if (!activeItem?.id) return;
    activeItem.answer = answer;
    try {
      console.log('!!!!! *****addAIAunswerToPost******* activeItem >>>>>>>>', activeItem)
      await Api.inbox.setGenerationAIAnswer(activeItem?.id, 'Що таке Nest.js та його особливості?')
      await getListInboxJobs();
      console.log('addAIAunswerToPost --- inboxItems >>>>>>>>', inboxItems)
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnRemoveOneItem = async () => {
    if (!activeItem?.id) return;
    try {
      const response = await Api.inbox.removeOnePostById(activeItem?.id)
      await getListInboxJobs();
      console.log('handleOnRemoveOneItem --- inboxItems >>>>>>>>', inboxItems)
    } catch (err) {
      console.error(err);
    }
  };
  
  const hrefToBackPage = () => {
    return window.open("http://localhost:3000/dashboard", "_self");
  }

  const showFullText = (text: string, isAnswer: boolean = false) => {
    console.log('!!!!! *****showFullText******* activeItem >>>>>>>>', activeItem)
    setSelectedText(text);
    setEditedText(text);
    setIsModalVisible(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedText("");
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  const viewSplitText = (text: string) =>
    (text.split(" ").length > 10 ? (text.split(" ").map((e, i) => i < 10 ? e : '')).join(' ') + '...' : text)
  
  
  const columns = [
    {
      title: "№/id",
      dataIndex: "id",
      key: "id",
      render: (id: number) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <h4>{inboxItems.findIndex(el => el.id === id) + 1}</h4>
            </div>
            <hr />
            <span>id..{<span className={styles.renderIdIdentifBySpan}>{id}</span>}</span>
          </>
        );
      },
      responsive: ['md']
    },
    {
      title: "Logo",
      dataIndex: "srcImage",
      key: "srcImage",
      render: (srcImage: string) => (
        <div className={styles.renderTextValue} style={{margin: 0, padding: 0}}>
          <img
            src={srcImage}
            width={50}
            alt="false"
          />
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (position: string) => {
        const classNameMedia= ' ' + styles.renderTextValue;
        return (<>
          <div className={position.toLowerCase().indexOf('flutter') >= 0
            ? styles.renderFlutterPosition + classNameMedia
            : position.toLowerCase().indexOf('full-stack') >= 0
              || position.toLowerCase().indexOf('fullstack') >= 0
              || position.toLowerCase().indexOf('full stack') >= 0
              ? styles.renderFullStackPosition + classNameMedia
              : position.toLowerCase().indexOf('back-end') >= 0
                || position.toLowerCase().indexOf('backend') >= 0
                || position.toLowerCase().indexOf('back end') >= 0
                || position.toLowerCase().indexOf('node') >= 0
                || position.toLowerCase().indexOf('node.js') >= 0
                ? styles.renderBackEndPosition + classNameMedia
                : styles.renderOtherPosition + classNameMedia
          }>
          {position}
        </div>
        
      </>)},
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div className={styles.renderTextValue}>
          {status}
        </div>
      ),
      // responsive: ['md']
    },
    {
      title: "Url to job post",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a className={styles.renderTextValue} onClick={()=> window.open(url, '_blank')}>
          <span className={styles.renderSpanUrlOff}>Open Link</span>
          <span className={styles.renderSpanUrlOn}>{url}</span>
        </a>
      )
    },
    {
      title: "Text post detalis",
      dataIndex: "text",
      key: "text",
      render: (text: string) => (
        <>
          <div className={styles.renderTextValue}>
            {viewSplitText(text)}
          </div>
          <Button type="link" onClick={() => showFullText(text)}>
            Показати повний текст
          </Button>
          <Modal
            width={1000}
            title="Повний текст"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              isEditing ? (
                <>
                  <Button key="cancel" onClick={handleCancelClick}>
                    Скасувати
                  </Button>
                  <Button key="save" type="primary" onClick={handleSaveClick}>
                    Зберегти
                  </Button>
                </>
              ) : (
                <Button key="edit" onClick={handleEditClick}>
                  Редагувати
                </Button>
              ),
            ]}
          >
            
            {isEditing ? (
              <div style={{ height: 380, marginBottom: 180}}>
                <TextArea
                  className={styles.renderTextAreaEnter}
                  value={editedText}
                  onChange={handleTextAreaChange}
                />
              </div>
            ) : <p className={styles.renderTextView}>{selectedText}</p>
            }
            
          </Modal>
        </>
      ),
      responsive: ['md']  
    },
    {
      title: "Answer to Aplly",
      dataIndex: "answer",
      key: "answer",
      responsive: ['sm'] ,
      render: (answer: string) =>
        <div className={styles.renderTextValue}>
          { answer?.length <= 0 || answer === 'load-api'
            ? (<><Button
                type="link"
                onClick={() => addAIAunswerToPost('load-api', true)}
                disabled={answer === 'load-api'}
              >
              {answer === 'load-api' ? <Spin /> : "Сформувати лист"}
            </Button></>)
            : (
              <>
                <div className={styles.renderTextValue}>
                  {viewSplitText(answer)}
                </div>
                <Button type="link" onClick={() => showFullText(answer, true)}>
                  Показати повний текст
                </Button>
                <Button type="primary" onClick={() => addAIAunswerToPost('load-api', true)}>
                  Перегенерувати apply повторно {<RetweetOutlined style={{margin: "2%"}} />} 
                </Button>
              </>
        )}
      </div>
    },
    {
      title: "ResurceType",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const isValidColor =
          (type === "djinni")
            ? { color: "blueviolet" }
            : (type === "robota")
              ? { color: "rgba(255, 0, 0, 0.804)" }
              : (type === "dou")
                ? { color: "green" }
                : (type === "work")
                  ? { color: "blue" }
                  : { color: "rgba(242, 197, 51, 0.8)" };
        return (
          <div className={styles.renderTextValue}>
            <h4 style={isValidColor}>{type.toUpperCase()}</h4>
          </div>
        );
      },
    },
    {
      title: " ",
      dataIndex: "remove",
      key: "remove",
      responsive: ['md'] ,
      render: () => (
        <Button
          type="dashed"
          style={{ backgroundColor: "#ffffff00" }}
          icon={<DeleteFilled width={60} />}
          onClick={handleOnRemoveOneItem}
        />
      ),
    }
  ];

  return (
    <main>
      <div className={styles.root}>
        <Button onClick={hrefToBackPage} type="link" danger>
          &#10508; Back 
        </Button>
        <h1 style={{color: "white"}}>**** Мій список APPLY на вакансії ****</h1>
      </div>
      <div className={styles.UrlConteiner}>
        <div className={styles.InputUrlBox}>
          <Input
            placeholder="Введіть URL-адресу"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button className={styles.buttonUrlPost} onClick={addUrlToInbox} type="primary">
            Додати URL
          </Button>
        </div>
      </div>
      <div>
        <Button onClick={() => getListInboxJobs()} type={isListOpen ? "default" : "primary" } block>
          Список всіх apply jobs &#10549;
        </Button>
      </div>
      
      <div style={{ overflowX: "auto"}}>
        <Table
          dataSource={inboxItems}
          columns={columns as ColumnsType<InboxItem>} 
          rowKey="id" 
          onRow={(record) => ({
            onFocus: () => handleTabItemRowFocus(record),
            onMouseEnter: () => {
              setHoveredRowId(record.id);
            },
            onMouseLeave: () => {
              setHoveredRowId(null);
            },
            style: {
              borderRadius: "10px",
              boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
              background: record.id === activeItem?.id
                ? record.type === "djinni"
                  ? 'rgba(38, 225, 172, 0.5)'
                  : 'lightblue'
                : record.id === hoveredRowId
                  ? 'rgba(220, 16, 16, 0.25)'
                  : record.type === "dou"
                    ? "rgba(38, 225, 172, 0.5)"
                    : record.type === "djinni"
                      ? 'rgba(165, 221, 62, 0.4)'
                      : 'rgba(64, 46, 187, 0.277)',
              transform: record.id === hoveredRowId ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.5s',
            },
          })}
        />
      </div>
    </main>
  );
};

export default InboxListJobsPage;
