let currentWeek = new Date();
let meetings = [
    {
        id: 1,
        title: "Reunião Estratégica Q4",
        date: "2024-11-20",
        time: "09:00",
        duration: 60,
        participants: "CEO, Diretoria",
        description: "Planejamento estratégico para próximo trimestre",
        important: true
    },
    {
        id: 2,
        title: "Sprint Review #12",
        date: "2024-11-21",
        time: "14:00",
        duration: 90,
        participants: "Time de Dev",
        description: "Review do sprint e planejamento do próximo"
    },
    {
        id: 3,
        title: "Reunião com Cliente X",
        date: "2024-11-22",
        time: "10:30",
        duration: 45,
        participants: "Cliente X, Account Manager",
        description: "Apresentação do novo projeto"
    }
];

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Persistência localStorage
function saveMeetings() {
    localStorage.setItem('meetings', JSON.stringify(meetings));
}

function loadMeetings() {
    const saved = localStorage.getItem('meetings');
    if (saved) {
        meetings = JSON.parse(saved);
    }
}

function generateSchedule() {
    const grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';

    // Header dos dias
    const timeHeader = document.createElement('div');
    timeHeader.className = 'time-header';
    timeHeader.textContent = 'Horário';
    grid.appendChild(timeHeader);

    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-header';
        
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(dayDate.getDate() + i);
        
        dayDiv.innerHTML = `
            <div>${days[dayDate.getDay()]}</div>
            <div>${dayDate.getDate()}/${String(dayDate.getMonth() + 1).padStart(2, '0')}</div>
        `;
        grid.appendChild(dayDiv);
    }

    // Slots de horário
    hours.forEach(hour => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-header';
        timeSlot.textContent = hour;
        grid.appendChild(timeSlot);

        for (let day = 0; day < 7; day++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.hour = hour;
            
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + day);
            slot.dataset.date = dayDate.toISOString().split('T')[0];
            
            slot.innerHTML = '<div class="add-btn" onclick="newMeeting(event)">+</div>';
            slot.onclick = (e) => {
                if (!e.target.classList.contains('add-btn') && !e.target.classList.contains('meeting')) {
                    fillModal(slot.dataset.date, slot.dataset.hour);
                }
            };
            
            // Adicionar reuniões existentes
            meetings.forEach(meeting => {
                if (meeting.date === slot.dataset.date && meeting.time === hour) {
                    const meetingDiv = document.createElement('div');
                    meetingDiv.className = `meeting ${meeting.important ? 'important' : ''}`;
                    meetingDiv.innerHTML = `
                        <div>${meeting.title}</div>
                        <div style="font-size: 10px; opacity: 0.8;">${meeting.participants}</div>
                    `;
                    meetingDiv.title = meeting.description;
                    slot.appendChild(meetingDiv);
                }
            });
            
            grid.appendChild(slot);
        }
    });
}

function newMeeting(e) {
    document.getElementById('modalTitle').textContent = 'Nova Reunião';
    document.getElementById('meetingForm').reset();
    document.getElementById('meetingDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('meetingTime').value = '09:00';
    document.getElementById('meetingModal').style.display = 'flex';
}

function fillModal(date, time) {
    document.getElementById('meetingDate').value = date;
    document.getElementById('meetingTime').value = time;
    newMeeting();
}

function closeModal() {
    document.getElementById('meetingModal').style.display = 'none';
}

document.getElementById('meetingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newMeetingData = {
        id: Date.now(),
        title: document.getElementById('meetingTitle').value,
        date: document.getElementById('meetingDate').value,
        time: document.getElementById('meetingTime').value,
        duration: parseInt(document.getElementById('meetingDuration').value),
        participants: document.getElementById('meetingParticipants').value,
        description: document.getElementById('meetingDescription').value,
        important: Math.random() > 0.7
    };
    
    meetings.push(newMeetingData);
    saveMeetings();
    generateSchedule();
    closeModal();
});

function prevWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateWeekDisplay();
    generateSchedule();
}

function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateWeekDisplay();
    generateSchedule();
}

function today() {
    currentWeek = new Date();
    updateWeekDisplay();
    generateSchedule();
}

function updateWeekDisplay() {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    document.getElementById('currentWeek').textContent = 
        `${startOfWeek.getDate()}-${endOfWeek.getDate()} de Novembro`;
}

function changeView() {
    console.log('Mudar visualização');
}

function searchMeetings() {
    console.log('Buscar reuniões');
}

// Inicializar
loadMeetings();
updateWeekDisplay();
generateSchedule();

// Fechar modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('meetingModal');
    if (event.target === modal) {
        closeModal();
    }
}
