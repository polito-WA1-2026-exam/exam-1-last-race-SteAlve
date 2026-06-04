import { useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import SetupPhase from './SetupPhase.jsx';
import PlanningPhase from './PlanningPhase.jsx';
import ExecutionPhase from './ExecutionPhase.jsx';
import ResultPhase from './ResultPhase.jsx';
import { startGame, getSegments, submitRoute } from '../api/api.js';

function GamePage() {
  const [phase, setPhase] = useState('setup');
  const [game, setGame] = useState(null);
  const [segments, setSegments] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const [gameData, segs] = await Promise.all([startGame(), getSegments()]);
      setGame(gameData);
      setSegments(segs);
      setPhase('planning');
    } catch {
      setError('Could not start the game. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (route) => {
    setLoading(true);
    try {
      const res = await submitRoute(game.id, route);
      setResult(res);
      setPhase(res.valid ? 'execution' : 'result');
    } catch {
      setError('Could not submit route. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setPhase('setup');
    setGame(null);
    setSegments([]);
    setResult(null);
    setError('');
  };

  if (loading) return (
    <Container className='text-center mt-5'>
      <Spinner animation='border' variant='dark' />
    </Container>
  );

  return (
    <Container>
      {error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert>}
      {phase === 'setup'     && <SetupPhase onStart={handleStart} />}
      {phase === 'planning'  && <PlanningPhase game={game} segments={segments} onSubmit={handleSubmit} />}
      {phase === 'execution' && <ExecutionPhase result={result} onDone={() => setPhase('result')} />}
      {phase === 'result'    && <ResultPhase result={result} onPlayAgain={handlePlayAgain} />}
    </Container>
  );
}

export default GamePage;