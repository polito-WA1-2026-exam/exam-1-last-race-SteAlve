import { Container, Row, Col, Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { Map, Signpost, Lightning, Award } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';

function InstructionsPage() {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h1>Last Race</h1>
          <p className='lead text-muted'>Navigate the underground network and reach your destination before time runs out!</p>
        </Col>
        <Col xs='auto'>
          <Button variant='dark' size='lg' onClick={() => navigate('/login')}>
            Login to play
          </Button>
        </Col>
      </Row>

      <Row className='g-3'>
        <Col md={6}>
          <Card className='h-100'>
            <Card.Header className='bg-dark text-white'>How to play</Card.Header>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Map className='me-2' /><strong>Setup</strong> — Study the metro map.
                </ListGroup.Item>
                <ListGroup.Item>
                  <Signpost className='me-2' /><strong>Planning</strong> — Build your route in 90 seconds.
                </ListGroup.Item>
                <ListGroup.Item>
                  <Lightning className='me-2' /><strong>Execution</strong> — Random events gain or lose coins.
                </ListGroup.Item>
                <ListGroup.Item>
                  <Award className='me-2' /><strong>Result</strong> — Your score is the coins remaining.
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className='h-100'>
            <Card.Header className='bg-dark text-white'>Rules</Card.Header>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>Each game starts with <Badge bg='warning' text='dark'>20 coins</Badge></ListGroup.Item>
                <ListGroup.Item>Change lines only at interchange stations</ListGroup.Item>
                <ListGroup.Item>Invalid route = <Badge bg='danger'>0 coins</Badge></ListGroup.Item>
                <ListGroup.Item>Negative score is stored as <Badge bg='secondary'>0</Badge></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default InstructionsPage;