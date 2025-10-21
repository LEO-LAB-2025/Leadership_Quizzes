const questions = [
    {
        category: "One-on-One",
        behaviors: [
            "I begin our interaction by showing interest in the other person (e.g., asking questions, sharing something personal, and inviting the other person to share as well).",
            "I make eye contact with the person.",
            "I face the individual I am speaking with.",
            "I put away all distractions such as my cell phone.",
            "I eliminate physical or technological barriers between us, such as sitting behind my desk and/or keeping my camera off.",
            "I ask open-ended questions to learn about the other person.",
            "I regularly designate time for people to come and talk to me.",
            "I treat each and every person with respect and dignity.",
            "I recognize and reward employees/people according to their individual motivations."
        ]
    },
    {
        category: "Teams (as leader)",
        behaviors: [
            "I identify unique skill sets of team members.",
            "I use the full range of talents on my team to achieve work objectives.",
            "I ask everyone on the team for input and through different means (in person, via email, pulse checks, etc.).",
            "I ask everyone on the team what and how they want to contribute.",
            "I configure project teams to include people who do not regularly interact with one another.",
            "I provide different members of the team with leadership opportunities.",
            "I seek feedback from others and make changes based on that feedback."
        ]
    },
    {
        category: "Teams (as facilitator)",
        behaviors: [
            "I prepare an agenda and send it out ahead of a meeting so that people can prepare and better participate.",
            "I utilize a process in which everyone gives feedback and input at times (e.g., nominal group technique, round-robin discussion, online real-time data collection tools).",
            "When possible, I ask team members to provide updates rather than being the only one to speak.",
            "I adapt physical arrangements such as seating and/or technology that allows people to interact with one another.",
            "When someone new joins the team or when a team is forming, I ask for everyone's preferred names, pronunciations, and pronouns.",
            "I encourage conflicting views and/or dissension within team discussions.",
            "I create \"airtime\" limits so that outspoken people do not dominate the conversation."
        ]
    },
    {
        category: "Teams (as participant)",
        behaviors: [
            "We rotate roles in team meetings each time (time keeper, note-taker, action item capturer, etc.).",
            "If a colleague is interrupted by someone, I will say that I would like to hear the colleague finish the thought, prompting the group to go back to let that person finish speaking.",
            "I come prepared to share my thoughts and ideas.",
            "If a colleague has been silent during the meeting, I will encourage the colleague to share by saying something like \"I would love to hear what you are thinking about this issue.\""
        ]
    },
    {
        category: "Mentor/Protégé",
        behaviors: [
            "I ask my protégé about preferred work style and communication cadence.",
            "I discuss and develop a list of expectations with my protégé such that we are both able to clarify expectations of one another early in the relationship.",
            "Rather than assume I know what is best, I start meetings with my protégé by asking how our time together can be most useful for the protégé."
        ]
    }
];

let chartInstances = { bar: null, pie: null, radar: null };

document.addEventListener('DOMContentLoaded', function() {
    renderQuestions();
    setupChartTabs();
    document.getElementById('leadershipForm').addEventListener('submit', calculateScores);
});

function renderQuestions() {
    const tbody = document.getElementById('checklist-body');
    let questionIndex = 0;
    
    questions.forEach((section, sectionIndex) => {
        section.behaviors.forEach((behavior, behaviorIndex) => {
            const row = document.createElement('tr');
            
            // Category cell (only show for first behavior in each category)
            if (behaviorIndex === 0) {
                const categoryCell = document.createElement('td');
                categoryCell.textContent = section.category;
                categoryCell.className = 'interaction-cell';
                categoryCell.rowSpan = section.behaviors.length;
                row.appendChild(categoryCell);
            }
            
            // Behavior cell
            const behaviorCell = document.createElement('td');
            behaviorCell.textContent = behavior;
            behaviorCell.className = 'behavior-cell';
            row.appendChild(behaviorCell);
            
            // Yes cell
            const yesCell = document.createElement('td');
            yesCell.className = 'response-cell';
            const yesRadio = document.createElement('input');
            yesRadio.type = 'radio';
            yesRadio.name = `question_${questionIndex}`;
            yesRadio.value = 'yes';
            yesRadio.required = true;
            yesCell.appendChild(yesRadio);
            row.appendChild(yesCell);
            
            // No cell
            const noCell = document.createElement('td');
            noCell.className = 'response-cell';
            const noRadio = document.createElement('input');
            noRadio.type = 'radio';
            noRadio.name = `question_${questionIndex}`;
            noRadio.value = 'no';
            noRadio.required = true;
            noCell.appendChild(noRadio);
            row.appendChild(noCell);
            
            tbody.appendChild(row);
            questionIndex++;
        });
    });
}

function setupChartTabs() {
    const tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const views = document.querySelectorAll('.chart-view');
            views.forEach(v => v.classList.remove('active'));
            
            const targetView = document.getElementById(`${tab.dataset.chart}-view`);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
}

function calculateScores(event) {
    event.preventDefault();
    
    const form = document.getElementById('leadershipForm');
    if (!form.checkValidity()) {
        alert("Please answer all questions before submitting.");
        return;
    }
    
    const formData = new FormData(form);
    const scores = {
        'One-on-One': { total: 9, noCount: 0 },
        'Teams (as leader)': { total: 7, noCount: 0 },
        'Teams (as facilitator)': { total: 7, noCount: 0 },
        'Teams (as participant)': { total: 4, noCount: 0 },
        'Mentor/Protégé': { total: 3, noCount: 0 }
    };
    
    let totalNoCount = 0;
    let questionIndex = 0;
    
    questions.forEach(section => {
        section.behaviors.forEach(() => {
            const answer = formData.get(`question_${questionIndex}`);
            if (answer === 'no') {
                scores[section.category].noCount++;
                totalNoCount++;
            }
            questionIndex++;
        });
    });
    
    displayResults(scores, totalNoCount);
}

