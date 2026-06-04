import { useState, useEffect } from 'react';
import { Table, Container, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { Trophy, Award } from 'react-bootstrap-icons';
import { getLeaderboard } from '../api/api.js';

function LeaderboardPage() {
  const [rankings, setRankings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(data => setRankings(data))
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  const medal = (i) => {
    if (i === 0) return <Award color='#B8860B' size={20} />;
    if (i === 1) return <Award color='#607080' size={20} />;
    if (i === 2) return <Award color='#8B4513' size={20} />;
    return i + 1;
  };

  return (
    <Container fluid>
      <Card className='shadow-sm'>
        <Card.Header className='bg-dark text-white'>
          <h4 className='mb-0'><Trophy className='me-2' />Leaderboard</h4>
        </Card.Header>
        <Card.Body>
          {loading && (
            <div className='text-center py-3'>
              <Spinner animation='border' variant='dark' />
            </div>
          )}
          {error && <Alert variant='danger'>{error}</Alert>}
          {!loading && rankings.length === 0 && !error && (
            <Alert variant='info'>No games played yet.</Alert>
          )}
          {rankings.length > 0 && (
            <Table hover className='mb-0'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Best Score</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, i) => (
                  <tr key={i}>
                    <td>{medal(i)}</td>
                    <td>{r.name}</td>
                    <td><Badge bg='dark'>{r.bestScore} coins</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LeaderboardPage;