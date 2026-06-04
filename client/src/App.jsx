import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import InstructionsPage from './components/InstructionsPage.jsx';
import GamePage from './components/GamePage.jsx';
import LeaderboardPage from './components/LeaderboardPage.jsx';

import UserContext from './contexts/UserContext.js';
import { checkSession } from './api/auth.js';

function App() {

  const navigate = useNavigate();

  // STATE AND HANDLERS RELATED TO CURRENTLY LOGGED USER
  const [user, setUser] = useState({ id: undefined, username: undefined, name: undefined });

  // try to restore the login session
  useEffect(() => {
    checkSession().then(result => {
      if (result) {
        setUser({ id: result.id, username: result.username, name: result.name });
      }
    });
  }, []);

  // Login action handler
  const doLogin = (newUser) => {
    setUser({ id: newUser.id, username: newUser.username, name: newUser.name });
    navigate('/game');
  };

  return (
    <UserContext.Provider value={user}>
      <Container fluid className='px-0'>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={doLogin} />}>
            <Route index element={<InstructionsView />} />
            <Route path='login' element={<LoginForm doLogin={doLogin} />} />
            <Route path='logout' element={<Logout doLogin={doLogin} />} />
            <Route path='game' element={<GameView />} />
            <Route path='leaderboard' element={<LeaderboardView />} />
          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  );
}

function MainLayout(props) {
  return <>
    <Header doLogin={props.doLogin} />
    <Outlet />
    <Footer />
  </>;
}

function InstructionsView() {
  const user = useContext(UserContext);
  if (user.id) return <Navigate to='/game' />;
  return <InstructionsPage />;
}

function GameView() {
  const user = useContext(UserContext);
  if (!user.id) return <Navigate to='/' />;
  return <GamePage />;
}

function LeaderboardView() {
  const user = useContext(UserContext);
  if (!user.id) return <Navigate to='/' />;
  return <LeaderboardPage />;
}

export default App;