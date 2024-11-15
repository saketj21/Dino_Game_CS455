/* eslint-disable max-statements */
import { fetchScores } from './scoreManager.js';

export async function displayScores(scaleRatio, canvas) {
  const leaderboardContainer = document.createElement('div');
  leaderboardContainer.id = 'leaderboardContainer';
  leaderboardContainer.style.position = 'absolute';
  leaderboardContainer.style.top = `${window.innerHeight / 2 - canvas.height / 2}px`;
  leaderboardContainer.style.left = '0';
  leaderboardContainer.style.width = `${canvas.width}px`;
  leaderboardContainer.style.height = `${canvas.height}px`;
  leaderboardContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  leaderboardContainer.style.border = '2px solid black';
  leaderboardContainer.style.padding = '20px';
  leaderboardContainer.style.zIndex = '1000';
  leaderboardContainer.style.textAlign = 'center';
  leaderboardContainer.style.fontFamily = 'Verdana, sans-serif';
  leaderboardContainer.style.fontSize = `${18 * scaleRatio}px`;
  leaderboardContainer.style.display = 'flex';
  leaderboardContainer.style.flexDirection = 'column';
  leaderboardContainer.style.justifyContent = 'center';
  leaderboardContainer.style.alignItems = 'center';
  const title = document.createElement('h2');
  title.textContent = 'Leaderboard';
  title.style.marginBottom = '5%';
  leaderboardContainer.appendChild(title);
  const leaderboardTable = document.createElement('table');
  leaderboardTable.style.margin = '0 auto';
  leaderboardTable.style.borderCollapse = 'collapse';
  leaderboardTable.style.width = '100%';
  leaderboardTable.style.height = "83%";

  // Create table headers
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Rank', 'Name', 'Score'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.border = '1px solid black';
    th.style.padding = '10px';
    th.style.backgroundColor = '#f2f2f2';
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);
  leaderboardTable.appendChild(tableHeader);

  // Create table body
  const tableBody = document.createElement('tbody');
  leaderboardTable.appendChild(tableBody);

  // Append table to container and container to the document
  leaderboardContainer.appendChild(leaderboardTable);
  document.body.appendChild(leaderboardContainer);

  try {
    // Fetch scores from the API
    const response = await fetchScores();
    console.log('Fetched scores:', response);

    // Validate the response structure
    if (response.success && Array.isArray(response.scores)) {
      const scores = response.scores; // Extract the scores array
      tableBody.innerHTML = ''; // Clear any existing content

      // Populate the table with scores
      scores.forEach((score, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        rankCell.style.border = '1px solid black';
        rankCell.style.padding = '8px';
        
        const nameCell = document.createElement('td');
        nameCell.textContent = score.name;
        nameCell.style.border = '1px solid black';
        nameCell.style.padding = '8px';
        
        const scoreCell = document.createElement('td');
        scoreCell.textContent = score.score;
        scoreCell.style.border = '1px solid black';
        scoreCell.style.padding = '8px';

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
      });
    } else {
      // Handle cases where the response structure is unexpected
      console.error('Invalid scores data:', response);
      tableBody.innerHTML = '<tr><td colspan="3">No scores available</td></tr>';
    }
  } catch (error) {
    // Handle fetch or processing errors
    console.error('Error fetching scores:', error);
    tableBody.innerHTML = '<tr><td colspan="3">Failed to load scores</td></tr>';
  }
}