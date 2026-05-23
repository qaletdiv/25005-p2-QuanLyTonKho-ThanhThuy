$(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get("vendorId");
    const mode = urlParams.get("mode");
    let isEdit = false;

    // Nếu có vendorId thì load dữ liệu để sửa
    if (vendorId && mode !== "new") {
        isEdit = true;
        fetch('/api/vendors/' + encodeURIComponent(vendorId))
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    $("#vendor-id").val(result.data.id);
                    $("#vendor-name").val(result.data.vendorName);
                    $("#vendor-address").val(result.data.address);
                }
            });
    }

    // Lưu nhà cung cấp
    $("#saveBtn").on("click", async function(){
        const vendorName = $("#vendor-name").val().trim();
        const address = $("#vendor-address").val().trim();

        if(!vendorName){
            alert("Vui lòng nhập tên nhà cung cấp");
            return;
        }

        let url, method, body;
        if (isEdit) {
            url = '/api/vendors/' + encodeURIComponent(vendorId);
            method = 'PUT';
            body = { vendorName, address };
        } else {
            url = '/api/vendors';
            method = 'POST';
            body = { vendorName, address };
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        alert(result.message);
        if (result.success) {
            window.location.href = "/vendors-list";
        }
    });

    // Quay lại
    $("#backBtn").on("click", function(){
        window.location.href = "/vendors-list";
    });

    // Toggle sidebar
    $(".toggle-btn").click(function(){ $(".sidebar-wrap").slideToggle(300); });
    $(".user-btn").click(function(event){ event.stopPropagation(); $(".user-dropdown-content").toggle(); });
    $(document).click(function(){ $(".user-dropdown-content").hide(); });
    $("#logout").click(function(e){ e.preventDefault(); fetch('/logout').then(()=>window.location.href='/login'); });
});
