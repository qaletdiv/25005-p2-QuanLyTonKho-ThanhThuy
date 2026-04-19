$(function(){
    let table;
    function render(data) {
        if ($.fn.DataTable.isDataTable('#PO-table')) {
            $('#PO-table').DataTable().clear().destroy();
        }
        table = $('#PO-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT' },
                { data: 'orderNo', title: 'Mã đơn hàng' },
                { data: 'vendorName', title: 'Tên NCC' },
                { data: 'orderDate', title: 'Ngày mua hàng' },
                { data: 'handler', title: 'Nhân viên phụ trách' },
                { data: 'totalAmount', title: 'Tổng tiền' },
                { data: 'status', title: 'Trạng thái' }
            ],
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
            ],
            createdRow: function (row, rowData, dataIndex) {
                $(row).attr('data-order-no', rowData.orderNo)
            },
            searching: false,
            language: {
                decimal: "",
                emptyTable: "Không có dữ liệu trong bảng",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu: "Hiển thị _MENU_ dòng",
                loadingRecords: "Đang tải...",
                zeroRecords: "Không tìm thấy dữ liệu phù hợp",
                paginate: {
                    first: "Đầu tiên",
                    last: "Cuối cùng",
                    next: "Sau",
                    previous: "Trước"
                }
            }
        });
        table.on('draw.dt', function () {
            table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) { cell.innerHTML = i + 1 });
        });
    }

    function fetchOrders(keyword = "") {
        let url = '/api/orders';
        if (keyword) {
            url += `?search=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => res.json())
            .then(result => {
                render(result.data || []);
            })
            .catch(() => {
                render([]);
            });
    }

    fetchOrders();


    // Nút tạo mới
    $("#btn-create").on("click", function () {
        window.open("/order-detail?mode=new", "_blank");
    });


    // Nút tìm kiếm
    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim().toLowerCase();
        let url = `/orders-list/search?orderNo=${encodeURIComponent(keyword)}&vendorName=${encodeURIComponent(keyword)}`;
        fetch(url)
        .then(res => res.json())
        .then(result => {
            render(result.data)
        })
        //let filtered = ordersData.filter(o =>
            //o.orderNo.toLowerCase().includes(keyword) || o.vendorName.toLowerCase().includes(keyword)
        //);
        //render(filtered);
    });


    // ấn nút enter trên bàn phím cũng tìm
    $("#search-input").on("keypress", function (event) {
        if (event.which === 13) $("#btn-search").click();
    });



    $('#PO-table').on('click', 'tbody tr', function () {
        let orderNo = $(this).data('order-no');
        window.location.href = `/order-detail?orderNo=${orderNo}`;
    });

    // nút ẩn hiện menu js
    $(".toggle-btn").click(function () {
        $(".sidebar-wrap").slideToggle(300);
    });

    // dropdown khi click nút User
    $(".user-btn").click(function (event) {
        event.stopPropagation();
        $(".user-dropdown-content").toggle();
    });

    $(document).click(function () {
        $(".user-dropdown-content").hide();
    });

    // Menu chuyển hướng
    $("#menu-stock").on("click", function (e) {
        e.preventDefault();
        window.location.href = "/stock";
    });

    $('#products-list').on('click', function () {
        window.location.href = "/products-list";
    });
    $('#product-detail').on('click', function () {
        window.location.href = "/product-detail";
    });

    //logout
    $("#logout").click(function (e) {
        e.preventDefault();   
        localStorage.setItem('isLogined','false');
        window.location.href = "/login"; 
    });

});