document.addEventListener('DOMContentLoaded', () => {
    let selectedColumns = [];
    let selectedDataset = null;
    let availableColumns = [];
    let datasetColumns = {};  // Store dataset columns for validation

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
                // log the column name and available columns for debugging
                console.log("Selected Column:", column, "Available Columns:", availableColumns);
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
            .then(resp => {
                console.log("Loaded Data:", resp);  // Debugging line
                const tableHeader = document.getElementById('tableHeader');
                const tableBody = document.getElementById('tableBody');

                // Clear existing table content
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';
                const data = resp.data;

                // Populate table headers dynamically
                if (data.length > 0) {
                    const headers = Object.keys(data[0]);
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.style.textAlign = 'center';
                        th.style.backgroundColor = '#f8f9fa';
                        th.style.padding = '10px';
                        th.style.border = '1px solid #dee2e6';
                        th.textContent = header;
                        tableHeader.appendChild(th);
                    });
                }

                // Populate table rows dynamically
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.keys(row).forEach(key => {
                        const td = document.createElement('td');
                        td.textContent = row[key];
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
            const columnType = datasetColumns[selectedDataset][column];
            if (filterValue) {
                filters[column] = { value: filterValue, operator: filterOperator, type: columnType };
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
            .then(resp => {
                const tableHeader = document.getElementById('tableHeader');
                const tableBody = document.getElementById('tableBody');

                console.log("Filtered Data:", resp);  // Debugging line
                console.log("clearing table body");  // Debugging line
                // Clear existing table content
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';
                const data = resp.data;

                // Populate table headers
                // / Populate table headers dynamically with styling
                if (data.length > 0) {
                    const headers = Object.keys(data[0]);
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.style.textAlign = 'center';
                        th.style.backgroundColor = '#f8f9fa';
                        th.style.padding = '10px';
                        th.style.border = '1px solid #dee2e6';
                        tableHeader.appendChild(th);
                    });
        
                    // Populate table rows
                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        headers.forEach(column => {
                            const td = document.createElement('td');
                            td.textContent = row[column];
                            tr.appendChild(td);
                        });
                        tableBody.appendChild(tr);
                    });
                }
            })
            .catch(error => console.error("Error loading filtered data:", error));
    }

    // Select dataset and load columns
    window.selectDataset = function (datasetName) {
        selectedDataset = datasetName;  // Set the selected dataset
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent === datasetName) {
                item.classList.add('active');
            }
        });

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

                    datasetColumns[datasetName] = columns.reduce((acc, col) => {
                        acc[col.col_name] = col.data_type;
                        return acc;
                    }, {});

                    availableColumns = columns.map(col => col.col_name);  // Store available columns for validation

                    // Generate column names and types for tooltip display
                    const columnsInfo = columns.map(col => `${col.col_name} (${col.data_type})`).join(', ');

                    document.getElementById('datasetTitle').dataset.columns = columnsInfo;

                    // Set the title attribute for the infoIcon to enable tooltip functionality
                    infoIcon.style.display = 'inline';
                    infoIcon.setAttribute('title', 'Columns: ' + columnsInfo);
                    infoIcon.setAttribute('data-bs-toggle', 'tooltip'); // Use Bootstrap 5 attribute for tooltip

                    const columnSelect = document.getElementById('columnSelect');
                    if (columnSelect) {
                        columnSelect.innerHTML = ''; // Clear previous options
                        columns.forEach(column => {
                            const option = document.createElement('option');
                            option.value = column.col_name;
                            option.textContent = `${column.col_name} (${column.data_type})`;
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
