document.addEventListener('DOMContentLoaded', () => {
    let chartInstances = { radar: null, bar: null };
    
    const questions = [
        { id: 1, text: "When difficulties emerge in our organization, this leader is good at stepping back and assessing the dynamics of the people involved." },
        { id: 2, text: "When events trigger strong emotional responses among employees, this leader uses their authority as a leader to resolve the problem." },
        { id: 3, text: "When people feel uncertain about organizational change, they trust that this leader will help them work through the difficulties." },
        { id: 4, text: "In complex situations, this leader gets people to focus on the issues they are trying to avoid." },
        { id: 5, text: "When employees are struggling with a decision, this leader tells them what they think they should do." },
        { id: 6, text: "During times of difficult change, this leader welcomes the thoughts of group members with low status." },
        { id: 7, text: "In difficult situations, this leader sometimes loses sight of the \"big picture.\"" },
        { id: 8, text: "When people are struggling with value questions, this leader reminds them to follow the organization's policies." },
        { id: 9, text: "When people begin to be disturbed by unresolved conflicts, this leader encourages them to address the issues." },
        { id: 10, text: "During organizational change, this leader challenges people to concentrate on the \"hot\" topics." },
        { id: 11, text: "When employees look to this leader for answers, they encourage them to think for themselves." },
        { id: 12, text: "Listening to group members with radical ideas is valuable to this leader." },
        { id: 13, text: "When this leader disagrees with someone, they have difficulty listening to what the person is really saying." },
        { id: 14, text: "When others are struggling with intense conflicts, this leader steps in to resolve the differences." },
        { id: 15, text: "This leader has the emotional capacity to comfort others as they work through intense issues." },
        { id: 16, text: "When people try to avoid controversial organizational issues, this leader brings these conflicts into the open." },
        { id: 17, text: "This leader encourages their employees to take initiative in defining and solving problems." },
        { id: 18, text: "This leader is open to people who bring up unusual ideas that seem to hinder the progress of the group." },
        { id: 19, text: "In challenging situations, this leader likes to observe the parties involved and assess what's really going on." },
        { id: 20, text: "This leader encourages people to discuss the \"elephant in the room.\"" },
        { id: 21, text: "People recognize that this leader has confidence to tackle challenging problems." },
        { id: 22, text: "This leader thinks it is reasonable to let people avoid confronting difficult issues." },
        { id: 23, text: "When people look to this leader to solve problems, they enjoy providing solutions." },
        { id: 24, text: "This leader has an open ear for people who don't seem to fit in with the rest of the group." },
        { id: 25, text: "In a difficult situation, this leader will step out of the dispute to gain perspective on it." },
        { id: 26, text: "This leader thrives on helping people find new ways of coping with organizational problems." },
        { id: 27, text: "People see this leader as someone who holds steady in the storm." },
        { id: 28, text: "In an effort to keep things moving forward, this leader lets people avoid issues that are troublesome." },
        { id: 29, text: "When people are uncertain about what to do, this leader empowers them to decide for themselves." },
        { id: 30, text: "To restore equilibrium in the organization, this leader tries to neutralize comments of out-group members." }
    ];

    const leadershipForm = document.getElementById('leadershipForm');
    const resultDiv = document.querySelector('.result');
    const scoreBreakdownDiv = document.getElementById('score-breakdown');
    const questionsDiv = document.getElementById('questions');

    function renderQuestions() {
        let questionsHTML = '';
        questions.forEach(q => {
            questionsHTML += `
                <div class="question">
                    <label><strong>${q.id}.</strong> ${q.text}</label>
                    <div class="radio-group">
                        ${[1, 2, 3, 4, 5].map(i => {
                            const inputId = `q${q.id}o${i}`;
                            return `
                                <label for="${inputId}">
                                    <input type="radio" id="${inputId}" name="q${q.id}" value="${i}" required>
                                    <span>${i}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        questionsDiv.innerHTML = questionsHTML;
    }

    leadershipForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (!leadershipForm.checkValidity()) {
            alert("Please answer all questions before submitting.");
            return;
        }
        
        const scores = calculateScores();
        displayResults(scores);
    });

    function reverseScore(score) {
        const reverseMap = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 };
        return reverseMap[score];
    }

    function calculateScores() {
        const formData = new FormData(leadershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        const scores = {
            'Get on the Balcony': 
                answers.q1 + 
                reverseScore(answers.q7) + 
                reverseScore(answers.q13) + 
                answers.q19 + 
                answers.q25,
            
            'Identify the Adaptive Challenge': 
                reverseScore(answers.q2) + 
                reverseScore(answers.q8) + 
                reverseScore(answers.q14) + 
                answers.q20 + 
                answers.q26,
            
            'Regulate Distress': 
                answers.q3 + 
                answers.q9 + 
                answers.q15 + 
                answers.q21 + 
                answers.q27,
            
            'Maintain Disciplined Attention': 
                answers.q4 + 
                answers.q10 + 
                answers.q16 + 
                reverseScore(answers.q22) + 
                reverseScore(answers.q28),
            
            'Give the Work Back to the People': 
                reverseScore(answers.q5) + 
                answers.q11 + 
                answers.q17 + 
                reverseScore(answers.q23) + 
                answers.q29,
            
            'Protect Leadership Voices From Below': 
                answers.q6 + 
                answers.q12 + 
                answers.q18 + 
                answers.q24 + 
                reverseScore(answers.q30)
        };

        return scores;
    }

    function getScoreInterpretation(score) {
        if (score >= 21) return 'High range';
        if (score >= 16) return 'Moderately high range';
        if (score >= 11) return 'Moderate low range';
        return 'Low range';
    }

    function getScoreColor(score) {
        if (score >= 21) return '#48bb78';
        if (score >= 16) return '#4299e1';
        if (score >= 11) return '#f6e05e';
        return '#f56565';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        let breakdownHTML = '';
        for (const [key, value] of Object.entries(scores)) {
            const interpretation = getScoreInterpretation(value);
            const color = getScoreColor(value);
            breakdownHTML += `<div class="score-line" style="border-left-color: ${color}"><strong>${key}:</strong> ${value} / 25 (${interpretation})</div>`;
        }
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderCharts(scores);
        setupChartTabs();
        showInterpretation(scores);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderCharts(scores) {
        if (chartInstances.radar) chartInstances.radar.destroy();
        if (chartInstances.bar) chartInstances.bar.destroy();

        const shortLabels = {
            'Get on the Balcony': 'Get on Balcony',
            'Identify the Adaptive Challenge': 'Identify Challenge',
            'Regulate Distress': 'Regulate Distress',
            'Maintain Disciplined Attention': 'Disciplined Attention',
            'Give the Work Back to the People': 'Give Work Back',
            'Protect Leadership Voices From Below': 'Protect Voices'
        };

        const labels = Object.keys(scores).map(key => shortLabels[key]);
        const data = Object.values(scores);
        const colors = data.map(score => getScoreColor(score));

        // Radar Chart
        const radarCtx = document.getElementById('resultChart').getContext('2d');
        chartInstances.radar = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Scores',
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    borderWidth: 3,
                    pointBackgroundColor: colors,
                    pointBorderColor: '#fff',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 25,
                        ticks: { stepSize: 5 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Bar Chart
        const barCtx = document.getElementById('barChart').getContext('2d');
        chartInstances.bar = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Scores',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 25,
                        ticks: { stepSize: 5 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function setupChartTabs() {
        const tabs = document.querySelectorAll('.chart-tab');
        const views = document.querySelectorAll('.chart-view');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                views.forEach(view => view.classList.remove('active'));
                document.getElementById(`${tab.dataset.chart}-view`).classList.add('active');
            });
        });
    }

    function showInterpretation(scores) {
        const interpretationDiv = document.getElementById("interpretation");
        interpretationDiv.innerHTML = `
            <h3>Interpretation of Your Adaptive Leadership Behaviors</h3>
            <p>The scores you received indicate the degree to which you exhibit the six behaviors characteristic of adaptive leadership. You can use the results to assess areas in which you have strong adaptive leadership behaviors and areas in which you may strive to improve.</p>
            <ul>
                <li><strong>Get on the Balcony (${scores['Get on the Balcony']}/25):</strong> The ability to step back and see the big picture, observing patterns and dynamics from a distance.</li>
                <li><strong>Identify the Adaptive Challenge (${scores['Identify the Adaptive Challenge']}/25):</strong> Distinguishing between technical problems and adaptive challenges that require changes in values, beliefs, or behaviors.</li>
                <li><strong>Regulate Distress (${scores['Regulate Distress']}/25):</strong> Managing stress and maintaining equilibrium during challenging times to keep people productive.</li>
                <li><strong>Maintain Disciplined Attention (${scores['Maintain Disciplined Attention']}/25):</strong> Keeping people focused on difficult issues and preventing them from avoiding the tough work.</li>
                <li><strong>Give the Work Back to the People (${scores['Give the Work Back to the People']}/25):</strong> Empowering others to solve their own problems rather than providing easy answers.</li>
                <li><strong>Protect Leadership Voices From Below (${scores['Protect Leadership Voices From Below']}/25):</strong> Giving voice to all members, especially those with less authority or contrarian views.</li>
            </ul>
            <p>By comparing your scores, you can determine which adaptive leadership behaviors are your strengths and which may be areas for development.</p>
        `;
    }

    renderQuestions();
});
