import { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import MessageList from '../../components/message-list/message-list';
import MessageView from '../../components/message-view/message-view';
import {
  selectScreenWidth,
  setScreenWidth
} from '../../redux/slices/screenSlice';
import './home.scss';
import './home.mobile.scss';
import { useDispatch, useSelector } from 'react-redux';

function Home() {
  const dispatch = useDispatch();

  const screenWidth = useSelector(selectScreenWidth);

  const [activeKey, setActiveKey] = useState('-1');

  useEffect(() => {
    window.onresize = () => {
      dispatch(setScreenWidth(window.innerWidth));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home-container">
      {screenWidth > 991 ? (
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
            <Accordion.Item eventKey="0">
              <Accordion.Header
                onClick={() => setActiveKey(activeKey === '0' ? '-1' : '0')}
              >
                My Conversations
              </Accordion.Header>
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
