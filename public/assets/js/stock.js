$(function(){
    let table;

    function renderStock(data){
        if ($.fn.DataTable.isDataTable('#stock-table')){
            $('#stock-table').DataTable().clear().destroy();
        }

        table = $('#stock-table').DataTable({
            data: data,
            columns: [
                { data: null, title: 'STT', render: function(data,type,row,meta){ return meta.row + 1; }},
                { data: 'item_CD', title: 'Mã sản phẩm' },
                { data: 'item_name', title: 'Tên sản phẩm' },
                { data: 'stock', title: 'Số lượng' }
            ],
            createdRow: function(row, rowData){
                $(row).attr('data-product-code', rowData.item_CD);
            },
            searching: false,
            language: {
                emptyTable: "Không có dữ liệu tồn kho",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
                infoEmpty: "Hiển thị 0 đến 0 của 0 dòng",
                lengthMenu: "Hiển thị _MENU_ dòng",
                loadingRecords: "Đang tải...",
                zeroRecords: "Không tìm thấy dữ liệu phù hợp",
                paginate: { first:"Đầu tiên", last:"Cuối cùng", next:"Sau", previous:"Trước" }
            }
        });

        table.on('draw.dt', function(){
            table.column(0, {search:'applied', order:'applied'}).nodes().each(function(cell, i){
                cell.innerHTML = i + 1;
            });
        });
    }

    function fetchStock(keyword) {
        let url = '/api/stock';
        if (keyword) url += '?search=' + encodeURIComponent(keyword);
        fetch(url)
            .then(res => res.json())
            .then(result => { renderStock(result.data || []); })
            .catch(() => { renderStock([]); });
    }

    fetchStock();

    $("#btn-search").on("click", function(){
        let keyword = $("#search-input").val().trim();
        fetchStock(keyword);
    });

    $("#search-input").on("keypress", function(event){
        if(event.which === 13) $("#btn-search").click();
    });

    $(".toggle-btn").click(function(){
        $(".sidebar-wrap").slideToggle(300);
    });

    $(".user-btn").click(function(event){
        event.stopPropagation();
        $(".user-dropdown-content").toggle();
    });

    $(document).click(function(){
        $(".user-dropdown-content").hide();
    });

    $("#logout").click(function(e){
        e.preventDefault();
        fetch('/logout').then(() => window.location.href = '/login');
    });
});
