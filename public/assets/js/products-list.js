$(function(){
    if(localStorage.getItem("isLogined") !== "true"){
        window.location.href = "login.html";
        return;
    }
    let table;

    // Hàm render bảng sản phẩm
    function renderProducts(data){
        if ($.fn.DataTable.isDataTable('#products-table')) {
            $('#products-table').DataTable().clear().destroy();
        }

        table = $('#products-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT' },
                { data: 'item_CD', title: 'Mã SP' },
                { data: 'item_name', title: 'Tên sản phẩm' },
                { data: 'unit', title: 'Đơn vị' },
                { data: 'price', title: 'Đơn giá' }
            ],
            columnDefs: [
                {
                    targets: 0,
                    render: function(data,type,row,meta){
                        return meta.row + 1;
                    }
                },
                {
                    targets: 4,
                    render: function(data){
                        return data.toLocaleString();
                    }
                }
            ],
            createdRow: function(row,rowData){
                $(row).attr('data-product-code', rowData.item_CD);
            },
            searching: false,
            language: {
                emptyTable: "Không có dữ liệu trong bảng",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu:"Hiển thị _MENU_ dòng",
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
    }

    // Lấy dữ liệu products vào localStorage nếu chưa có
    if(!localStorage.getItem("products")){
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Lấy dữ liệu products từ localStorage
    let productsData = JSON.parse(localStorage.getItem("products"));
    renderProducts(productsData);

    // Tìm kiếm
    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim().toLowerCase();
        let filtered = productsData.filter(p =>
            p.item_CD.toLowerCase().includes(keyword) ||
            p.item_name.toLowerCase().includes(keyword)
        );
        renderProducts(filtered);
    });

    $("#search-input").on("keypress", function(e){
        if(e.which === 13) $("#btn-search").click();
    });

    // Click dòng mở chi tiết
    $('#products-table').on('click', 'tbody tr', function(){
        let productCode = $(this).data('product-code');
        window.location.href = `product-detail.html?productCode=${productCode}`;
    });

    // nút tạo mới
    $("#btn-create").on("click", function () {
    window.location.href = "product-detail.html";
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

        // Nếu có dữ liệu thì chuyển đến màn hình stock.html
        window.location.href = "stock.html";
    });
    
    $('#products-list').on('click',function(){
        window.location.href = "products-list.html";
    });
    $('#product-detail').on('click',function(){
        window.location.href = "product-detail.html";
    });

    $(".user-btn").click(function(event){
        event.stopPropagation();
        $(".user-dropdown-content").toggle();
    });

     //logout
    $("#logout").click(function (e) {
        e.preventDefault();   
        localStorage.setItem('isLogined','false');
        window.location.href = "login.html"; 
    });
    

    // Toggle sidebar
    $(".toggle-btn").click(function(){
        $(".sidebar-wrap").slideToggle(300);
    });
    

});