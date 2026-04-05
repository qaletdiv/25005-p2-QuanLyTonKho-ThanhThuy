$(function(){
    // let account = JSON.parse(localStorage.getItem("account1"));
    // if(account===null){
    //     localStorage.setItem('account1',JSON.stringify(account1));
    //     account=JSON.parse(localStorage.getItem("account1"));
    // }
    $(".login").on("submit",async function(event){
        event.preventDefault();

        const userId = $("#user-id").val().trim();
        const userPassword = $("#user-password").val().trim();
        if(userId ===''|| userPassword ===''){   
            alert('vui lòng nhập user ID,password');
            return;
        }

        try {
            const res = await fetch('/login', {
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({userId,userPassword})
            });

            const data = await res.json();

            if(data.success){
                window.location.href = '/order-list';
            }else{
                alert(data.message);
            }
        }catch(err){
            console.error(err);
            alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
        }
    })
});