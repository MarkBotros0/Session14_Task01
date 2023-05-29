/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
var model = {
    init() {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }
            var nameColumns = $('tbody .name-col'),
                attendance = {};
            nameColumns.each(function () {
                var name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= model.noOfDays; i++) {
                    attendance[name].push(getRandom());
                }
            });
            localStorage.attendance = JSON.stringify(attendance);
        }
    },
    names: ["Slappy the Frog", "Adam the Anaconda", "gregory the Goat", "Lilly the Lizard", "Paulrus the Walrus", "Mark Essam","micheal"],
    noOfDays: 20
}

var controller = {
    init() {
        view.init()
        model.init()
        this.updateCheckboxes()
        this.countMissing()
    },
    countMissing() {
        var $allMissed = $('tbody .missed-col')
        $allMissed.each(function () {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function () {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    },
    updateCheckboxes() {
        var attendance = JSON.parse(localStorage.attendance)
        $.each(attendance, function (name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function (i) {
                $(this).prop('checked', days[i]);
            });
        });
    },
    getNames() {
        return model.names;
    },
    getNoOfDays() {
        return model.noOfDays;
    },
    click() {
        var studentRows = $('tbody .student'),
        newAttendance = {};

    studentRows.each(function () {
        var name = $(this).children('.name-col').text(),
            $allCheckboxes = $(this).children('td').children('input');

        newAttendance[name] = [];

        $allCheckboxes.each(function () {
            newAttendance[name].push($(this).prop('checked'));
        });
    });

    controller.countMissing();
    localStorage.attendance = JSON.stringify(newAttendance);

    }
}


var view = {
    init() {
        $("thead tr").append("<th class='name-col'>Student Name</th>")
        for (let i = 1; i <= controller.getNoOfDays(); i++) {
            $("thead tr").append("<th>" + i + "</th>")
        }
        $("thead tr").append("<th class='missed-col'>Days Missed-col</th>")


        var names = controller.getNames()
        for (let i = 0; i < names.length; i++) {
            $("tbody").append("<tr class='student'></tr>")
        }

        $(".student").each(function (index) {
            $(this).append("<td class='name-col'>" + names[index] + "</td>")
            for (let i = 1; i <= controller.getNoOfDays(); i++) {
                $(this).append("<td class='attend-col'><input type='checkbox' /></td>")
            }
            $(this).append("<td class='missed-col'>0</td>")
        })

        var $allCheckboxes = $('tbody input');

        $allCheckboxes.on('click', function () {
           controller.click()
        })
    }
}


$(function () {
    controller.init()
})
