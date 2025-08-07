document.addEventListener('DOMContentLoaded', async function () {
  let user = null;
  try {
    const res = await fetch('../data/users.json');
    const users = await res.json();
    user = users && users.length > 0 ? users[0] : null;

    const storedVideoGameScore = localStorage.getItem("game3_score");
    if (storedVideoGameScore !== null && user) {
      user.game3_score = parseInt(storedVideoGameScore, 10);
    }
    

    const totalScore = (user.game1_score || 0) + (user.game2_score || 0) + (user.game3_score || 0);

  } catch (e) {
    user = null;
  }

  if (!user) {

    document.getElementById('welcome-title').innerText = "Welcome!";
    document.getElementById('welcome-desc').innerText = "No user data available. Please play a game to get started!";
    document.getElementById('score-total').innerText = "0";
    document.getElementById('streak').innerText = "0";
    document.getElementById('progress-list').innerHTML = `
      <div class="progress-item">
        <span>No progress yet.</span>
      </div>`;
    document.getElementById('achievements-list').innerHTML = `
      <li>No achievements yet. Start playing to unlock achievements!</li>`;
    return;
  }

 
  const totalScore = (user.game1_score || 0) + (user.game2_score || 0) + (user.game3_score || 0);

  const games = [
    { name: "Listening Game", score: user.game1_score, max: 10 },
    { name: "Reading Game", score: user.game2_score, max: 10 },
    { name: "Video Game", score: user.game3_score, max: 10 }
  ];

  let achievements = [];
  if (games.some(g => g.score > 0)) achievements.push("🏅 First game played");
  if (games.some(g => g.score === 10)) achievements.push("🎯 Perfect score in a game");
  if (games.every(g => g.score > 0)) achievements.push("🏆 All games completed");
  if (totalScore >= 25) achievements.push("⭐ Over 25 total points");

  document.getElementById('welcome-title').innerText = `Welcome back, ${user.name} ${user.last_name}! 👋`;
  document.getElementById('welcome-desc').innerText = `Ready to continue your learning journey?`;
  document.getElementById('score-total').innerText = totalScore;
  document.getElementById('streak').innerText = 7;

  document.getElementById('progress-list').innerHTML = games.map(g => {
    const percent = Math.round((g.score / g.max) * 100);
    return `
      <div class="progress-item">
        <div style="display:flex; justify-content:space-between;">
          <span>${g.name}</span>
          <span>${percent}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('achievements-list').innerHTML =
    achievements.length
      ? achievements.map(a => `<li>${a}</li>`).join('')
      : `<li>No achievements yet. Keep playing!</li>`;
});