function displayResults(scores, totalNoCount) {
    const resultDiv = document.querySelector('.result');
    resultDiv.style.display = 'block';
    
    // Update overall score display
    document.getElementById('total-score').textContent = totalNoCount;
    document.getElementById('score-interpretation').textContent = getScoreLevel(totalNoCount);
    
    // Update score circle color
    const scoreCircle = document.querySelector('.score-circle');
    if (totalNoCount <= 9) {
        scoreCircle.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    } else if (totalNoCount <= 19) {
        scoreCircle.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    }
    
    // Display score breakdown
    const scoreBreakdown = document.getElementById('score-breakdown');
    scoreBreakdown.innerHTML = '<h3>Scores by Category</h3>';
    Object.entries(scores).forEach(([category, score]) => {
        const color = getScoreCategoryColor(score.noCount, score.total);
        scoreBreakdown.innerHTML += `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>${category}:</strong> ${score.noCount} "No" responses out of ${score.total} (${getCategoryFeedback(score.noCount, score.total)})
            </div>
        `;
    });
    
    // Create charts
    renderCharts(scores, totalNoCount);
    showInterpretation(scores, totalNoCount);
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function getScoreLevel(score) {
    if (score <= 9) return "Exemplary Leader";
    if (score <= 19) return "Developing Leader";
    return "Emerging Leader";
}

function getScoreCategoryColor(noCount, total) {
    const percentage = (noCount / total) * 100;
    if (percentage <= 33) return '#48bb78';  // Green
    if (percentage <= 66) return '#f6e05e';  // Yellow
    return '#f56565';  // Red
}

function getCategoryFeedback(noCount, total) {
    const percentage = (noCount / total) * 100;
    if (percentage === 0) return "Excellent!";
    if (percentage <= 33) return "Strong";
    if (percentage <= 66) return "Developing";
    return "Needs Improvement";
}

function renderCharts(scores, totalNoCount) {
    const categories = Object.keys(scores);
    const noScores = categories.map(cat => scores[cat].noCount);
    const yesScores = categories.map(cat => scores[cat].total - scores[cat].noCount);
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
    
    // Bar Chart
    if (chartInstances.bar) chartInstances.bar.destroy();
    const barCtx = document.getElementById('barChart').getContext('2d');
    chartInstances.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Yes Responses',
                    data: yesScores,
                    backgroundColor: '#27ae60',
                    borderWidth: 2
                },
                {
                    label: 'No Responses',
                    data: noScores,
                    backgroundColor: '#e74c3c',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            },
            plugins: { legend: { position: 'top' } }
        }
    });
    
    // Pie Chart
    if (chartInstances.pie) chartInstances.pie.destroy();
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    chartInstances.pie = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: noScores,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        }
    });
    
    // Radar Chart
    if (chartInstances.radar) chartInstances.radar.destroy();
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const maxScores = categories.map(cat => scores[cat].total);
    chartInstances.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Your "Yes" Responses',
                    data: yesScores,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    borderWidth: 3,
                    pointBackgroundColor: '#3498db'
                },
                {
                    label: 'Maximum Possible',
                    data: maxScores,
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    pointBackgroundColor: '#2ecc71'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: Math.max(...maxScores)
                }
            },
            plugins: { legend: { position: 'top' } }
        }
    });
}

function showInterpretation(scores, totalNoCount) {
    const interpretationDiv = document.getElementById("interpretation");
    
    let overallInterpretation = '';
    if (totalNoCount <= 9) {
        overallInterpretation = 'You exemplify many behaviors of inclusive leaders. You may be able to serve as a role model to others and foster inclusive leadership in members of your team and colleagues at work.';
    } else if (totalNoCount <= 19) {
        overallInterpretation = 'You are working to become an inclusive leader. You are likely motivated to foster an inclusive organizational environment but have a somewhat limited number of tactics and strategies. Try additional inclusive behaviors and seek feedback.';
    } else {
        overallInterpretation = 'You either previously were not aware of the value of inclusive leadership or were not motivated to adapt a more inclusive approach. Consider trying various inclusive leadership behaviors and seeking feedback to improve.';
    }
    
    // Find categories with highest no counts
    const categoryAnalysis = Object.entries(scores)
        .map(([cat, score]) => ({ cat, noCount: score.noCount, total: score.total }))
        .sort((a, b) => b.noCount - a.noCount);
    
    interpretationDiv.innerHTML = `
        <h3>Interpretation of Your Inclusive Leadership Behaviors</h3>
        <p><strong>Overall Assessment:</strong> ${overallInterpretation}</p>
        <p><strong>Areas for Development:</strong></p>
        <ul>
            ${categoryAnalysis.slice(0, 2).map(item => `
                <li><strong>${item.cat}:</strong> ${item.noCount} "No" responses out of ${item.total} - ${getCategoryFeedback(item.noCount, item.total)}</li>
            `).join('')}
        </ul>
        <p><strong>Next Steps:</strong> Focus on the categories with the most "No" check marks. These are good areas to identify where and how you can make changes and challenge yourself to step outside your comfort zone to become a more inclusive leader.</p>
        <p>Upon completion of this instrument, you have identified inclusive leader behaviors you should continue to display as well as those you will want to consider using and developing in the future.</p>
    `;
}
