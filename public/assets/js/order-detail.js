function fetchProductsForSearch(callback) {
    fetch('/api/products')
        .then(res => res.json())
        .then(result => {
            products = result.data || [];
            callback(products);
        });
}

$(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const orderNo = urlParams.get("orderNo");
    let mode = urlParams.get("mode");
    //const orders = JSON.parse(localStorage.getItem("orders")) || [] ;
    //let order = orders.find(o => o.orderNo === orderNo);
    // products
    
    let order = null;
    let products = [];
    let table;
    let searchTable;

    // hàm render bảng PO-table
    function render (data,editable){
        if ($.fn.DataTable.isDataTable('#PO-table')) {
            $('#PO-table').DataTable().clear().destroy();
        }

        table = $('#PO-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT', className: "dt-center", render: function (data, type, row, meta) { return meta.row + 1; } },
                { data: 'itemCode', title: 'Mã SP', className: "dt-center", render: function (data) { return editable ? `<input class='edit-input itemCode' value="${data || ''}">` : data; } },
                { data: 'itemName', title: 'Tên SP', className: "dt-center", render: function (data) { return editable ? `<input class='edit-input itemName' value="${data || ''}">` : data; } },
                { data: 'quantity', title: 'Số lượng', className: "dt-center", render: function (data) { return editable ? `<input type="number" class='edit-input quantity' value="${data || ''}">` : data; } },
                { data: 'unitPrice', title: 'Đơn giá', className: "dt-center", render: function (data) { return editable ? `<input type="number" class='edit-input unitPrice' value="${data || ''}">` : data; } },
                { data: null, title: 'Thành tiền', className: "dt-center", render: function (data, type, row) { return (row.quantity * row.unitPrice) || ''; } },
            ],
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

     // lưu lại vị trí dòng mà user đang chỉnh sửa trong bảng order
    let currentEditingRow = null;
    $('#PO-table tbody').on('click', 'tr', function(){
        $('#PO-table tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
        currentEditingRow = $(this);
    });

    searchTable = $('#searchProductTable').DataTable({
        data: [],
        columns: [
            { data: null, title: 'STT', render: function (data, type, row, meta) { return meta.row + 1; } },
            { data: 'itemName', title: 'Tên sản phẩm' },
            { data: 'unit', title: 'Đơn vị' },
            { data: 'price', title: 'Đơn giá' }
        ],
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
        },
        searching: false,
        info: false,
        paging: true
    });


    $('#productSearch').on('click', function () {
        if (!currentEditingRow) return;
        $('#searchProductInput').val("");
        //const productsData = JSON.parse(localStorage.getItem("products")) || [];
        //searchTable.clear().rows.add(productsData).draw();
        //$('.search-table').fadeIn();
     
        fetchProductsForSearch(function (productsData) {
            searchTable.clear().rows.add(productsData).draw();
            $('.search-table').fadeIn();
        });
    });

    $('#btn-close-popup').on('click',function(){
        $('.search-table').fadeOut();
    });

    // khi user an nut hien thi ket qua trong popup
    // $('#btn-show-products').on('click',function(){
    //     if(!localStorage.getItem("products")) {
    //         localStorage.setItem("products", JSON.stringify(products));}
    //     const productsData = JSON.parse(localStorage.getItem("products"));
        
    //     let keyword = $('#searchProductInput').val().trim().toLowerCase();
    //     let searchedData=(keyword==="")
    //         ?productsData
    //         :productsData.filter(p=>
    //             p.item_CD.toLowerCase().includes(keyword)||
    //             p.item_name.toLowerCase().includes(keyword)
    //     );
    //     searchTable.clear().rows.add(searchedData).draw();
        
    // });

    // khi user an nut hien thi ket qua trong popup
    $('#btn-show-products').on('click', function () {
        let keyword = $('#searchProductInput').val().trim().toLowerCase();
        fetchProductsForSearch(function (productsData) {
            let searchedData = (keyword === "")
                ? productsData
                : productsData.filter(p =>
                    p.itemCode.toLowerCase().includes(keyword) ||
                    p.itemName.toLowerCase().includes(keyword)
                );
            searchTable.clear().rows.add(searchedData).draw();
        });
    });

    // chọn sản phẩm trong popup xong thì tự động hiển thị trong bảng chi tiết
    $('#searchProductTable').on('dblclick','tbody tr',function(){
        let data = searchTable.row(this).data();
        if(!currentEditingRow)return;
        currentEditingRow.find('.itemCode').val(data.itemCode);
        currentEditingRow.find('.itemName').val(data.itemName);
        currentEditingRow.find('.unitPrice').val(data.price);
        $('.search-table').fadeOut();
    })

    // hàm tính lại tổng tiền
    function calculateTotalAmount(displayProducts) {
        return displayProducts.reduce((sum, p) => {
        return sum + ((p.quantity || 0) * (p.unitPrice || 0));
        }, 0);
    }

    // Hàm cập nhật lại tổng tiền
    function updateTotalAmount() {
        let total = 0;
        $('#PO-table tbody tr').each(function() {
            let quantity = parseFloat($(this).find('.quantity').val()) || 0;
            let price = parseFloat($(this).find('.unitPrice').val()) || 0;
            total += (quantity * price);
        });
        $("input[name='net1']").val(total.toLocaleString());
    }

    // hàm cập nhật lại orderproducts mỗi khi user chỉnh sửa thêm xóa dòng
    function updateOrderData (){
        let updatedProducts = [];
        $('#PO-table tbody tr').each(function () {
            const itemCode = $(this).find('.itemCode').val()?.trim();
            if (!itemCode) return; 
            updatedProducts.push({
                itemCode,
                itemName: $(this).find('.itemName').val() || "",
                quantity: parseFloat($(this).find('.quantity').val()) || 0,
                unitPrice: parseFloat($(this).find('.unitPrice').val()) || 0
            });
        });

        if(order){
            order.orderProducts = updatedProducts;
            order.totalAmount = parseFloat($("input[name='net1']").val().replace(/,/g, '')) || 0;
        }
    }

    // hàm lấy thông tin sp từ bảng từ DOM
    function getOrderProductsFromTable() {
        const products = [];

        $('#PO-table tbody tr').each(function () {
            const itemCode = $(this).find('.itemCode').val()?.trim();
            if (!itemCode) return; 
            const quantity = parseFloat($(this).find('.quantity').val()) || 0;
            products.push({
                itemCode,
                quantity,
            });
        });

        return products;
    }

    // hàm lấy thông tin mới nhất từ master sp

    function getProductInfo(orderProducts) {
        return orderProducts.map(o => {
            const sp = products.find(p => p.itemCode === o.itemCode);
            return {
                itemCode: o.itemCode,
                itemName: sp ? sp.itemName : "",
                quantity: o.quantity || 0,
                unitPrice: sp ? sp.price : 0
            }
        });
    }

    // hàm kiểm tra ít nhất có 1 dòng trong bảng sản phẩm
    function hasOrderProducts (){
        const validProducts = getOrderProductsFromTable();
        if(validProducts.length === 0){
            alert('Vui lòng nhập ít nhất 1 sản phẩm.');
            throw new Error("không có sản phẩm nào");
        }
    }

    // hàm khóa các ô input ko cho phép sửa khi trạng thái ko phải là bản nháp
    function lockInputs() {
        $('#PO-table input, #vendor, #PO-person, #PO-date, #addRow, #deleteRow, #saveBtn')
            .prop('disabled', true);
    }

        // Load order detail khi mở trang
    function loadOrderDetail() {
        if (!orderNo) {
            // New order
            $('#vendor').val('');
            $('#PO-person').val('');
            $('#PO-date').val('');
            $("input[name='net1']").val('');
            $("textarea[name='note1']").val('');
            const blankRows = [
                { itemCode: '', itemName: '', quantity: '', unitPrice: '' },
                { itemCode: '', itemName: '', quantity: '', unitPrice: '' },
                { itemCode: '', itemName: '', quantity: '', unitPrice: '' }
            ];
            render(blankRows, true);
            $('#addRow,#deleteRow,#saveBtn').show();
            $('#confirmOrderBtn,#confirmStockBtn').hide();
            return;
        }
        fetch(`/api/orders/${orderNo}`)
            .then(res => res.json())
            .then(result => {
                if (!result.success || !result.data) return;
                order = result.data;
                $("#PO-person").val(order.handler);
                // Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
                if (order.orderDate) {
                    const parts = order.orderDate.split('-');
                    if (parts.length === 3) {
                        $("#PO-date").val(parts[2] + '/' + parts[1] + '/' + parts[0]);
                    } else {
                        $("#PO-date").val(order.orderDate);
                    }
                }
                $("#vendor").val(order.vendorName);
                $("input[name='net1']").val(Number(order.totalAmount).toLocaleString());
                $("textarea[name='note1']").val(order.note || '');
                if (order.status === "Bản nháp") {
                    render(order.orderProducts, true);
                    const total = calculateTotalAmount(order.orderProducts);
                    $("input[name='net1']").val(total.toLocaleString());
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
                    $('#confirmStockBtn').hide();
                } else if (order.status === "Đã xác nhận") {
                    render(order.orderProducts, false);
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').hide();
                    if (USER_ROLE === 'admin' || USER_ROLE === 'nhanvienkho') {
                        $('#confirmStockBtn').show();
                    } else {
                        $('#confirmStockBtn').hide();
                    }
                    lockInputs();
                } else if (order.status === "Đã nhập kho") {
                    render(order.orderProducts, false);
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn,#confirmStockBtn').hide();
                    lockInputs();
                }
            });
    }

    // hàm load danh sách nhà cung cấp vào dropdown
    function loadVendors() {
        fetch('/api/vendors')
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const select = $('#vendor');
                    select.find('option:not(:first)').remove();
                    result.data.forEach(v => {
                        select.append(`<option value="${v.vendorName}">${v.vendorName}</option>`);
                    });
                }
            });
    }

    loadVendors();

    fetchProductsForSearch(function (data) {
        //products = data;
        loadOrderDetail();
    });

    // user ấn nút tạo mới trong trang để tạo thêm đơn hàng mới mà ko cần ấn menu
    $('#createNewBtn').on('click', function() {
        $('#vendor').val('');
        order = null;
        mode = "new";
        $('#PO-person').val('');
        $('#PO-date').val('');
        $("input[name='net1']").val('');
        $("textarea[name='note1']").val('');

        const blankRows = [
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 },
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 },
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 }
        ];

        render(blankRows,true);
        $('#addRow,#deleteRow,#saveBtn').show();
        $('#confirmOrderBtn,#confirmStockBtn').hide();
        const newUrl = window.location.pathname + "?mode=new";
        window.history.replaceState({}, '', newUrl);
    });
    
    
  // ấn nút mở trang tại sidemenu thì mở màn hình có sẵn bảng ở dạng tạo mới để user nhập liệu
    if(mode === "new"){
        $('#vendor').val('');
        $('#PO-person').val('');
        $('#PO-date').val('');
        $("input[name='net1']").val('');
        $("textarea[name='note1']").val('');

        const blankRows = [
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 },
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 },
        { itemCode: '', itemName: '', quantity: 0, unitPrice: 0 }
        ];

        render(blankRows,true);
        $('#addRow,#deleteRow,#saveBtn').show();
        $('#confirmOrderBtn,#confirmStockBtn').hide();
    }

    

    // bản nháp, user chỉnh sửa ô input
    $("#PO-table").on('input','.edit-input',function(){
        let $tr = $(this).closest('tr');
        let quantity = parseFloat($tr.find('.quantity').val()) || 0;
        let price = parseFloat($tr.find('.unitPrice').val()) || 0;

    // tính lại thành tiền của dòng
        let rowTotal = quantity * price;
        $tr.find('td').eq(6).text(rowTotal.toLocaleString());


    // cap nhat lai tong tien khi user thay doi SL hoac don gia
        updateTotalAmount();
        updateOrderData();
    });
    
    $('#addRow').on('click', function() {
        table.row.add({
            itemCode: '',
            itemName: '',
            quantity: 0,
            unitPrice: 0
        }).draw(false);
        updateTotalAmount();
        updateOrderData();
    });

    // Xóa dòng đang chọn 
    $('#deleteRow').on('click', function() {
        if (!currentEditingRow) {
            alert('Vui lòng click chọn dòng cần xóa.');
            return;
        }
        table.row(currentEditingRow).remove().draw();
        currentEditingRow = null;
        updateTotalAmount();
        updateOrderData();
    });


    // Xử lý khi nhấn nút Lưu (tạo mới hoặc cập nhật bản nháp)
    $('#saveBtn').on('click', async function() {
        updateOrderData();
        try {
            hasOrderProducts();
        } catch (error) {
            return;
        }

        let vendorName = $('#vendor').val().trim();
        let orderDate = $('#PO-date').val().trim();
        let handler = $('#PO-person').val().trim();

        if (!vendorName) {
            alert('Vui lòng chọn nhà cung cấp.');
            $('#vendor').focus();
            return;
        }
        if (!orderDate) {
            alert('Vui lòng nhập ngày đặt hàng.');
            $('#PO-date').focus();
            return;
        }
        if (!handler) {
            alert('Vui lòng nhập người phụ trách.');
            $('#PO-person').focus();
            return;
        }

        // chuyen dinh dang DD/MM/YYYY sang YYYY-MM-DD
        let orderDate_ = orderDate;
        const dateParts = orderDate.split('/');
        if (dateParts.length === 3) {
            orderDate_ = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
        }

        const orderData = {
            vendorName: vendorName,
            orderDate: orderDate_,
            handler: handler,
            totalAmount: parseFloat($("input[name='net1']").val().replace(/,/g, '')) || 0,
            status: "Bản nháp",
            note: $("textarea[name='note1']").val() || '',
            orderProducts: getOrderProductsFromTable()
        };

        try {
            let response;
            if (!order || mode === "new") {
                // Tạo mới
                response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
            } else {
                // Cập nhật
                response = await fetch(`/api/orders/${order.orderNo}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
            }

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                order = result.data;
                const newUrl = window.location.pathname + `?orderNo=${order.orderNo}`;
                window.history.replaceState({}, '', newUrl);
                // Sau khi lưu: hiện nút Xác nhận đơn hàng, ẩn confirmStockBtn
                $('#confirmOrderBtn').show();
                $('#confirmStockBtn').hide();
            } else {
                alert(result.message || 'Lỗi khi lưu đơn hàng');
            }
        } catch (err) {
            alert('Lỗi kết nối server');
        }
    });

    // xử lý khi ấn nút xác nhận đơn hàng
    $('#confirmOrderBtn').on('click', async function() {
        updateOrderData();

        // kiểm tra có sản phẩm chưa
        try {
            hasOrderProducts();
        } catch (err) {
            return;
        }

        if (!order) {
            alert('Vui lòng lưu đơn hàng trước khi xác nhận');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${order.orderNo}/confirm`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Đơn hàng ${order.orderNo} đã được xác nhận.`);
                order.status = "Đã xác nhận";
                // khóa các ô input và bảng sản phẩm
                $('#saveBtn, #addRow, #deleteRow, #confirmOrderBtn').prop('disabled', true);
                $('#confirmOrderBtn, #saveBtn').hide();
                $('#PO-table input').prop('disabled', true);
                if (USER_ROLE === 'admin' || USER_ROLE === 'nhanvienkho') {
                    $('#confirmStockBtn').show();
                }
            } else {
                alert(result.message || 'Lỗi khi xác nhận đơn hàng');
            }
        } catch (err) {
            alert('Lỗi kết nối server');
        }
    });

    // Xác nhận nhập kho
    $('#confirmStockBtn').on('click', async function () {
        const products = table.rows().data().toArray();
        if (!products || products.length === 0) {
            alert("Không có sản phẩm để nhập kho");
            return;
        }
        try {
            const response = await fetch(`/api/orders/${order.orderNo}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products })
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Đơn hàng ${order.orderNo} đã được nhập kho`);
                $('#PO-table input').prop('disabled', true);
                $('#addRow,#deleteRow,#saveBtn,#confirmStockBtn,#confirmOrderBtn').hide();
                lockInputs();
            } else {
                alert(result.message || 'Lỗi khi nhập kho');
            }
        } catch (err) {
            alert('Lỗi kết nối server');
        }
    });
    

    // nút ẩn hiện menu js
    $(".toggle-btn").click(function () {
        $(".sidebar-wrap").slideToggle(300);
    });

    // chọn ngày tháng calendar
    $("#PO-date").datepicker({
        dateFormat: "dd/mm/yy"
    });

    // dropdown khi click nút User
    $(".user-btn").click(function (event) {
        event.stopPropagation();
        $(".user-dropdown-content").toggle();
    });

    $(document).click(function () {
        $(".user-dropdown-content").hide();
    });

    $("#menu-stock").on("click", function (e) {
        e.preventDefault();
        window.location.href = "/stock";
    });
    
    $('#products-list').on('click',function(){
        window.location.href = "/products-list";
    });
    $('#product-detail').on('click',function(){
        window.location.href = "/product-detail";
    });

     //logout
    $("#logout").click(function (e) {
        e.preventDefault();
        fetch('/logout').then(()=>window.location.href='/login');
    });
    
});