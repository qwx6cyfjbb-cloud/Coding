document.addEventListener("DOMContentLoaded", async () => {
    // Grab elements safely
    const box = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const goalsList = document.getElementById('goals-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const panelBtn = document.getElementById('cursor-panel-btn');
    const panel = document.getElementById('cursor-panel');

    // ==========================================
    // 1. DYNAMIC SCHEDULE LOGIC (Runs if goalsList exists)
    // ==========================================
    if (goalsList) {
        // Load saved schedule items from server
        try {
            const res = await fetch('/api/schedule');
            if (res.ok) {
                const items = await res.json();
                goalsList.innerHTML = ''; // Clear fallback defaults
                items.forEach(item => {
                    appendScheduleDOM(item.id, item.text, item.checked);
                });
            }
        } catch (err) {
            console.error("Could not load schedule:", err);
        }

        // Add item event listener
        if (addTaskBtn && newTaskInput) {
            const handleAdd = async () => {
                const text = newTaskInput.value.trim();
                if (!text) return;

                const newId = `task-${Date.now()}`;
                appendScheduleDOM(newId, text, false);
                newTaskInput.value = '';

                await syncScheduleToServer();
            };

            addTaskBtn.addEventListener('click', handleAdd);
            newTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleAdd();
            });
        }

        // Listen for checkbox state changes to save them automatically
        goalsList.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox') {
                await syncScheduleToServer();
            }
        });
    }

    // Helper function to draw schedule items
    function appendScheduleDOM(id, text, isChecked) {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        goalItem.innerHTML = `
            <input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}>
            <label for="${id}"><strong>${text}</strong></label>
        `;
        goalsList.appendChild(goalItem);
    }

    // Helper function to pack schedule and send to Flask
    async function syncScheduleToServer() {
        const items = [];
        const rows = goalsList.querySelectorAll('.goal-item');
        rows.forEach(row => {
            const input = row.querySelector('input[type="checkbox"]');
            const label = row.querySelector('label strong');
            if (input && label) {
                items.push({
                    id: input.id,
                    text: label.innerText,
                    checked: input.checked
                });
            }
        });

        try {
            await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(items)
            });
        } catch (err) {
            console.error("Error syncing schedule changes:", err);
        }
    }

    // ==========================================
    // 2. CHAT HISTORY LOGIC (Only runs if chat box exists)
    // ==========================================
    if (box) {
        try {
            const histRes = await fetch('/get_history');
            if (histRes.ok) {
                const history = await histRes.json();
                box.innerHTML = ''; 
                history.forEach(item => {
                    if (item.message && item.message.trim() !== '') {
                        box.innerHTML += `<div class="message user-msg">${item.message}</div>`;
                    }
                    if (item.response && item.response.trim() !== '') {
                        let formattedResponse = item.response;
                        if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                            formattedResponse = marked.parse(item.response);
                        }
                        box.innerHTML += `<div class="message tutor-msg">${formattedResponse}</div>`;
                    }
                });
                box.scrollTop = box.scrollHeight;
            }
        } catch (error) {
            console.error("Could not load chat history:", error);
        }
    }

    // ==========================================
    // 3. CURSOR SELECTION PANEL LOGIC (Runs if button exists)
    // ==========================================
    if (panelBtn && panel) {
        panelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== panelBtn) {
                panel.classList.add('hidden');
            }
        });

        const options = document.querySelectorAll('.cursor-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const choice = opt.getAttribute('data-cursor');
                if (choice === 'default') {
                    document.body.style.cursor = 'default';
                } else {
                    const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>${choice}</text></svg>`;
                    document.body.style.cursor = `url("data:image/svg+xml;utf8,${encodeURIComponent(svgString)}"), auto`;
                }
                panel.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // 4. CHAT FORM SUBMISSION (Runs if form exists)
    // ==========================================
    if (chatForm && box) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const msgInput = document.getElementById('user-input');
            const fileInput = document.getElementById('file-upload');
            const msg = msgInput.value.trim();
            
            if (!msg && (!fileInput || fileInput.files.length === 0)) {
                return; 
            }
            
            box.innerHTML += `<div class="message user-msg">${msg || '📷 Sent an image'}</div>`;
            msgInput.value = '';
            if (fileInput) fileInput.value = '';

            const tutorMsgElement = document.createElement('div');
            tutorMsgElement.className = 'message tutor-msg';
            box.appendChild(tutorMsgElement);
            box.scrollTop = box.scrollHeight;

            try {
                const formData = new FormData(chatForm);
                const res = await fetch('/ask', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.response) {
                    typeWriter(tutorMsgElement, data.response, 20);
                } else {
                    tutorMsgElement.innerText = "Error: AI response was empty!";
                }
            } catch (error) {
                console.error("Fetch error:", error);
                tutorMsgElement.innerText = "Error: Could not connect to AI.";
            }
        };
    }

    function typeWriter(element, text, speed = 20) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                box.scrollTop = box.scrollHeight;
                setTimeout(type, speed);
            } else {
                if (typeof marked !== 'undefined') {
                    element.innerHTML = marked.parse(element.textContent);
                    box.scrollTop = box.scrollHeight; 
                }
            }
        }
        type();
    }
});