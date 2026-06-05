import { Container, Button, Alert, Card, Badge, Stack } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, ArrowRepeat } from 'react-bootstrap-icons';

function ResultPhase({ result, onPlayAgain }) {
  return (
    <Container fluid className='d-flex flex-column justify-content-center' style={{ minHeight: 'calc(100vh - 110px)' }}>
      <Card className='shadow-sm text-center'>
        <Card.Header className='bg-dark text-white'>
          <h4 className='mb-0'>Result</h4>
        </Card.Header>
        <Card.Body className='py-4'>
          {result.valid
            ? <Alert variant='success'><CheckCircleFill className='me-2' />Your route was valid!</Alert>
            : <Alert variant='danger'><XCircleFill className='me-2' />Your route was invalid. You lost all your coins.</Alert>
          }

          <p className='text-muted mb-1'>Final score</p>
          <h1 className='display-3 mb-1'>
            <Badge bg='dark'>{result.finalScore}</Badge>
          </h1>
          <p className='text-muted mb-4'>coins</p>

          <Button variant='dark' size='lg' onClick={onPlayAgain}>
            <ArrowRepeat className='me-2' />Play again
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResultPhase;