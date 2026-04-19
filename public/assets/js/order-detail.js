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
            data:data,
            columns:[
                {data: null, title: '', defaultContent: '',className: "dt-center", render: function (data) { return editable ? `<input type="checkbox" class="row-check">`: ''; } },
                {data:null,title:'STT',className: "dt-center",render:function(data,type,row,meta){ return meta.row + 1;}},
                {data:'item_CD',title:'Mã SP',className: "dt-center",render:function(data){return editable?`<input class='edit-input item_CD' value="${data || ''}">` : data;}},
                {data:'item_name',title:'Tên SP',className: "dt-center",render:function(data){return editable?`<input class='edit-input item_name' value="${data || ''}">` : data;}},
                {data:'quantity',title:'Số lượng',className: "dt-center",render:function(data){return editable?`<input type="number" class='edit-input quantity' value="${data || ''}">` : data;}},
                {data:'price',title:'Đơn giá',className: "dt-center",render:function(data){return editable?`<input type="number" class='edit-input price' value="${data || ''}">` : data;}},
                {data:null,title:'Thành tiền',className: "dt-center",render:function(data,type,row){return (row.quantity * row.price) || '';}},
            ],
            searching:false,
            language: {
                decimal: "",
                emptyTable: "Không có dữ liệu trong bảng",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu: "Hiển thị _MENU_ dòng",
                loadingRecords:"Đang tải...",
                zeroRecords: "Không tìm thấy dữ liệu phù hợp",
                paginate: {
                    first:"Đầu tiên",
                    last:"Cuối cùng",
                    next:"Sau",
                    previous:"Trước"
                }
            }
            
        });
        table.on('draw.dt',function(){
            table.column(1,{search:'applied',order:'applied'}).nodes().each(function(cell,i){cell.innerHTML=i+1});
        });
    }

     // lưu lại vị trí dòng mà user đang chỉnh sửa trong bảng order
    let currentEditingRow =null;
    $('#PO-table tbody').on('click','tr',function(){
        currentEditingRow=$(this).closest('tr');
    });



    // Fetch Products 
    function fetchProductsForSearch(cb) {
        fetch('/api/products')
            .then(res => res.json())
            .then(result => {
                products = result.data || [];
                cb(products);
            });
    }

    searchTable = $('#searchProductTable').DataTable({
        data: [],
        columns: [
            { data: null, title: 'STT', render: function (data, type, row, meta) { return meta.row + 1; } },
            { data: 'item_name', title: 'Tên sản phẩm' },
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
                    p.item_CD.toLowerCase().includes(keyword) ||
                    p.item_name.toLowerCase().includes(keyword)
                );
            searchTable.clear().rows.add(searchedData).draw();
        });

    });

    // chọn sản phẩm trong popup xong thì tự động hiển thị trong bảng chi tiết
    $('#searchProductTable').on('dblclick','tbody tr',function(){
        let data = searchTable.row(this).data();
        if(!currentEditingRow)return;
        currentEditingRow.find('.item_CD').val(data.item_CD);
        currentEditingRow.find('.item_name').val(data.item_name);
        currentEditingRow.find('.price').val(data.price);
        $('.search-table').fadeOut();
    })

    // hàm tính lại tổng tiền
    function calculateTotalAmount(displayProducts) {
        return displayProducts.reduce((sum, p) => {
        return sum + (p.quantity * p.price);
        }, 0);
    }

    // Hàm cập nhật lại tổng tiền
    function updateTotalAmount() {
        let total = 0;
        $('#PO-table tbody tr').each(function() {
            let quantity = parseFloat($(this).find('.quantity').val()) || 0;
            let price = parseFloat($(this).find('.price').val()) || 0;
            total += (quantity * price);
        });
        $("input[name='net1']").val(total.toLocaleString());
    }

    // hàm cập nhật lại orderproducts mỗi khi user chỉnh sửa thêm xóa dòng
    function updateOrderData (){
        let updatedProducts = [];
        $('#PO-table tbody tr').each(function () {
            updatedProducts.push({
            item_CD: $(this).find('.item_CD').val() || "",
            item_name: $(this).find('.item_name').val() || "",
            quantity: parseFloat($(this).find('.quantity').val()) || 0,
            price: parseFloat($(this).find('.price').val()) || 0
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
            const item_CD = $(this).find('.item_CD').val()?.trim();
            const quantity = parseFloat($(this).find('.quantity').val()) || 0;
            if (!item_CD) return; 
            products.push({
                item_CD,
                quantity,
            });
        });

        return products;
    }

    // hàm lấy thông tin mới nhất từ master sp

    function getProductInfo(orderProducts) {
        return orderProducts.map(o => {
            const sp = products.find(p => p.item_CD === o.item_CD);
            return {
                item_CD: o.item_CD,
                item_name: sp ? sp.item_name : "",
                quantity: o.quantity || 0,
                price: sp ? sp.price : 0
            }
        });
    }

    // hàm kiểm tra ít nhất có 1 dòng trong bảng sản phẩm
    function hasOrderProducts (){
        const products = table.rows().data().toArray();
        if(products.length===0){
            alert('vui lòng nhập ít nhất 1 sản phẩm');
            throw new Error("không có sản phẩm nào");
            
        }
    }

    // hàm khóa các ô input ko cho phép sửa khi trạng thái ko phải là bản nháp
    function lockInputs() {
        $('#PO-table input, #vendor, #PO-person, #PO-date, #addRow, #deleteRow, #saveBtn')
            .prop('disabled', true);
    }

    // kiểm tra order, hiển thị dữ liệu khi mở trang ra
    // if (order) {
    //     $("#PO-person").val(order.handler);
    //     $("#PO-date").val(order.orderDate);
    //     $("#vendor").val(order.vendorName);
    //     $("input[name='net1']").val(order.totalAmount);
        
    //     // nếu trạng thái là bản nháp thì thêm html input và chỉnh sửa dc, và hiển thị 3 nút thêm xóa dòng và nút lưu lại
        
    //     if(order.status==="Bản nháp"){
    //         const displayProducts = getProductInfo(order.orderProducts);
    //         render(displayProducts,true);
    //         const total = calculateTotalAmount(displayProducts);
    //         $("input[name='net1']").val(total.toLocaleString());
    //         $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
    //         $('#confirmStockBtn').hide();
    //     }else if(order.status==="Đã xác nhận") {
    //         render(order.orderProducts,false);
    //         $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').hide();
    //         lockInputs();
    //     }else if(order.status==="Đã nhập kho"){
    //         render(order.orderProducts,false);
    //         $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn,#confirmStockBtn').hide();
    //         lockInputs();
    //     }
    // }
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
                { item_CD: '', item_name: '', quantity: '', price: '' },
                { item_CD: '', item_name: '', quantity: '', price: '' },
                { item_CD: '', item_name: '', quantity: '', price: '' }
            ];
            render(blankRows, true);
            $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
            return;
        }
        fetch(`/api/orders/${orderNo}`)
            .then(res => res.json())
            .then(result => {
                order = result.data;
                if (!order) return;
                $("#PO-person").val(order.handler);
                $("#PO-date").val(order.orderDate);
                $("#vendor").val(order.vendorName);
                $("input[name='net1']").val(order.totalAmount);
                if (order.status === "Bản nháp") {
                    const displayProducts = getProductInfo(order.orderProducts);
                    render(displayProducts, true);
                    const total = calculateTotalAmount(displayProducts);
                    $("input[name='net1']").val(total.toLocaleString());
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
                    $('#confirmStockBtn').hide();
                } else if (order.status === "Đã xác nhận") {
                    render(order.orderProducts, false);
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').hide();
                    lockInputs();
                } else if (order.status === "Đã nhập kho") {
                    render(order.orderProducts, false);
                    $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn,#confirmStockBtn').hide();
                    lockInputs();
                }
            });
    }

    fetchProductsForSearch(function (data) {
        products = data;
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
        { item_CD: '', item_name: '', quantity: '', price: '' },
        { item_CD: '', item_name: '', quantity: '', price: '' },
        { item_CD: '', item_name: '', quantity: '', price: '' }
        ];

        render(blankRows,true);
        $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
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
        { item_CD: '', item_name: '', quantity: '', price: '' },
        { item_CD: '', item_name: '', quantity: '', price: '' },
        { item_CD: '', item_name: '', quantity: '', price: '' }
        ];

        render(blankRows,true);
        $('#addRow,#deleteRow,#saveBtn,#confirmOrderBtn').show();
    }

    

    // bản nháp, user chỉnh sửa ô input
    $("#PO-table").on('input','.edit-input',function(){
        let $tr = $(this).closest('tr');
        let quantity = parseFloat($tr.find('.quantity').val()) || 0;
        let price = parseFloat($tr.find('.price').val()) || 0;

    // tính lại thành tiền của dòng
        let rowTotal = quantity * price;
        $tr.find('td').eq(6).text(rowTotal.toLocaleString());


    // cap nhat lai tong tien khi user thay doi SL hoac don gia
        updateTotalAmount();
        updateOrderData();
    });
    
    $('#addRow').on('click', function() {
        table.row.add({
            item_CD: '',
            item_name: '',
            quantity: '',
            price: ''
        }).draw(false);
        updateTotalAmount();
        updateOrderData();
    });

    // Xóa dòng đã chọn
    $('#deleteRow').on('click', function() {
    let rowCheck = $('.row-check:checked');

    if (rowCheck.length > 0) {
        table.rows(rowCheck.closest('tr')).remove().draw();
    } else {
        let lastRow = table.row(':last');
        if (lastRow.node()) {
            lastRow.remove();
            table.rows().draw(); 
        }
    }
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
            alert('Vui lòng nhập tên nhà cung cấp.');
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

        const orderData = {
            vendorName: vendorName,
            orderDate: orderDate,
            handler: handler,
            totalAmount: parseFloat($("input[name='net1']").val().replace(/,/g, '')) || 0,
            status: "Bản nháp",
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
                $('#PO-table input').prop('disabled', true);
                $('#confirmStockBtn').show();
            } else {
                alert(result.message || 'Lỗi khi xác nhận đơn hàng');
            }
        } catch (err) {
            alert('Lỗi kết nối server');
        }
    });

