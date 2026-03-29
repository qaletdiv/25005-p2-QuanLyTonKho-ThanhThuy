$(function(){
    if(localStorage.getItem("isLogined") !== "true"){
        window.location.href = "login.html";
        return;
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productCode = urlParams.get("productCode"); 
    const mode = urlParams.get("mode"); 

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products.find(p => p.item_CD === productCode);

    // Hiển thị dữ liệu nếu đang edit
    if(product){
        $("#item_CD").val(product.item_CD);
        $("#item_name").val(product.item_name);
        $("#unit").val(product.unit);
        $("#price").val(product.price);
        $("#item_CD").prop("disabled", true); 
    }

    // Tạo mới
    if(mode === "new"){
        $("#item_CD").val('');
        $("#item_name").val('');
        $("#unit").val('');
        $("#price").val('');
    }

    // Lưu sản phẩm
    $("#saveBtn").on("click", function(){
        const item_CD = $("#item_CD").val().trim();
        const item_name = $("#item_name").val().trim();
        const unit = $("#unit").val().trim();
        const price = parseFloat($("#price").val()) || 0;

        if(!item_CD || !item_name || !unit || !price){
            alert("Vui lòng điền đầy đủ thông tin sản phẩm");
            return;
        }

        if(product){ 
            product.item_name = item_name;
            product.unit = unit;
            product.price = price;
        }else{ 
            if(products.find(p => p.item_CD === item_CD)){
                alert("Mã sản phẩm đã tồn tại");
                return;
            }
            products.push({item_CD,item_name,unit,price});
        }

        localStorage.setItem("products",JSON.stringify(products));
        alert("Lưu sản phẩm thành công!");
        window.location.href = "products-list.html";
    });

    $("#backBtn").on("click",function(){
        window.location.href = "products-list.html";
    });

    // Toggle sidebar
    $(".toggle-btn").click(function(){
        $(".sidebar-wrap").slideToggle(300);
    });
    
    $(".user-btn").click(function(event){
        event.stopPropagation();
        $(".user-dropdown-content").toggle();
    });
    $(document).click(function(){ $(".user-dropdown-content").hide(); });

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
