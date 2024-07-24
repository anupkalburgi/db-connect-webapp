function updateTimeline(step, status) {
    const tab = document.getElementById(`step${step}-tab`);
    tab.classList.add(status ? 'success' : 'fail');
}

function processStep(step) {
    $.ajax({
        url: `/step${step}`,
        type: 'GET',
        beforeSend: function () {
            $('#startWorkflow').text('Running...').prop('disabled', true);
        },
        success: function (response) {
            $(`#step${step}-content`).html(response.data);
            updateTimeline(step, true);
            $(`#step${step}-content table`).DataTable();
            if (step < 5) {
                processStep(step + 1);
            } else {
                $('#startWorkflow').text('Complete').prop('disabled', true);
            }
        },
        error: function () {
            updateTimeline(step, false);
            $('#startWorkflow').text('Error');
        }
    });
}

$(document).ready(function () {
    $('#startWorkflow').click(function () {
        $(this).text('Running...').prop('disabled', true);
        processStep(1);
    });

    $('#workflowTabs a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});
