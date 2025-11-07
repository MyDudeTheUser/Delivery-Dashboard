document.addEventListener("DOMContentLoaded", function() {
    const fetchData = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${url}`);
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                }
                return response.text();
            })
            .catch(error => {
                console.error(`Fetch error for ${url}:`, error);
                // Return a default state or null to prevent breaking the chain
                return null;
            });
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

    const renderAlerts = (data) => {
        const container = document.getElementById("alerts");
        if (!data) {
            container.innerHTML = `<h2 id="alerts-heading">Alerts</h2><p>Could not load data.</p>`;
            return;
        }

        // Add heading and filter input
        container.innerHTML = `
            <h2 id="alerts-heading">Alerts</h2>
            <input type="text" id="alerts-filter" placeholder="Filter alerts..." aria-label="Filter alerts">
            <ul id="alerts-list"></ul>
        `;

        const listElement = container.querySelector('#alerts-list');
        const filterInput = container.querySelector('#alerts-filter');

        const updateList = (alerts) => {
            listElement.innerHTML = alerts.map(alert => 
                `<li><strong>${alert.system} (${alert.severity}):</strong> ${alert.message}</li>`
            ).join('');
        };

        // Initial render
        updateList(data);

        // Add event listener for filtering
        filterInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredAlerts = data.filter(alert => alert.message.toLowerCase().includes(searchTerm) || alert.system.toLowerCase().includes(searchTerm));
            updateList(filteredAlerts);
        });
    };

    const renderSprintStatus = (data) => {
        const container = document.getElementById("sprint-status");
        if (!data) {
            container.innerHTML = `<h2 id="sprint-status-heading">Sprint Status</h2><p>Could not load data.</p>`;
            return;
        }
        // Simple CSV to HTML table conversion
        const headerTooltips = {
            sprint_name: "The name of the development sprint.",
            status: "Current status of the sprint (e.g., In Progress, Completed).",
            blockers: "Number of issues currently blocking progress.",
            end_date: "The planned end date for the sprint."
        };
        const rows = data.trim().split('\n').map(row => row.split(','));
        let content = `<h2 id="sprint-status-heading">Sprint Status</h2><table>`;
        const headers = rows[0];
        content += `<thead><tr>${headers.map(header => `<th title="${headerTooltips[header] || ''}">${header.replace(/_/g, ' ')}</th>`).join('')}</tr></thead>`;
        content += `<tbody>`;
        rows.slice(1).forEach(row => {
            content += `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
        });
        content += `</tbody></table>`;
        container.innerHTML = content;
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

    fetchData("data/system_health.json").then(renderSystemHealth);
    fetchData("data/alerts.json").then(renderAlerts);
    fetchData("data/sprint_status.csv").then(renderSprintStatus);
    fetchData("data/releases.json").then(renderUpcomingReleases);
});
