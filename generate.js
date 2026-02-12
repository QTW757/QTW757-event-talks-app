
const fs = require('fs');
const path = require('path');

const talksData = JSON.parse(fs.readFileSync('talks.json', 'utf8'));
const htmlTemplate = fs.readFileSync(path.join('src', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join('src', 'style.css'), 'utf8');
const js = fs.readFileSync(path.join('src', 'script.js'), 'utf8');

let scheduleHtml = '';
let currentTime = new Date();
currentTime.setHours(10, 0, 0, 0);

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

talksData.talks.forEach((talk, index) => {
    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

    scheduleHtml += `
        <div class="talk" data-category="${talk.category.join(', ')}">
            <h3>${formatTime(startTime)} - ${formatTime(endTime)}</h3>
            <h2>${talk.title}</h2>
            <p class="speakers">${talk.speakers.join(', ')}</p>
            <p>${talk.description}</p>
            <div class="category">
                ${talk.category.map(c => `<span>${c}</span>`).join('')}
            </div>
        </div>
    `;

    currentTime = new Date(endTime.getTime() + 10 * 60000); 

    if (index === 2) {
        const lunchStartTime = new Date(currentTime);
        const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
        scheduleHtml += `
            <div class="break">
                <h3>${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</h3>
                <p>Lunch Break</p>
            </div>
        `;
        currentTime = lunchEndTime;
    }
});

let finalHtml = htmlTemplate.replace('<!-- {{SCHEDULE}} -->', scheduleHtml);
finalHtml = finalHtml.replace('<!-- {{CSS}} -->', css);
finalHtml = finalHtml.replace('<!-- {{JS}} -->', js);

fs.writeFileSync(path.join('dist', 'index.html'), finalHtml);

console.log('Website generated successfully!');
