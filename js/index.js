$.fn.replaceWithPush = function(a) {
    var $a = $(a);
    this.replaceWith($a);
    return $a;
};

var selected_item_to_delete, delete_confirm_dialog;

$(function() {
    $('.nav a').on('click', function() {
        $('.navbar-toggler').click()
    });


    delete_confirm_dialog = $("#dialog-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 375,
        modal: true,
        buttons: {
            Okay: function() {
                selected_item_to_delete.remove();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });


    $('#search').on('blur', function(e) {
      e.stopImmediatePropagation();
    })

    $('#collapse-search').on('hidden.bs.collapse', function() {
      $('#search').val('');
      search_table("");
    })

    // search filter //
    $('#search').keyup(function() {
        search_table($(this).val());
    });

    function search_table(value) {
        $('#list-table tr').each(function() {
            var found = 'false';
            $(this).each(function() {
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    found = 'true';
                }
            });
            if (found == 'true') {
                $(this).show();
            } else {
                $(this).hide();
            }

        })
    }

    $('body').bootstrapMaterialDesign();

    document.getElementById("nav-current-time").innerHTML = getCurrentTime();

    $("#add-me-on-btn").click(function() {
        var $bodyTable = $(this).closest(".tab-pane").find("tbody");
        var waitListLength = $bodyTable.children().length + 1;
        var newListString = createNewWaitlistItem(waitListLength);
        var $newList = $(newListString);
        $newList.find(".add-item-button").click(function() {
            var $trParentElement = $(this).closest("tr");
            var convertedWaitlist = convertNewWaitlistToStaticItem($trParentElement);
            var $newList = $trParentElement.replaceWithPush(convertedWaitlist);

            // Add delete button event handler
            $newList.find(".delete-item-button").click(function() {
                selected_item_to_delete = $(this).closest("tr");
                delete_confirm_dialog.dialog("open");
                // $(this).closest("tr").remove();

            });

            // Add edit button event handler
            $newList.find(".edit-item-button").click(function() {
                $('#demoModal').modal('show');
            });

        });
        $newList.appendTo($bodyTable);
    });

    $("#reservation-btn").click(function() {
        var $bodyTable = $(this).closest(".tab-pane").find("tbody");
        var waitListLength = $bodyTable.children().length + 1;
        var newListString = reservationItem(waitListLength);
        var $newList = $(newListString);

        $newList = initializeReservationEditItem($newList);
        $newList.appendTo($bodyTable);
    });

    $('#carouselExample').on('slide.bs.carousel', function(e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 4;
        var totalItems = $('.carousel-item').length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end
                if (e.direction == "left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                } else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
    });

    $('#carouselExample').carousel({
        interval: 2000
    });

    // $('a.thumb').click(function(event) {
    //     event.preventDefault();
    //     var content = $('.modal-body');
    //     content.empty();
    //     var title = $(this).attr("title");
    //     $('.modal-title').html(title);
    //     content.html($(this).html());
    //     $(".modal-profile").modal({ show: true });
    // });

    $('a[data-toggle="pill"]').on('shown.bs.tab', function() {
        if ($('#v-pills-home').is(":visible") || $('#v-pills-reserve').is(":visible")) {
            $('.today-menu').removeClass('fade');
        } else {
            $('.today-menu').addClass('fade');
        }
    });



    /**
     * Modal image replace for #v-pills-menu page
     */
    $('#v-pills-menu a[data-toggle="modal"]').click(function(e) {
        var img_url = $(e.currentTarget).children('img').attr('src');
        $('#modal-main-img').attr('src', img_url);
    });

})

function getCurrentTime() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

$('.timepicker').timepicker({
    timeFormat: 'h:mm p',
    interval: 60,
    minTime: '10',
    maxTime: '6:00pm',
    defaultTime: '11',
    startTime: '10:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
});



function reservationItemEdit(e) {
    var $button = $(e.currentTarget);
    var $tr = $button.closest('tr');

    var index = $tr.find('.resv-item-0').text();
    var name = $tr.find('.resv-item-1').text();
    var numOfParty = $tr.find('.resv-item-2').text();
    var date = $tr.find('.resv-item-3').text();
    var time = $tr.find('.resv-item-4').text();

    // 1. get new item row
    var $editReservationItem = $(reservationItem(index));

    // 2. set value to new item
    $editReservationItem.find('.resv-item-1').val(name);
    $editReservationItem.find('.resv-item-2').val(numOfParty);
    $editReservationItem.find('.resv-item-3').val(date);
    $editReservationItem.find('.resv-item-4').val(time);

    // 3. Initialize reservation edit item
    $editReservationItem = initializeReservationEditItem($editReservationItem);

    // 4. replace current row with new item row
    $tr.replaceWith($editReservationItem);
}

function initializeReservationEditItem(item) {
    item.find(".datepicker1").datepicker();
    item.find(".timepicker").timepicker();
    item.find(".add-item-button").click(function() {
        var $trParentElement = $(this).closest("tr");
        var convertedWaitlist = convertNewReservationItem($trParentElement);
        var item = $trParentElement.replaceWithPush(convertedWaitlist);

        // Add delete button event handler
        item.find(".delete-item-button").click(function() {
            selected_item_to_delete = $(this).closest("tr");
            delete_confirm_dialog.dialog("open");
        });

        // Add edit button event handler
        item.find(".edit-item-button").click(reservationItemEdit);
    });
    return item;
}

function createNewWaitlistItem(nth) {
    var col1Id = "name-input-" + nth;
    var col2Id = "size-input-" + nth;
    var htmlContent = '<tr class="ui-widget-content text-center">' +
        '  <td scope="row" class="content1 waitlist-number">' + nth + '</td>' +
        '  <td class="content1">' +
        '    <div class="form-group waitlist-name-input-form-group bmd-form-group">' +
        '      <label for="' + col1Id + '" class="bmd-label-static">Name</label>' +
        '      <input type="text" class="form-control" id="' + col1Id + '">' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1">' +
        '    <div class="form-group waitlist-size-input-form-group bmd-form-group is-filled">' +
        '      <label for="' + col2Id + '" class="bmd-label-floating">Size</label>' +
        '      <select class="form-control" id="' + col2Id + '">' +
        '        <option>1</option>' +
        '        <option>2</option>' +
        '        <option>3</option>' +
        '        <option>4</option>' +
        '        <option>5</option>' +
        '        <option>6+</option>' +
        '      </select>' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1 d-none d-md-flex"> - </td>' +
        '  <td class="content1 d-none d-md-flex"> - </td>' +
        '  <td class="content1">' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm add-item-button">' +
        '      <i class="material-icons">add</i>' +
        '    </button>' +
        '  </td>' +
        '</tr>';

    return htmlContent;
}


function reservationItem(nth) {
    var col1Id = "name2-input-" + nth;
    var col2Id = "size2-input-" + nth;
    var col3Id = "datepicker1-" + nth;
    var col4Id = "timepicker-" + nth;

    var htmlContent = '<tr class="ui-widget-content text-center">' +
        '  <td scope="row" class="content1 waitlist-number">' + nth + '</td>' +
        '  <td class="content1">' +
        '    <div contenteditable="true" class="form-group waitlist-name-input-form-group bmd-form-group">' +
        '      <label for="' + col1Id + '" class="bmd-label-static">Name</label>' +
        '      <input type="text" class="form-control resv-item-1" id="' + col1Id + '">' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1">' +
        '    <div contenteditable="true" class="form-group waitlist-size-input-form-group bmd-form-group is-filled">' +
        '      <label for="' + col2Id + '" class="bmd-label-floating">Size</label>' +
        '      <select class="form-control resv-item-2" id="' + col2Id + '">' +
        '        <option>1</option>' +
        '        <option>2</option>' +
        '        <option>3</option>' +
        '        <option>4</option>' +
        '        <option>5</option>' +
        '        <option>6+</option>' +
        '      </select>' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1 d-none d-md-flex">' +
        '    <div contenteditable="true" class="form-group waitlist-name-input-form-group bmd-form-group">' +
        '      <label for="' + col3Id + '" class="bmd-label-static">Date</label>' +
        '      <input type="text" class="form-control datepicker1 resv-item-3" id="' + col3Id + '">' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1 d-none d-md-flex"> ' +
        '    <div contenteditable="true" class="form-group waitlist-name-input-form-group bmd-form-group">' +
        '      <label for="' + col4Id + '" class="bmd-label-static">Time</label>' +
        '      <input type="text" class="form-control timepicker resv-item-4" id="' + col4Id + '">' +
        '    </div>' +
        '  </td>' +
        '  <td class="content1">' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm add-item-button">' +
        '      <i class="material-icons">add</i>' +
        '    </button>' +
        '  </td>' +
        '</tr>';

    return htmlContent;
}



/**
 * Convert New Waitlist Item Table Row into Static Item Row HTML Content.
 **/
function convertNewWaitlistToStaticItem($newList) {
    var itemNumber = $newList.find(".waitlist-number").text();
    var name = $newList.find(".waitlist-name-input-form-group").children("input").val();
    var size = $newList.find(".waitlist-size-input-form-group").children("select").val();
    var checkinTime = getCurrentTime();
    var expectedTime = '20 min';
    if (name.length < 1) {
        alert("Please enter a valid name");
        return;

    }

    return '<tr class="ui-widget-content text-center">' +
        '  <td scope="row" class="content1">' + itemNumber + '</td>' +
        '  <td class="content1">' + name + '</td>' +
        '  <td class="content1">' + size + '</td>' +
        '  <td class="content1 d-none d-md-flex">' + checkinTime + '</td>' +
        '  <td class="content1 d-none d-md-flex">' + expectedTime + '</td>' +
        '  <td class="content1">' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm delete-item-button">' +
        '      <i class="material-icons">close</i>' +
        '    </button>' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm edit-item-button">' +
        '      <i class="material-icons">edit</i>' +
        '    </button>' +
        '  </td>' +
        '</tr>';
}

function convertNewReservationItem($newList) {
    var itemNumber = $newList.find(".waitlist-number").text();
    var name = $newList.find(".waitlist-name-input-form-group").children("input").val();
    var size = $newList.find(".waitlist-size-input-form-group").children("select").val();
    var date = $newList.find(".datepicker1").val();
    var time = $newList.find(".timepicker").val();
    if (name.length < 1) {
        alert("Please enter a valid name");
        return;
    }


    return '<tr class="ui-widget-content text-center">' +
        '  <td scope="row" class="content1 resv-item-0">' + itemNumber + '</td>' +
        '  <td class="content1 resv-item-1">' + name + '</td>' +
        '  <td class="content1 resv-item-2">' + size + '</td>' +
        '  <td class="content1 resv-item-3 d-none d-md-flex">' + date + '</td>' +
        '  <td class="content1 resv-item-4 d-none d-md-flex">' + time + '</td>' +
        '  <td class="content1">' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm delete-item-button">' +
        '      <i class="material-icons">close</i>' +
        '    </button>' +
        '    <button type="button" class="btn btn-info bmd-btn-fab bmd-btn-fab-sm edit-item-button">' +
        '      <i class="material-icons">edit</i>' +
        '    </button>' +
        '  </td>' +
        '</tr>';
}