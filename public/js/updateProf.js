document.addEventListener("DOMContentLoaded", function() {
    const saveProfileBtn = document.querySelector(".save-btn");
    const usernameInput = document.querySelector(".username");
    const emailInput = document.querySelector(".email");
    const newPasswordInput = document.querySelector(".newPassword");

    const emailError = document.querySelector(".email-error");
    const passwordError = document.querySelector(".password-error");
    const usernameError = document.querySelector(".username-error");
    const success = document.querySelector(".profile-success");

    saveProfileBtn.addEventListener("click", async () => {
        const data = {
            username: usernameInput.value,
            email: emailInput.value,
            newPassword: newPasswordInput.value
        };
        
        console.log(data.name);
        
        try {
            const res = await fetch("/edit/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const response = await res.json();
            
            if (response.errors) {
            if (response.errors.email) {
                emailError.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center email-error" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <div>
                        ${response.errors.email}
                    </div>
                </div>
                `;
            } else {
                emailError.innerHTML = `<div class="email-error"></div>`;
            }

            if (response.errors.password) {
                passwordError.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center password-error" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <div>
                        ${response.errors.password}
                    </div>
                </div>
                `;
            } else {
                passwordError.innerHTML = `<div class="password-error"></div>`;
            }

            if (response.errors.username) {
                usernameError.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center username-error" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <div>
                        ${response.errors.username}
                    </div>
                </div>
                `;
            } else {
                usernameError.innerHTML = `<div class="username-error"></div>`;
            }            

            }
            if (response.success) {
                usernameError.innerHTML = `<div class="username-error"></div>`;
                emailError.innerHTML = `<div class="email-error"></div>`;
                passwordError.innerHTML = `<div class="password-error"></div>`;

                success.innerHTML = `
                <div class="alert alert-success d-flex align-items-center profile-success" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                    Successfully updated!
                </div>
                </div>
                `;

                setTimeout(() => {
                window.location.href = '/profile';
                }, 3000);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    });
});