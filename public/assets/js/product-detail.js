$(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get("productCode");
    const mode = urlParams.get("mode");
    let isEdit = false;

    // Nếu có productCode thì load dữ liệu để sửa
    if (productCode && mode !== "new") {
        isEdit = true;
        fetch('/api/products/' + encodeURIComponent(productCode))
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    $("#item_CD").val(result.data.item_CD);
                    $("#item_name").val(result.data.item_name);
                    $("#unit").val(result.data.unit);
                    $("#price").val(result.data.price);
                    $("#item_CD").prop("disabled", true);
                }
            });
    }

    // Lưu sản phẩm
    $("#saveBtn").on("click", async function(){
        const item_CD = $("#item_CD").val().trim();
        const item_name = $("#item_name").val().trim();
        const unit = $("#unit").val().trim();
        const price = parseFloat($("#price").val()) || 0;

        if(!item_CD || !item_name || !unit || !price){
            alert("Vui lòng điền đầy đủ thông tin sản phẩm");
            return;
        }

        let url, method, body;
        if (isEdit) {
            url = '/api/products/' + encodeURIComponent(productCode);
            method = 'PUT';
            body = { item_name, unit, price };
        } else {
            url = '/api/products';
            method = 'POST';
            body = { item_CD, item_name, unit, price };
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        alert(result.message);
        if (result.success) {
            window.location.href = "/products-list";
        }
    });

    // Quay lại
    $("#backBtn").on("click", function(){
        window.location.href = "/products-list";
    });

    // Toggle sidebar
    $(".toggle-btn").click(function(){ $(".sidebar-wrap").slideToggle(300); });
    $(".user-btn").click(function(event){ event.stopPropagation(); $(".user-dropdown-content").toggle(); });
    $(document).click(function(){ $(".user-dropdown-content").hide(); });
    $("#logout").click(function(e){ e.preventDefault(); window.location.href = "/login"; });
});
