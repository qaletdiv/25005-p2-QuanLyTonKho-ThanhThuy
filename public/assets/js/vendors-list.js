$(function(){
    let table;

    function renderVendors(data) {
        if ($.fn.DataTable.isDataTable('#vendors-table')) {
            $('#vendors-table').DataTable().clear().destroy();
        }
        table = $('#vendors-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT', render: function(data,type,row,meta){ return meta.row + 1; } },
                { data: 'vendorName', title: 'Tên nhà cung cấp' },
                { data: 'address', title: 'Địa chỉ' }
            ],
            createdRow: function(row, rowData) {
                $(row).attr('data-vendor-id', rowData.id);
            },
            searching: false,
            language: {
                emptyTable: "Không có dữ liệu",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu: "Hiển thị _MENU_ dòng",
                loadingRecords: "Đang tải...",
                zeroRecords: "Không tìm thấy dữ liệu phù hợp",
                paginate: { first:"Đầu tiên", last:"Cuối cùng", next:"Sau", previous:"Trước" }
            }
        });
    }

    function fetchVendors(keyword) {
        let url = '/api/vendors';
        if (keyword) url += '?search=' + encodeURIComponent(keyword);
        fetch(url)
            .then(res => res.json())
            .then(result => { renderVendors(result.data || []); })
            .catch(() => { renderVendors([]); });
    }

    fetchVendors();

    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim();
        fetchVendors(keyword);
    });

    $("#search-input").on("keypress", function(e){
        if(e.which === 13) $("#btn-search").click();
    });

    // Double click dòng mở chi tiết để sửa
    $('#vendors-table').on('dblclick', 'tbody tr', function(){
        let vendorId = $(this).data('vendor-id');
        if (vendorId) {
            window.location.href = '/vendor-detail?vendorId=' + vendorId;
        }
    });

    // Nút tạo mới -> chuyển sang màn hình chi tiết
    $("#btn-create").on("click", function(){
        window.location.href = "/vendor-detail?mode=new";
    });

    // Toggle sidebar
    $(".toggle-btn").click(function(){ $(".sidebar-wrap").slideToggle(300); });
    $(".user-btn").click(function(event){ event.stopPropagation(); $(".user-dropdown-content").toggle(); });
    $(document).click(function(){ $(".user-dropdown-content").hide(); });
    $("#logout").click(function(e){ e.preventDefault(); window.location.href = "/login"; });
});