import { useState } from 'react';
import { Button, Container, Badge, Card, ProgressBar, Stack } from 'react-bootstrap';
import { ArrowRight, ChevronRight, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

function ExecutionPhase({ result, onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = result.steps[currentStep];
  const isLast = currentStep === result.steps.length - 1;
  const effectVariant = step.effect > 0 ? 'success' : step.effect < 0 ? 'danger' : 'secondary';

  return (
    <Container fluid>
      <Card className='shadow-sm'>
        <Card.Header className='bg-dark text-white'>
          <Stack direction='horizontal' className='justify-content-between'>
            <span>Execution</span>
            <small>Step {currentStep + 1} / {result.steps.length}</small>
          </Stack>
        </Card.Header>
        <Card.Body>
          <ProgressBar
            now={currentStep + 1}
            max={result.steps.length}
            variant='dark'
            className='mb-4'
          />

          <Card.Title>
            {step.from} <ArrowRight className='mx-1' /> {step.to}
          </Card.Title>

          <Card className={`border-${effectVariant} mb-3`}>
            <Card.Body>
              <em>"{step.event}"</em>
              <div className='mt-2'>
                <Badge bg={effectVariant}>
                  {step.effect > 0 ? '+' : ''}{step.effect} coins
                </Badge>
              </div>
            </Card.Body>
          </Card>

          <Stack direction='horizontal' className='justify-content-between align-items-center'>
            <span>Coins: <Badge bg='dark' className='fs-6'>{step.coinsAfter}</Badge></span>
            {isLast
              ? <Button variant='dark' onClick={onDone}>See final result <ChevronRight /></Button>
              : <Button variant='dark' onClick={() => setCurrentStep(s => s + 1)}>Next <ChevronRight /></Button>
            }
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ExecutionPhase;