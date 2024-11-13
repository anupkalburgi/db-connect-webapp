document.addEventListener('DOMContentLoaded', () => {
    let selectedColumns = [];
    let selectedDataset = null;
    let availableColumns = [];

    // Fetch available datasets using Fetch API
    fetch('/datasets')
        .then(response => response.json())
        .then(datasets => {
            console.log("Fetched Datasets:", datasets);  // Debugging line
            const datasetsList = document.getElementById('datasetsList');
            datasetsList.innerHTML = '';
            datasets.forEach(dataset => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = dataset;
                listItem.onclick = () => selectDataset(dataset);
                datasetsList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching datasets:", error));

    // Handle Add Column button click to display relevant filters
    document.getElementById('addColumn').addEventListener('click', () => {
        const columnSelect = document.getElementById('columnSelect');
        const column = columnSelect.value;
        if (column && !selectedColumns.includes(column)) {
            if (!availableColumns.includes(column)) {
                alert('Selected column does not exist in the dataset.');
                return;
            }
            selectedColumns.push(column);
            const filterInputsContainer = document.getElementById('filterInputsContainer');
            const filterContainer = document.createElement('div');
            filterContainer.className = 'mb-2 d-flex align-items-center';
            filterContainer.id = `filter_${column}_container`;
            filterContainer.innerHTML = `
                <label for="filter_${column}" class="form-label me-2">${column}:</label>
                <select id="filter_operator_${column}" class="form-select me-2" style="width: 150px;">
                    <option value="equals">Equals</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                </select>
                <input type="text" id="filter_${column}" class="form-control me-2" placeholder="Enter value to filter by ${column}">
                <button class="btn btn-danger btn-sm removeColumn" data-column="${column}">&times;</button>
            `;
            filterInputsContainer.appendChild(filterContainer);
        } else if (selectedColumns.includes(column)) {
            alert('Column is already added.');
        }
    });

    // Handle Remove Column button click
    document.getElementById('filterInputsContainer').addEventListener('click', (event) => {
        if (event.target.classList.contains('removeColumn')) {
            const column = event.target.dataset.column;
            document.getElementById(`filter_${column}_container`).remove();
            selectedColumns = selectedColumns.filter(col => col !== column);
        }
    });

    // Handle Load Data button click
    document.getElementById('loadData').addEventListener('click', () => {
        loadData();
    });

    // Function to load all columns data without filters
    function loadAllColumnsData() {
        if (!availableColumns.length) {
            console.error("No available columns to load data.");
            return;
        }
        fetch('/get_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataset: selectedDataset, columns: availableColumns, filters: {} })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Loaded Data:", data);  // Debugging line
                const tableHeader = document.getElementById('tableHeader');
                const tableBody = document.getElementById('tableBody');

                // Clear existing table content
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                if (data.length > 0) {
                    availableColumns.forEach(column => {
                        const th = document.createElement('th');
                        th.textContent = column;
                        tableHeader.appendChild(th);
                    });
                }

                // Populate table rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    availableColumns.forEach(column => {
                        const td = document.createElement('td');
                        td.textContent = row[column];
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error("Error loading data:", error));
    }

    // Function to load data with or without filters
    function loadData() {
        const filters = {};

        selectedColumns.forEach(column => {
            const filterValue = document.getElementById(`filter_${column}`).value;
            const filterOperator = document.getElementById(`filter_operator_${column}`).value;
            if (filterValue) {
                filters[column] = { value: filterValue, operator: filterOperator };
            }
        });

        fetch('/get_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataset: selectedDataset, columns: availableColumns, filters: filters })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Filtered Data Loaded:", data);  // Debugging line
                const tableHeader = document.getElementById('tableHeader');
                const tableBody = document.getElementById('tableBody');

                // Clear existing table content
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                if (data.length > 0) {
                    availableColumns.forEach(column => {
                        const th = document.createElement('th');
                        th.textContent = column;
                        tableHeader.appendChild(th);
                    });
                }

                // Populate table rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    availableColumns.forEach(column => {
                        const td = document.createElement('td');
                        td.textContent = row[column];
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error("Error loading filtered data:", error));
    }

    // Select dataset and load columns
    // Select dataset and load columns
    // Select dataset and load columns
    window.selectDataset = function (datasetName) {
        selectedDataset = datasetName;  // Set the selected dataset
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent === datasetName) {
                item.classList.add('active');
            }
        });

        document.getElementById('datasetTitle').textContent = `${datasetName} Data`;
        const infoIcon = document.getElementById('infoIcon');
        infoIcon.style.display = 'none'; // Hide infoIcon initially

        // Fetch column names from backend and load data
        console.log("Selected Fetching Dataset:", datasetName);  // Debugging
        fetch('/get_columns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataset: datasetName })
        })
            .then(response => response.json())
            .then(columns => {
                console.log("Fetched Columns:", columns);  // Debugging line
                if (columns && columns.length > 0) {
                    availableColumns = columns;  // Store available columns for validation
                    document.getElementById('datasetTitle').dataset.columns = columns.join(', ');

                    // Set the title attribute for the infoIcon to enable tooltip functionality
                    infoIcon.style.display = 'inline';
                    infoIcon.setAttribute('title', 'Columns: ' + columns.join(', '));
                    infoIcon.setAttribute('data-bs-toggle', 'tooltip'); // Use Bootstrap 5 attribute for tooltip

                    const columnSelect = document.getElementById('columnSelect');
                    if (columnSelect) {
                        columnSelect.innerHTML = ''; // Clear previous options
                        columns.forEach(column => {
                            const option = document.createElement('option');
                            option.value = column;
                            option.textContent = column;
                            columnSelect.appendChild(option);
                        });
                    }

                    loadAllColumnsData();

                    // Initialize the tooltip for the infoIcon
                    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                    tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl);
                    });
                }
            })
            .catch(error => console.error("Error fetching columns:", error));
    }


    // Initialize Bootstrap tooltip
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});
