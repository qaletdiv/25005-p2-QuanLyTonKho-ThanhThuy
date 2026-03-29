$(function(){
    let account = JSON.parse(localStorage.getItem("account1"));
    if(account===null){
        localStorage.setItem('account1',JSON.stringify(account1));
        account=JSON.parse(localStorage.getItem("account1"));
    }
    $(".login").on("submit",function(event){
        event.preventDefault();
        const userId=$("#user-id").val().trim();
        const userPassword=$("#user-password").val().trim();
        if(userId===''|| userPassword===''){   
            alert('vui lòng nhập user ID,password');
            return;
        }
        if(userId===account.userId && userPassword===account.userPassword){
            localStorage.setItem("isLogined","true");
            window.location.href="orders-list.html"
        }else{
            alert("userId hoặc password không đúng");
            return;
        }
    })
});