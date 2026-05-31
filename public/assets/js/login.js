$(function(){
    function showError(msg) {
        $('#error-msg').text(msg).show();
    }
    function clearError() {
        $('#error-msg').hide().text('');
    }

    $(".login").on("submit", async function(event){
        event.preventDefault();
        clearError();

        const userId = $("#user-id").val().trim();
        const userPassword = $("#user-password").val().trim();
        if(userId === '' || userPassword === ''){
            showError('Vui lòng nhập User ID và Password');
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
                showError(data.message);
            }
        } catch(err) {
            console.error(err);
            showError('Lỗi kết nối, vui lòng thử lại.');
        }
    });
});