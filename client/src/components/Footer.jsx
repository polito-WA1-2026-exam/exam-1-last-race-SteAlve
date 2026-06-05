import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid as='footer' className='text-center text-muted py-2 border-top fixed-footer'>
      <small>&copy; Web Applications I exam</small>
    </Container>
  );
}

export default Footer;