// xử lý khi ấn nút đã nhập kho
//     $('#confirmStockBtn').on('click', function () {

//     // LẤY DỮ LIỆU TỪ BẢNG
//     const products = table.rows().data().toArray();

//     if (!products || products.length === 0) {
//         alert("Không có sản phẩm để nhập kho");
//         return;
//     }

//     let stockData = JSON.parse(localStorage.getItem("stockData")) || [];

//     products.forEach(p => {
//         if (!p.item_CD || p.quantity <= 0) return; 
//         let prod = stockData.find(x => x.item_CD === p.item_CD);

//         if (prod) {
//             prod.stock += Number(p.quantity);
//         } else {
//             stockData.push({
//                 item_CD: p.item_CD,
//                 item_name: p.item_name,
//                 stock: Number(p.quantity)
//             });
//         }
//     });

//     localStorage.setItem("stockData", JSON.stringify(stockData));
//     // CHỐT dữ liệu sản phẩm ,ko lấy lại từ master nữa
//     order.orderProducts = table.rows().data().toArray().map(p => ({
//         item_CD: p.item_CD,
//         item_name: p.item_name,
//         quantity: p.quantity,
//         price: p.price
//     }));

//     // cập nhật trạng thái đơn
//     order.status = "Đã nhập kho";

//     let orders = JSON.parse(localStorage.getItem("orders")) || [];
//     let index = orders.findIndex(o => o.orderNo === order.orderNo);
//     if (index !== -1) orders[index] = order;

//     localStorage.setItem("orders", JSON.stringify(orders));

//     alert(`Đơn hàng ${order.orderNo} đã được nhập kho`);

//     $('#PO-table input').prop('disabled', true);
//     $('#addRow, #deleteRow, #saveBtn, #confirmStockBtn').hide();
// });

    // Xác nhận nhập kho
    $('#confirmStockBtn').on('click', async function () {
        const products = table.rows().data().toArray();
        if (!products || products.length === 0) {
            alert("Không có sản phẩm để nhập kho");
            return;
        }
        try {
            const response = await fetch(`/api/orders/${orderNo}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products })
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Đơn hàng ${orderNo} đã được nhập kho`);
                $('#PO-table input').prop('disabled', true);
                $('#addRow, #deleteRow, #saveBtn, #confirmStockBtn').hide();
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
        if(!localStorage.getItem("stockData")){
            localStorage.setItem("stockData",JSON.stringify(stockData));
        }

        const stock = JSON.parse(localStorage.getItem("stockData")); 

        if (!stock || stock.length === 0) {
            alert("Tồn kho không có dữ liệu!");
            return;
        }

        // Nếu có dữ liệu thì chuyển đến màn hình stock
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
        window.location.href = "/login";
    });
    
});