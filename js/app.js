document.addEventListener("DOMContentLoaded", function() {
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${url}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            console.error(`Fetch error for ${url}:`, error);
            return null; // Return null to prevent breaking subsequent calls
        }
    };

    const renderSystemHealth = (data) => {
        const container = document.getElementById("system-health");
        if (!data) {
            container.innerHTML = `<h2 id="system-health-heading">System Health</h2><p>Could not load data.</p>`;
            return;
        }
        let content = `<h2 id="system-health-heading">System Health</h2><div class="system-health-grid">`;
        data.forEach(system => {
            content += `
                <div class="system-item">
                    <h3>${system.system} <span class="status-dot status-${system.status}"></span></h3>
                    <div class="gauges-container">
                        <div class="gauge">
                            <canvas id="cpu-gauge-${system.system}"></canvas>
                            <div class="gauge-label">CPU</div>
                        </div>
                        <div class="gauge">
                            <canvas id="mem-gauge-${system.system}"></canvas>
                            <div class="gauge-label">Memory</div>
                        </div>
                    </div>
                </div>
            `;
        });
        content += `</div>`;
        container.innerHTML = content;

        // After setting the HTML, render the charts
        data.forEach(system => {
            createGauge(`cpu-gauge-${system.system}`, system.cpu);
            createGauge(`mem-gauge-${system.system}`, system.memory);
        });
    };

    const createGauge = (elementId, value) => {
        const ctx = document.getElementById(elementId).getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: ['#3498db', '#ecf0f1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    };

    const renderUpcomingReleases = (data) => {
        const container = document.getElementById("upcoming-releases");
        if (!data) {
            container.innerHTML = `<h2 id="releases-heading">Upcoming Releases</h2><p>Could not load data.</p>`;
            return;
        }
        let content = `<h2 id="releases-heading">Upcoming Releases</h2><ul>`;
        data.forEach(release => {
            content += `<li><strong>${release.name}</strong> - ${release.date} (${release.systems.join(', ')})</li>`;
        });
        content += `</ul>`;
        container.innerHTML = content;
    };

    const renderKnowledgeHub = (data) => {
        const container = document.getElementById("knowledge-hub");
        if (!data) {
            container.innerHTML = `<h2 id="knowledge-hub-heading">Knowledge Hub</h2><p>Could not load data.</p>`;
            return;
        }
        let content = `<h2 id="knowledge-hub-heading">Knowledge Hub</h2><ul>`;
        data.forEach(item => {
            content += `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a> [${item.category}]</li>`;
        });
        content += `</ul>`;
        container.innerHTML = content;
    };

    const setupStaticContent = () => {
        // Setup for Alerts
        const alertsContainer = document.getElementById("alerts");
        alertsContainer.innerHTML = `
            <h2 id="alerts-heading">Alerts</h2>
            <input type="text" id="alerts-filter" placeholder="Filter alerts..." aria-label="Filter alerts">
            <ul id="alerts-list"></ul>
        `;
        document.getElementById('alerts-filter').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const listItems = document.querySelectorAll('#alerts-list li');
            listItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });

        // Setup for Sprint Status
        const sprintContainer = document.getElementById("sprint-status");
        const sprintHeaders = "sprint_name,status,blockers,end_date".split(','); // Corrected headers to match CSV
        const headerTooltips = {
            sprint_name: "The name of the development sprint.",
            status: "Current status of the sprint (e.g., In Progress, Completed).",
            completed_points: "Number of story points completed.",
            total_points: "Total story points in the sprint."
        };
        sprintContainer.innerHTML = `
            <h2 id="sprint-status-heading">Sprint Status</h2>
            <input type="text" id="sprint-filter" placeholder="Filter sprints..." aria-label="Filter sprints">
            <table>
                <thead><tr>${sprintHeaders.map(header => `<th title="${headerTooltips[header] || ''}">${header.replace(/_/g, ' ')}</th>`).join('')}</tr></thead>
                <tbody id="sprint-table-body"></tbody>
            </table>
        `;
        document.getElementById('sprint-filter').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('#sprint-table-body tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    };

    const fetchAllDataAndRender = () => {
        console.log("Refreshing dashboard data...");
        fetchData("data/system_health.json").then(renderSystemHealth);
        fetchData("data/alerts.json").then(data => {
            if (!data) return;
            const listElement = document.querySelector('#alerts-list');
            if (listElement) {
                listElement.innerHTML = data.map(alert => 
                    `<li><strong>${alert.system} (${alert.severity}):</strong> ${alert.message}</li>`
                ).join('');
            }
        });
        fetchData("data/sprint_status.csv").then(data => {
            if (!data) return;
            const container = document.getElementById("sprint-status");
            const tableBody = container.querySelector('#sprint-table-body');
            const rows = data.trim().split('\n');
            const headers = rows[0].split(',');
            const sprintData = rows.slice(1).map(row => {
                const values = row.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
            });
            if (tableBody) {
                tableBody.innerHTML = sprintData.map(sprint => 
                    `<tr>${headers.map(header => `<td>${sprint[header]}</td>`).join('')}</tr>`
                ).join('');
            }
        });
        fetchData("data/releases.json").then(renderUpcomingReleases);
        fetchData("data/knowledge_hub.json").then(renderKnowledgeHub);
    };

    // 1. Setup the static parts of the page and event listeners ONCE
    setupStaticContent();

    // 2. Fetch data for the initial load
    fetchAllDataAndRender();

    // 3. Set an interval to refresh the data periodically
    setInterval(fetchAllDataAndRender, 30000);
});
