import { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import MessageList from '../../components/message-list/message-list';
import MessageView from '../../components/message-view/message-view';
import './home.scss';
import './home.mobile.scss';

function Home() {
  const [screenSize, setScreenSize] = useState(0);
  const [activeKey, setActiveKey] = useState('-1');

  useEffect(() => {
    window.onresize = () => {
      setScreenSize(window.innerWidth);
    };
  }, []);

  return (
    <div className="home-container">
      {screenSize > 991 ? (
        <Row>
          <Col lg={4}>
            <MessageList />
          </Col>
          <Col>
            <MessageView />
          </Col>
        </Row>
      ) : (
        <>
          <Accordion className="home-accordion" activeKey={activeKey}>
            <Accordion.Item
              eventKey="0"
              onClick={() => setActiveKey(activeKey === '0' ? '-1' : '0')}
            >
              <Accordion.Header>My Conversations</Accordion.Header>
              <Accordion.Body>
                <MessageList setActiveKey={setActiveKey} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <MessageView />
        </>
      )}
    </div>
  );
}

export default Home;
