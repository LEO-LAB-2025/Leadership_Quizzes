document.addEventListener('DOMContentLoaded', () => {
    let chartInstances = { radar: null, bar: null };
    
    const questions = [
        { id: 1, text: "Others would seek help from the leader if they had a personal problem." },
        { id: 2, text: "The leader emphasizes the importance of giving back to the community." },
        { id: 3, text: "The leader can tell if something work-related is going wrong." },
        { id: 4, text: "The leader gives others the responsibility to make important decisions about their own jobs." },
        { id: 5, text: "The leader makes others' career development a priority." },
        { id: 6, text: "The leader cares more about others' success than their own." },
        { id: 7, text: "The leader holds high ethical standards." },
        { id: 8, text: "The leader cares about others' personal well-being." },
        { id: 9, text: "The leader is always interested in helping people in the community." },
        { id: 10, text: "The leader is able to think through complex problems." },
        { id: 11, text: "The leader encourages others to handle important work decisions on their own." },
        { id: 12, text: "The leader is interested in making sure others reach their career goals." },
        { id: 13, text: "The leader puts others' best interests above their own." },
        { id: 14, text: "The leader is always honest." },
        { id: 15, text: "The leader takes time to talk to others on a personal level." },
        { id: 16, text: "The leader is involved in community activities." },
        { id: 17, text: "The leader has a thorough understanding of the organization and its goals." },
        { id: 18, text: "The leader gives others the freedom to handle difficult situations in the way they feel is best." },
        { id: 19, text: "The leader provides others with work experiences that enable them to develop new skills." },
        { id: 20, text: "The leader sacrifices their own interests to meet others' needs." },
        { id: 21, text: "The leader would not compromise ethical principles in order to meet success." },
        { id: 22, text: "The leader can recognize when others are feeling down without asking them." },
        { id: 23, text: "The leader encourages others to volunteer in the community." },
        { id: 24, text: "The leader can solve work problems with new or creative ideas." },
        { id: 25, text: "If others need to make important decisions at work, they do not need to consult the leader." },
        { id: 26, text: "The leader wants to know about others' career goals." },
        { id: 27, text: "The leader does what they can to make others' jobs easier." },
        { id: 28, text: "The leader values honesty more than profits." }
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
                        ${[1, 2, 3, 4, 5, 6, 7].map(i => {
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
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(leadershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        return {
            'Emotional Healing': answers.q1 + answers.q8 + answers.q15 + answers.q22,
            'Creating Value for the Community': answers.q2 + answers.q9 + answers.q16 + answers.q23,
            'Conceptual Skills': answers.q3 + answers.q10 + answers.q17 + answers.q24,
            'Empowering': answers.q4 + answers.q11 + answers.q18 + answers.q25,
            'Helping Followers Grow and Succeed': answers.q5 + answers.q12 + answers.q19 + answers.q26,
            'Putting Followers First': answers.q6 + answers.q13 + answers.q20 + answers.q27,
            'Behaving Ethically': answers.q7 + answers.q14 + answers.q21 + answers.q28
        };
    }

    function getScoreInterpretation(score) {
        if (score >= 23) return 'High range';
        if (score >= 14) return 'Moderate range';
        return 'Low range';
    }

    function getScoreColor(score) {
        if (score >= 23) return '#48bb78';
        if (score >= 14) return '#f6e05e';
        return '#f56565';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        let breakdownHTML = '';
        for (const [key, value] of Object.entries(scores)) {
            const interpretation = getScoreInterpretation(value);
            const color = getScoreColor(value);
            breakdownHTML += `<div class="score-line" style="border-left-color: ${color}"><strong>${key}:</strong> ${value} / 28 (${interpretation})</div>`;
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
            'Emotional Healing': 'Emotional Healing',
            'Creating Value for the Community': 'Community Value',
            'Conceptual Skills': 'Conceptual Skills',
            'Empowering': 'Empowering',
            'Helping Followers Grow and Succeed': 'Follower Growth',
            'Putting Followers First': 'Followers First',
            'Behaving Ethically': 'Ethical Behavior'
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
                        max: 28,
                        ticks: { stepSize: 4 }
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
                        max: 28,
                        ticks: { stepSize: 4 }
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
            <h3>Interpretation of Your Servant Leadership Behaviors</h3>
            <p>The scores you received indicate the degree to which you exhibit the seven behaviors characteristic of a servant leader. You can use the results to assess areas in which you have strong servant leadership behaviors and areas in which you may strive to improve.</p>
            <ul>
                <li><strong>Emotional Healing (${scores['Emotional Healing']}/28):</strong> The capacity to foster spiritual recovery from hardship or trauma.</li>
                <li><strong>Creating Value for the Community (${scores['Creating Value for the Community']}/28):</strong> A conscious and genuine concern for helping the community.</li>
                <li><strong>Conceptual Skills (${scores['Conceptual Skills']}/28):</strong> The ability to think through complex problems and see big-picture thinking.</li>
                <li><strong>Empowering (${scores['Empowering']}/28):</strong> Fostering ability, confidence, and power in others to act autonomously.</li>
                <li><strong>Helping Followers Grow and Succeed (${scores['Helping Followers Grow and Succeed']}/28):</strong> Supporting and promoting the personal and professional development of followers.</li>
                <li><strong>Putting Followers First (${scores['Putting Followers First']}/28):</strong> Using actions and words that clearly demonstrate that followers' concerns and success are a priority.</li>
                <li><strong>Behaving Ethically (${scores['Behaving Ethically']}/28):</strong> Interacting openly, fairly, and honestly with others.</li>
            </ul>
            <p>By comparing your scores, you can determine which servant leadership behaviors are your strengths and which may be areas for development.</p>
        `;
    }

    renderQuestions();
});
