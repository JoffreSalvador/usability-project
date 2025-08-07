

document.addEventListener('DOMContentLoaded', function () {
  
  firebase.auth().onAuthStateChanged(async function(user) {
    if (!user) {
      document.getElementById('welcome-title').innerText = "Welcome!";
      document.getElementById('welcome-desc').innerText = "Please log in to see your achievements.";
      document.getElementById('score-total').innerText = "0";
      document.getElementById('streak').innerText = "0";
      document.getElementById('progress-list').innerHTML = `<div class="progress-item"><span>No progress yet.</span></div>`;
      document.getElementById('achievements-list').innerHTML = `<li>No achievements yet. Start playing to unlock achievements!</li>`;
      return;
    }

    
    const db = firebase.firestore();
    const docRef = db.collection("user").doc(user.uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      document.getElementById('welcome-title').innerText = "Welcome!";
      document.getElementById('welcome-desc').innerText = "No user data found in database.";
      document.getElementById('score-total').innerText = "0";
      document.getElementById('streak').innerText = "0";
      document.getElementById('progress-list').innerHTML = `<div class="progress-item"><span>No progress yet.</span></div>`;
      document.getElementById('achievements-list').innerHTML = `<li>No achievements yet. Start playing to unlock achievements!</li>`;
      return;
    }

    const userData = doc.data();
    const totalScore = (userData.game1_score || 0) + (userData.game2_score || 0) + (userData.game3_score || 0);

    const games = [
      { name: "Listening Game", score: userData.game1_score, max: 10 },
      { name: "Reading Game", score: userData.game2_score, max: 10 },
      { name: "Video Game", score: userData.game3_score, max: 10 }
    ];

    let achievements = [];
    if (games.some(g => g.score > 0)) achievements.push("🏅 First game played");
    if (games.some(g => g.score === 10)) achievements.push("🎯 Perfect score in a game");
    if (games.every(g => g.score > 0)) achievements.push("🏆 All games completed");
    if (totalScore >= 25) achievements.push("⭐ Over 25 total points");

    document.getElementById('welcome-title').innerText = `Welcome back, ${userData.name || ""} ${userData.last_name || ""}! 👋`;
    document.getElementById('welcome-desc').innerText = `Ready to continue your learning journey?`;
    document.getElementById('score-total').innerText = totalScore;
    document.getElementById('streak').innerText = "7";

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
});
