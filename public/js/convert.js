document.addEventListener("DOMContentLoaded", function() {
    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : null;
    }

    const convertButton = document.getElementById("copyButton");
    const coinFrom = getCookie("coin");

    convertButton.addEventListener("click", async () => {
        let valueTo = (document.getElementById("To")).value;
        let valueFrom = (document.getElementById("usdPayment")).value;
        let coinTo = (document.getElementById("cryptoList")).value;
        
        let errorF = document.querySelector('.convert-error');
        let successF = document.querySelector('.convert-success');
        try {
            const res = await fetch("/wallet/convert/conversion", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valueTo, valueFrom, coinTo, coinFrom })
            });

            const response = await res.json();

            if (response.errors) {
                if (response.errors.conversation) {
                    errorF.innerHTML = `
                    <div class="alert alert-danger d-flex align-items-center convert-error" role="alert">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                        <div>
                            ${response.errors.conversation}
                        </div>
                    </div>
                    `;
                } else {
                    errorF.innerHTML = `<div class="convert-error"></div>`;
                    }
                }

            if (response.success) {
                errorF.innerHTML = '<div class="convert-error"></div>';
                successF.innerHTML = `
                <div class="alert alert-success d-flex align-items-center profile-success" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                    Successfully updated!
                </div>
                </div>
                `;

                setTimeout(() => {
                    window.location.href = '/wallet';
                }, 3000);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error("Failed to convert:", error);
        }
    });
});
