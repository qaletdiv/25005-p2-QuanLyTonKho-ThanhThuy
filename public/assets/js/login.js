$(function(){
    $(".login").on("submit", async function(event){
        event.preventDefault();

        const userId = $("#user-id").val().trim();
        const userPassword = $("#user-password").val().trim();
        if(userId === '' || userPassword === ''){
            alert('Vui lòng nhập User ID và Password');
            return;
        }

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userPassword })
            });

            const data = await res.json();

            if(data.success){
                window.location.href = '/orders-list';
            } else {
                alert(data.message);
            }
        } catch(err) {
            console.error(err);
            alert('lỗi đăng nhập.');
        }
    });
});