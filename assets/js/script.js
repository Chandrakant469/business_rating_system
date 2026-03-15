// insert data script start 
$(document).ready(function () {
    $('#addModal').on('hidden.bs.modal', function () {
        $('#addForm')[0].reset();
        $(".error").text("");
        $(".form-control").removeClass("is-invalid");
    });
    function validateName() {
        let name = $("#name").val().trim();
        if (name == "") {
            $("#name_error").text("Name is required");
            return false;
        }
        if (name.length < 2) {
            $("#name_error").text("Minimum 2 characters required");
            return false;
        }
        $("#name_error").text("");
        return true;
    }

    function validateAddress() {
        let address = $("#address").val().trim();
        if (address == "") {
            $("#address_error").text("Address is required");
            return false;
        }
        $("#address_error").text("");
        return true;
    }

    function validatePhone() {
        let phone = $("#phone").val().trim();
        let phonePattern = /^[789][0-9]{9}$/;
        if (phone == "") {
            $("#phone_error").text("Mobile number is required");
            return false;
        }
        if (!phonePattern.test(phone)) {
            $("#phone_error").text("Enter valid mobile number (10 digits starting with 7, 8, or 9)");
            return false;
        }
        $("#phone_error").text("");
        return true;

    }

    function validateEmail() {
        let email = $("#email").val().trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email == "") {
            $("#email_error").text("Email is required (example@gmail.com)");
            return false;
        }
        if (!emailPattern.test(email)) {
            $("#email_error").text("Enter valid email (example@gmail.com)");
            return false;
        }
        $("#email_error").text("");
        return true;
    }

    $("#name").keyup(validateName);
    $("#address").keyup(validateAddress);
    $("#phone").keyup(validatePhone);
    $("#email").keyup(validateEmail);
    $("#addForm").submit(function (e) {
        e.preventDefault();
        if (!validateName()) {
            $("#name").focus();
            return;
        }
        if (!validateAddress()) {
            $("#address").focus();
            return;
        }
        if (!validatePhone()) {
            $("#phone").focus();
            return;
        }
        if (!validateEmail()) {
            $("#email").focus();
            return;
        }
        $.ajax({
            url: "ajax/add_business.php",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function (res) {
                let row = `
                    <tr id="row_${res.id}">
                    <td>${res.id}</td>
                    <td>${res.name}</td>
                    <td>${res.address}</td>
                    <td>${res.phone}</td>
                    <td>${res.email}</td>
                    <td><div class="rating" data-score="0"></div></td>
                    <td>
                    <button class="btn btn-warning edit" data-id="${res.id}">Edit</button>
                    <button class="btn btn-danger delete" data-id="${res.id}">Delete</button>
                    <button class="btn btn-primary rate" data-id="${res.id}">Rate</button>
                    </td>
                    </tr>
                    `;
                $("#businessTable").prepend(row);
                $("#addModal").modal("hide");
                $("#addForm")[0].reset();
                toastr.success("Business added successfully");
                $('.rating').raty({
                    readOnly: true,
                    half: true,
                    score: function () {
                        return $(this).attr("data-score");
                    }
                });

            }

        });

    });

});
// insert data script end 


// update modal script start
let oldData = {};
$(document).on("click", ".edit", function () {
    let row = $(this).closest("tr");
    let id = $(this).data("id");
    let name = row.find("td:eq(1)").text();
    let address = row.find("td:eq(2)").text();
    let phone = row.find("td:eq(3)").text();
    let email = row.find("td:eq(4)").text();
    $("#edit_id").val(id);
    $("#edit_name").val(name);
    $("#edit_address").val(address);
    $("#edit_phone").val(phone);
    $("#edit_email").val(email);
    oldData = { name, address, phone, email };
    $("#editModal").modal("show");
});
function validateEditName() {
    let name = $("#edit_name").val().trim();
    if (name == "") {
        $("#edit_name_error").text("Name is required");
        return false;
    }
    if (name.length < 2) {
        $("#edit_name_error").text("Minimum 2 characters required");
        return false;
    }
    $("#edit_name_error").text("");
    return true;
}
function validateEditAddress() {
    let address = $("#edit_address").val().trim();
    if (address == "") {
        $("#edit_address_error").text("Address is required");
        return false;
    }
    $("#edit_address_error").text("");
    return true;
}
function validateEditPhone() {
    let phone = $("#edit_phone").val().trim();
    let pattern = /^[789][0-9]{9}$/;
    if (phone == "") {
        $("#edit_phone_error").text("Mobile number required");
        return false;
    }
    if (!pattern.test(phone)) {
        $("#edit_phone_error").text("Enter valid mobile number (7/8/9 start)");
        return false;
    }
    $("#edit_phone_error").text("");
    return true;
}
function validateEditEmail() {
    let email = $("#edit_email").val().trim();
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "") {
        $("#edit_email_error").text("Email required (example@gmail.com)");
        return false;
    }
    if (!pattern.test(email)) {
        $("#edit_email_error").text("Enter valid email (example@gmail.com)");
        return false;
    }
    $("#edit_email_error").text("");
    return true;
}
$("#edit_name").keyup(validateEditName);
$("#edit_address").keyup(validateEditAddress);
$("#edit_phone").keyup(validateEditPhone);
$("#edit_email").keyup(validateEditEmail);
$("#editForm").submit(function (e) {
    e.preventDefault();
    let name = $("#edit_name").val().trim();
    let address = $("#edit_address").val().trim();
    let phone = $("#edit_phone").val().trim();
    let email = $("#edit_email").val().trim();
    if (name === oldData.name &&
        address === oldData.address &&
        phone === oldData.phone &&
        email === oldData.email) {
        toastr.info("No changes detected");
        return;
    }
    if (!validateEditName()) {
        $("#edit_name").focus();
        return;
    }

    if (!validateEditAddress()) {
        $("#edit_address").focus();
        return;
    }

    if (!validateEditPhone()) {
        $("#edit_phone").focus();
        return;
    }

    if (!validateEditEmail()) {
        $("#edit_email").focus();
        return;
    }
    $.ajax({
        url: "ajax/update_business.php",
        type: "POST",
        data: $(this).serialize(),
        dataType: "json",
        success: function (res) {
            let row = $("#row_" + res.id);
            row.find("td:eq(1)").text(res.name);
            row.find("td:eq(2)").text(res.address);
            row.find("td:eq(3)").text(res.phone);
            row.find("td:eq(4)").text(res.email);
            $("#editModal").modal("hide");
            toastr.success("Business updated successfully");
        }
    });
});
// update modal script end 

// delete script start 
$(document).on("click", ".delete", function () {
    let id = $(this).data("id");
    let row = $("#row_" + id);
    Swal.fire({
        title: "Are you sure?",
        text: "This business will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "ajax/delete_business.php",
                type: "POST",
                data: { id: id },
                success: function (response) {
                    if (response == "success") {
                        row.remove();
                        Swal.fire(
                            "Deleted!",
                            "Business has been deleted.",
                            "success"
                        );

                    } else {
                        Swal.fire(
                            "Error",
                            "Something went wrong",
                            "error"
                        );
                    }
                }
            });
        }
    });
});
// delete script end


// rating script start 
$(document).ready(function () {
    function initTableRating() {
        $('.rating').each(function () {
            if ($(this).data("raty")) {
                $(this).raty("destroy");
            }
            $(this).raty({
                readOnly: true,
                half: true,
                path: '',
                starOn: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-on.png',
                starOff: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-off.png',
                starHalf: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-half.png',
                score: function () {
                    return $(this).attr("data-score");
                }
            });
        });
    }
    initTableRating();
    $('#userRating').raty({
        half: true,
        path: '',
        starOn: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-on.png',
        starOff: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-off.png',
        starHalf: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-half.png',
        click: function (score) {
            $("#rating_value").val(score);
            $("#rating_error").text("");
        }
    });

    $(document).on("click", ".rate", function () {
        let id = $(this).data("id");
        $("#business_id").val(id);
        $("#ratingModal").modal("show");
    });

    $("#rating_name").keyup(validateRatingName);
    $("#rating_email").keyup(function () {
        validateRatingEmail();
        $("#rating_email_error").text("");
    });

    $("#rating_phone").keyup(function () {
        validateRatingPhone();
        $("#rating_phone_error").text("");
    });


    $("#ratingForm").submit(function (e) {
        e.preventDefault();
        if (!validateRatingName()) {
            $("#rating_name").focus();
            return;
        }

        if (!validateRatingEmail()) {
            $("#rating_email").focus();
            return;
        }

        if (!validateRatingPhone()) {
            $("#rating_phone").focus();
            return;
        }

        if (!validateRatingStars()) {
            return;
        }
        $.ajax({
            url: "ajax/submit_rating.php",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function (res) {

                if (typeof res === "string") {
                    $("#businessTable").prepend(res);
                    initTableRating();   // ⭐ new row stars initialize
                    return;

                }
                
                if (res.status == "email_duplicate") {
                    $("#rating_email_error").text("Email already submitted rating");
                    return;
                }

                if (res.status == "phone_duplicate") {
                    $("#rating_phone_error").text("Phone already submitted rating");
                    return;
                }

                if (res.status == "success") {
                    let row = $("#row_" + res.business_id);
                    let ratingDiv = row.find(".rating");
                    ratingDiv.raty("destroy");
                    ratingDiv.attr("data-score", res.avg_rating);
                    ratingDiv.raty({
                        readOnly: true,
                        half: true,
                        path: '',
                        starOn: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-on.png',
                        starOff: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-off.png',
                        starHalf: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/images/star-half.png',
                        score: res.avg_rating
                    });
                    $("#ratingModal").modal("hide");
                    $("#ratingForm")[0].reset();
                    $('#userRating').raty("set", { score: 0 });
                    toastr.success("Rating submitted successfully");
                }
            },

            error: function () {
                toastr.error("Something went wrong");
            }
        });
    });

    $('#ratingModal').on('hidden.bs.modal', function () {
        $("#ratingForm")[0].reset();
        $('#userRating').raty("set", { score: 0 });
        $(".text-danger").text("");
    });
});

function validateRatingName() {
    let name = $("#rating_name").val().trim();
    if (name == "") {
        $("#rating_name_error").text("Name is required");
        return false;
    }
    if (name.length < 2) {
        $("#rating_name_error").text("Minimum 2 characters required");
        return false;
    }
    $("#rating_name_error").text("");
    return true;

}

function validateRatingEmail() {
    let email = $("#rating_email").val().trim();
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "") {
        $("#rating_email_error").text("Email required (example@gmail.com)");
        return false;
    }
    if (!pattern.test(email)) {
        $("#rating_email_error").text("Enter valid email");
        return false;
    }
    $("#rating_email_error").text("");
    return true;

}

function validateRatingPhone() {
    let phone = $("#rating_phone").val().trim();
    let pattern = /^[789][0-9]{9}$/;
    if (phone == "") {
        $("#rating_phone_error").text("Phone number required");
        return false;
    }
    if (!pattern.test(phone)) {
        $("#rating_phone_error").text("Enter valid 10 digit number starting with 7,8,9");
        return false;
    }
    $("#rating_phone_error").text("");
    return true;

}

function validateRatingStars() {
    let rating = $("#rating_value").val();
    if (rating == "") {
        $("#rating_error").text("Please select rating");
        return false;
    }
    $("#rating_error").text("");
    return true;
}
// rating script end 