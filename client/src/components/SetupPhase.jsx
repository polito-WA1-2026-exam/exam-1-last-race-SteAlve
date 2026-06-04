import { Button } from 'react-bootstrap';
import { PlayCircleFill } from 'react-bootstrap-icons';
import mapImage from '../assets/map.png';

function SetupPhase({ onStart }) {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center setup-wrapper'>
      <h4 className='mb-3 setup-title'>Network Map</h4>
      <img
        src={mapImage}
        alt='Metro network map'
        className='img-fluid mb-4 setup-map'
      />
      <Button variant='dark' size='lg' onClick={onStart}>
        <PlayCircleFill className='me-2' />I'm ready — Start planning!
      </Button>
    </div>
  );
}

export default SetupPhase;