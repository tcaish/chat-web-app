import { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import MessageList from '../../components/message-list/message-list';
import MessageView from '../../components/message-view/message-view';
import './home.scss';
import './home.mobile.scss';

function Home() {
  const [screenSize, setScreenSize] = useState(0);

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
          <Accordion className="home-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>My Conversations</Accordion.Header>
              <Accordion.Body>
                <MessageList />
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
