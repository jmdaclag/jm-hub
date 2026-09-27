// --- 1. SCHEDULE MODULE ---
let scheduleData = [
  { id: 1, name: "Mathematics 101", day: "Monday", start: "09:00", end: "10:30" },
  { id: 2, name: "Physics Lab", day: "Wednesday", start: "11:00", end: "13:00" },
  { id: 3, name: "English Literature", day: "Friday", start: "14:00", end: "15:30" }
];

function renderSchedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const grid = document.getElementById("scheduleGrid");
  grid.innerHTML = "";

  days.forEach(day => {
    const dayCol = document.createElement("div");
    dayCol.className = "day-column";
    
    let itemsHTML = `<div class="day-header">${day}</div>`;
    const dayClasses = scheduleData.filter(c => c.day === day);

    dayClasses.forEach(c => {
      itemsHTML += `
        <div class="class-item">
          <strong>${c.name}</strong><br>
          <small><i class="fa-regular fa-clock"></i> ${c.start} - ${c.end}</small>
        </div>
      `;
    });

    dayCol.innerHTML = itemsHTML;
    grid.appendChild(dayCol);
  });
}

function openScheduleModal() {
  document.getElementById("scheduleModal").style.display = "flex";
}

function closeScheduleModal() {
  document.getElementById("scheduleModal").style.display = "none";
}

function saveScheduleClass() {
  const name = document.getElementById("className").value;
  const day = document.getElementById("classDay").value;
  const start = document.getElementById("classStart").value;
  const end = document.getElementById("classEnd").value;

  if (name) {
    scheduleData.push({ id: Date.now(), name, day, start, end });
    renderSchedule();
    closeScheduleModal();
    document.getElementById("className").value = "";
  }
}

// --- 2. AI HUMANIZER MODULE ---
const buzzwords = ["delve", "pivotal", "testament", "multifaceted", "in conclusion", "furthermore", "it is imperative"];

function processHumanizer() {
  const input = document.getElementById("humanizerInput").value;
  if (!input) return;

  let output = input;
  let wordCount = input.split(/\s+/).length;
  let matches = 0;

  buzzwords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(output)) {
      matches++;
      output = output.replace(regex, "clearly");
    }
  });

  // Calculate simulated AI score
  let aiScore = Math.min(100, Math.round((matches / (wordCount || 1)) * 300));
  
  document.getElementById("humanizerOutput").innerText = output;
  document.getElementById("aiScore").innerText = `${aiScore}%`;
  document.getElementById("readabilityGrade").innerText = "Grade 9 (Human Pass)";
}

// --- 3. SALES SPIKE CHART MODULE ---
let salesChartInstance = null;

function initSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  
  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      datasets: [
        {
          label: 'Hourly Sales Spike Rate',
          data: [12, 19, 45, 120, 85, 30, 20], // 14:00 Spike
          borderColor: '#1b1b3a',
          backgroundColor: 'rgba(75, 227, 172, 0.3)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function updateSalesChart(category) {
  let newData = [12, 19, 45, 120, 85, 30, 20];
  if (category === 'apparel') newData = [5, 10, 80, 150, 40, 20, 10];
  if (category === 'tech') newData = [20, 30, 25, 40, 110, 90, 50];

  salesChartInstance.data.datasets[0].data = newData;
  salesChartInstance.update();

  document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// --- 4. PDF / TEXT QUIZ ENGINE ---
let quizQuestions = [];
let currentQuestionIdx = 0;
let xpPoints = 0;
let streak = 0;

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type === "application/pdf") {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(pdf => {
        pdf.getPage(1).then(page => {
          page.getTextContent().then(textContent => {
            const text = textContent.items.map(item => item.str).join(' ');
            generateQuestionsFromText(text);
          });
        });
      });
    };
    fileReader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = function(evt) {
      generateQuestionsFromText(evt.target.result);
    };
    reader.readAsText(file);
  }
}

function generateQuestionsFromText(text) {
  // Simple pattern parsing to build quiz options locally
  const sentences = text.split('.').filter(s => s.trim().length > 20);
  quizQuestions = sentences.slice(0, 5).map((sentence, index) => {
    return {
      question: `What primary concept is discussed in statement #${index + 1}?`,
      options: [
        sentence.trim(),
        "Unrelated baseline distraction option A",
        "Alternative theoretical concept B",
        "Secondary non-relevant detail C"
      ],
      correct: 0
    };
  });

  if (quizQuestions.length > 0) {
    document.getElementById('dropZone').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    currentQuestionIdx = 0;
    renderQuestion();
  }
}

function renderQuestion() {
  const q = quizQuestions[currentQuestionIdx];
  document.getElementById('quizProgress').innerText = `Question ${currentQuestionIdx + 1} of ${quizQuestions.length}`;
  document.getElementById('quizQuestion').innerText = q.question;
  
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => selectOption(btn, idx, q.correct);
    optionsDiv.appendChild(btn);
  });
}

function selectOption(btn, selectedIdx, correctIdx) {
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (selectedIdx === correctIdx) {
    btn.classList.add('correct');
    xpPoints += 50;
    streak += 1;
  } else {
    btn.classList.add('incorrect');
    allBtns[correctIdx].classList.add('correct');
    streak = 0;
  }

  document.getElementById('xpDisplay').innerText = xpPoints;
  document.getElementById('streakCount').innerText = streak;
  document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestionIdx++;
  if (currentQuestionIdx < quizQuestions.length) {
    renderQuestion();
  } else {
    document.getElementById('quizContainer').innerHTML = `<h3>🎉 Quiz Completed!</h3><p>You earned <strong>${xpPoints} XP</strong>!</p>`;
  }
}

// Initialize components on load
window.onload = () => {
  renderSchedule();
  initSalesChart();
};