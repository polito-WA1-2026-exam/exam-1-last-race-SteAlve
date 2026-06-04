import { useContext } from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { BusFront, Trophy, BoxArrowRight } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router';
import UserContext from '../contexts/UserContext.js';

function Header() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Navbar bg='dark' variant='dark' className='mb-4'>
      <Container fluid>
        <Navbar.Brand as={Link} to='/'><BusFront className='me-2' />Last Race</Navbar.Brand>
        <Nav className='ms-auto align-items-center gap-2'>
          {user?.id ? (
            <>
              <Navbar.Text>
                Hello, <Badge bg='secondary'>{user.name}</Badge>
              </Navbar.Text>
              <Nav.Link as={Link} to='/leaderboard'>
                <Trophy className='me-1' />Leaderboard
              </Nav.Link>
              <Button variant='outline-light' size='sm' onClick={() => navigate('/logout')}>
                <BoxArrowRight className='me-1' />Logout
              </Button>
            </>
          ) : (
            <Button variant='outline-light' size='sm' onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;