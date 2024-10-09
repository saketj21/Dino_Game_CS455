export async function fetchScores() {
    const response = await fetch('/api/scores');
    const scores = await response.json();
    return scores;
  }
  
  export async function sendScore(score, name) {
    await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score, name })
    });
  }
  