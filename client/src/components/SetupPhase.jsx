import { Button, Container, Card, Row, Col } from 'react-bootstrap';
import { PlayCircleFill } from 'react-bootstrap-icons';
import mapImage from '../assets/map.png';

function SetupPhase({ onStart }) {
  return (
    <Container>
      <Card className='shadow-sm'>
        <Card.Header className='bg-dark text-white'>
          <h4 className='mb-0'>Network Map</h4>
        </Card.Header>
        <Card.Body className='text-center'>
          <img
            src={mapImage}
            alt='Metro network map'
            className='img-fluid mb-4'
            style={{ maxWidth: '700px' }}
          />
          <Row className='justify-content-center'>
            <Col xs='auto'>
              <Button variant='dark' size='lg' onClick={onStart}>
                <PlayCircleFill className='me-2' />I'm ready — Start planning!
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SetupPhase;