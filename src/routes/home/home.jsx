import { Col, Row } from 'react-bootstrap';
import MessageList from '../../components/message-list/message-list';
import './home.scss';

function Home() {
  return (
    <div className="home-container">
      <Row>
        <Col lg={4}>
          <MessageList />
        </Col>
        <Col>
          <div className="card-background">Messsage</div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
