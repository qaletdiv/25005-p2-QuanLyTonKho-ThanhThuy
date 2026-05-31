$(function(){
    let table;
    // Hàm render sản phẩm lên bảng
    function renderProducts(data){
        if ($.fn.DataTable.isDataTable('#products-table')) {
            $('#products-table').DataTable().clear().destroy();
        }
        table = $('#products-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT', render: function(data,type,row,meta){ return meta.row + 1; } },
                { data: 'itemCode', title: 'Mã SP' },
                { data: 'itemName', title: 'Tên sản phẩm' },
                { data: 'unit', title: 'Đơn vị' },
                { data: 'price', title: 'Đơn giá', render: function(data){ return Number(data).toLocaleString(); } }
            ],
            createdRow: function(row, rowData){
                $(row).attr('data-product-code', rowData.itemCode);
            },
            searching: false,
            language: {
                emptyTable: "Không có dữ liệu trong bảng",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu: "Hiển thị _MENU_ dòng",
                loadingRecords: "Đang tải...",
                zeroRecords: "Không tìm thấy dữ liệu phù hợp",
                paginate: { first:"Đầu tiên", last:"Cuối cùng", next:"Sau", previous:"Trước" }
            }
        });
    }

    function fetchProducts(keyword){
        let url = '/api/products';
        if (keyword) url += '?search=' + encodeURIComponent(keyword);
        fetch(url)
            .then(res => res.json())
            .then(result => { renderProducts(result.data || []); })
            .catch(() => { renderProducts([]); });
    }

    fetchProducts();

    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim();
        fetchProducts(keyword);
    });

    $("#search-input").on("keypress", function(e){
        if(e.which === 13) $("#btn-search").click();
    });

    // Click dòng mở chi tiết để sửa
    $('#products-table').on('click', 'tbody tr', function(){
        let productCode = $(this).data('product-code');
        if (productCode) {
            window.location.href = '/product-detail?productCode=' + encodeURIComponent(productCode);
        }
    });

    // Nút tạo mới
    $("#btn-create").on("click", function(){
        window.location.href = "/product-detail?mode=new";
    });

    // Toggle sidebar
    $(".toggle-btn").click(function(){ $(".sidebar-wrap").slideToggle(300); });
    $(".user-btn").click(function(event){ event.stopPropagation(); $(".user-dropdown-content").toggle(); });
    $(document).click(function(){ $(".user-dropdown-content").hide(); });
    $("#logout").click(function(e){ e.preventDefault(); fetch('/logout').then(()=>window.location.href='/login'); });
});