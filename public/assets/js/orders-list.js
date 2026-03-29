$(function(){
    if(localStorage.getItem("isLogined") !== "true"){
        window.location.href = "login.html";
        return;
    }
    if(!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify(products));}
    let table;
    function render (data){
        if ($.fn.DataTable.isDataTable('#PO-table')) {
            $('#PO-table').DataTable().clear().destroy();
        }

        table=$('#PO-table').DataTable({
            data:data,
            columns:[
                {data:null,title:'STT'},
                {data:'orderNo',title:'Mã đơn hàng'},
                {data:'vendorName',title:'Tên NCC'},
                {data:'orderDate',title:'Ngày mua hàng'},
                {data:'handler',title:'Nhân viên phụ trách'},
                {data:'totalAmount',title:'Tổng tiền'},
                {data:'status',title:'Trạng thái'}
            ],
            columnDefs:[
                {
                    targets:0,
                    render:function(data,type,row,meta){
                        return meta.row + 1;
                    }
                },
            ],
            createdRow:function(row,rowData,dataIndex){
                $(row).attr('data-order-no',rowData.orderNo)
            },
            searching:false,
            language: {
                decimal: "",
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
        table.on('draw.dt',function(){
            table.column(0,{search:'applied',order:'applied'}).nodes().each(function(cell,i){cell.innerHTML=i+1});
        });
    }

    if(!localStorage.getItem("orders")){ 
        localStorage.setItem("orders", JSON.stringify(orders))}; 
    let ordersData = JSON.parse(localStorage.getItem("orders"));
    render(ordersData);

    // Nút tạo mới
    $("#btn-create").on("click", function(){
        window.open("order-detail.html?mode=new", "_blank");
    });

    // Nút tìm kiếm
    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim().toLowerCase();
        let filtered = ordersData.filter(o =>
            o.orderNo.toLowerCase().includes(keyword) || o.vendorName.toLowerCase().includes(keyword)
        );
        render(filtered);
    });

    // ấn nút enter trên bàn phím cũng tìm
    $("#search-input").on("keypress", function(event){
        if(event.which === 13) $("#btn-search").click();
    });


    $('#PO-table').on('click', 'tbody tr', function () {
        let orderNo = $(this).data('order-no');
        window.location.href = `order-detail.html?orderNo=${orderNo}`;
    });

    // nút ẩn hiện menu js
    $(".toggle-btn").click(function(){
        // $(".sidebar-wrap").toggleClass("show");
        $(".sidebar-wrap").slideToggle(300);
    });


    // dropdown khi click nút User
    $(".user-btn").click(function(event){
        event.stopPropagation(); 
        $(".user-dropdown-content").toggle();
    });

    $(document).click(function(){
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

        // Nếu có dữ liệu thì chuyển đến màn hình stock.html
        window.location.href = "stock.html";
    });
    
    $('#products-list').on('click',function(){
        window.location.href = "products-list.html";
    });
    $('#product-detail').on('click',function(){
        window.location.href = "product-detail.html";
    });

    //logout
    $("#logout").click(function (e) {
        e.preventDefault();   
        localStorage.setItem('isLogined','false');
        window.location.href = "login.html"; 
    });
    

});