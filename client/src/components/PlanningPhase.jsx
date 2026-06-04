import { useState, useEffect, useRef } from 'react';
import { Row, Col, ListGroup, Badge, Button, ProgressBar, Card, Stack } from 'react-bootstrap';
import { ArrowRight, ArrowLeftRight, ArrowCounterclockwise, SendFill, ClockFill } from 'react-bootstrap-icons';
import mapStationsImage from '../assets/map-stations.png';

function PlanningPhase({ game, segments, onSubmit }) {
  const [route, setRoute] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const remaining = 90 - elapsed;
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        onSubmit(route);
      } else {
        setTimeLeft(remaining);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // A segment can be added only if it hasn't been used already
  const canAdd = (seg) =>
    !route.some(([f, t]) =>
      (f === seg.fromId && t === seg.toId) || (f === seg.toId && t === seg.fromId)
    );

  const addSegment = (seg) => {
    setRoute(r => [...r, [seg.fromId, seg.toId]]);
  };

  const getStationName = (id) =>
    segments.find(s => s.fromId === id)?.fromName ??
    segments.find(s => s.toId === id)?.toName;

  const timerVariant = timeLeft > 60 ? 'success' : timeLeft > 30 ? 'warning' : 'danger';

  return (
    <div className='planning-wrapper'>
      <Row className='g-3'>
        <Col md={8} className='d-flex flex-column'>
          {/* Map floats directly on the wood table */}
          <div className='text-center mb-3'>
            <img
              src={mapStationsImage}
              alt='Station map'
              className='img-fluid planning-map'
            />
          </div>

          {/* Route card below */}
          <Card className='shadow-sm'>
            <Card.Header className='bg-dark text-white'>
              <Stack direction='horizontal' gap={3}>
                <span>From: <Badge bg='success'>{game.startStation.name}</Badge></span>
                <ArrowRight />
                <span>To: <Badge bg='danger'>{game.endStation.name}</Badge></span>
              </Stack>
            </Card.Header>
            <Card.Body>
              <Card.Title>Your route</Card.Title>
              <div className='mb-3 p-2 bg-light rounded' style={{ minHeight: '40px' }}>
                {route.length === 0
                  ? <span className='text-muted'>No segments selected yet</span>
                  : route.map(([fromId, toId], i) => (
                    <span key={i}>
                      {i > 0 && <span className='mx-2 text-muted'>|</span>}
                      <Badge bg='secondary'>{getStationName(fromId)}</Badge>
                      <ArrowRight className='mx-1 text-muted' />
                      <Badge bg='secondary'>{getStationName(toId)}</Badge>
                    </span>
                  ))
                }
              </div>

              <Stack direction='horizontal' gap={2}>
                <Button
                  variant='dark'
                  disabled={route.length < 1}
                  onClick={() => onSubmit(route)}
                >
                  <SendFill className='me-2' />Submit route
                </Button>
                {route.length > 0 &&
                  <Button variant='outline-secondary' onClick={() => setRoute(r => r.slice(0, -1))}>
                    <ArrowCounterclockwise className='me-1' />Undo
                  </Button>
                }
              </Stack>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='d-flex flex-column'>
          <Card className='shadow-sm mb-3'>
            <Card.Body>
              <Card.Title><ClockFill className='me-2' />Time left</Card.Title>
              <h3 className={`text-${timerVariant}`}>{timeLeft}s</h3>
              <ProgressBar variant={timerVariant} now={timeLeft} max={90} />
            </Card.Body>
          </Card>

          <Card className='shadow-sm flex-grow-1' style={{ minHeight: 0 }}>
            <Card.Header className='bg-dark text-white'>Segments</Card.Header>
            <ListGroup variant='flush' style={{ overflowY: 'auto', height: '100%' }}>
              {segments
                .filter(seg => canAdd(seg))
                .map((seg, i) => (
                  <ListGroup.Item
                    key={i}
                    action
                    onClick={() => addSegment(seg)}
                  >
                    {seg.fromName} <ArrowLeftRight className='mx-1' /> {seg.toName}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlanningPhase;