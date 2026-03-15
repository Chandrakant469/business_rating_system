<?php include "config/db.php"; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Business Listing</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/raty-js@2.8.0/lib/jquery.raty.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Toastr CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <!-- Toastr JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <!-- sweet alert cdn  -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- jquery raty cdn  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/raty/2.9.0/jquery.raty.js"></script>
</head>
<body>
    <div class="container mt-5">
        <h3>Business Listing & Rating</h3>
        <button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#addModal">Add Business</button>
        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Average Rating</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="businessTable">
                <?php
                $query = $conn->query("SELECT * FROM businesses ORDER BY id DESC");
                while ($row = $query->fetch_assoc()) {
                    $id = $row['id'];
                    $rating = $conn->query("SELECT ROUND(AVG(rating),1) as avg_rating FROM ratings WHERE business_id=$id")->fetch_assoc();
                    $avg = $rating['avg_rating'] ?? 0;
                ?>
                    <tr id="row_<?php echo $id ?>">
                        <td><?php echo $id ?></td>
                        <td><?php echo $row['name'] ?></td>
                        <td><?php echo $row['address'] ?></td>
                        <td><?php echo $row['phone'] ?></td>
                        <td><?php echo $row['email'] ?></td>
                        <td>
                            <div class="rating" data-score="<?php echo $avg ?>"></div>
                        </td>
                        <td>
                            <button class="btn btn-warning edit" data-id="<?php echo $id ?>"> Edit </button>
                            <button class="btn btn-danger delete" data-id="<?php echo $id ?>"> Delete </button>
                            <button class="btn btn-primary rate" data-id="<?php echo $id ?>"> Rate</button>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
    <!-- add modal code start  -->
    <div class="modal fade" id="addModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Business</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addForm">
                        <div class="mb-2">
                            <input type="text" name="name" id="name" class="form-control" placeholder="Business Name">
                            <small class="text-danger error" id="name_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="text" name="address" id="address" class="form-control" placeholder="Address">
                            <small class="text-danger error" id="address_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="text" name="phone" id="phone" class="form-control" placeholder="Phone">
                            <small class="text-danger error" id="phone_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="email" name="email" id="email" class="form-control" placeholder="Email">
                            <small class="text-danger error" id="email_error"></small>
                        </div>
                        <button class="btn btn-success">Save Business</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- add modal code end  -->
    <!-- edit modal code start  -->
    <div class="modal fade" id="editModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Business</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <input type="hidden" id="edit_id" name="id">
                        <div class="mb-2">
                            <input type="text" name="name" id="edit_name" class="form-control" placeholder="Business Name">
                            <small class="text-danger error" id="edit_name_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="text" name="address" id="edit_address" class="form-control" placeholder="Address">
                            <small class="text-danger error" id="edit_address_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="text" name="phone" id="edit_phone" class="form-control" placeholder="Phone">
                            <small class="text-danger error" id="edit_phone_error"></small>
                        </div>

                        <div class="mb-2">
                            <input type="email" name="email" id="edit_email" class="form-control" placeholder="Email">
                            <small class="text-danger error" id="edit_email_error"></small>
                        </div>
                        <button class="btn btn-primary">Update Business</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- edit modal code end  -->
    <!-- Rating Modal Code Start  -->
    <div class="modal fade" id="ratingModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Submit Rating</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="ratingForm">
                        <input type="hidden" name="business_id" id="business_id">
                        <div class="mb-2">
                            <input type="text" name="name" id="rating_name" class="form-control" placeholder="Name">
                            <small class="text-danger" id="rating_name_error"></small>
                        </div>
                        <div class="mb-2">
                            <input type="email" name="email" id="rating_email" class="form-control" placeholder="Email (example@gmail.com)">
                            <small class="text-danger" id="rating_email_error"></small>
                        </div>
                        <div class="mb-2">
                            <input type="text" name="phone" id="rating_phone" class="form-control" placeholder="Phone">
                            <small class="text-danger" id="rating_phone_error"></small>
                        </div>
                        <div class="mb-2">
                            <div id="userRating"></div>
                            <input type="hidden" name="rating" id="rating_value">
                            <small class="text-danger" id="rating_error"></small>
                        </div>
                        <button class="btn btn-primary">Submit Rating</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- rating modal code end -->
    <script src="assets/js/script.js"></script>
    
</body>
</html>