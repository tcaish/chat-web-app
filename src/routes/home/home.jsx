import { Col, Row } from 'react-bootstrap';
import MessageList from '../../components/message-list/message-list';
import MessageView from '../../components/message-view/message-view';
import './home.scss';

function Home() {
  return (
    <div className="home-container">
      <Row>
        <Col lg={4}>
          <MessageList />
        </Col>
        <Col>
          <MessageView />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
