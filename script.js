document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inscriptionForm");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");
    const strengthBar = document.querySelector(".bar div");
    const strengthText = document.getElementById("strengthText");

    // -------------------------
    // 🔐 Force du mot de passe
    // -------------------------
    password.addEventListener("input", () => {
        const val = password.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        const colors = ["#ff4444", "#ffaa00", "#aadd00", "#00ff88"];
        const labels = ["Faible", "Moyen", "Bon", "Excellent"];
        
        strengthBar.style.width = (strength * 25) + "%";
        strengthBar.style.background = colors[strength - 1] || "#ff4444";
        strengthText.textContent = labels[strength - 1] || "Faible";
    });

    // -------------------------
    // 🔍 Fonction validation
    // -------------------------
    function checkField(field) {
        const error = field.parentElement.querySelector(".error");
        let valid = true;

        if (field.required && !field.value.trim()) {
            error.textContent = "Ce champ est obligatoire";
            valid = false;
        } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
            error.textContent = "Email invalide";
            valid = false;
        } else if (field.id === "tel" && field.value && !/^\d{8}$/.test(field.value)) {
            error.textContent = "Numéro invalide (8 chiffres)";
            valid = false;
        } else if (field.id === "confirmPassword" && field.value !== password.value) {
            error.textContent = "Les mots de passe ne correspondent pas";
            valid = false;
        } else {
            error.textContent = "";
        }

        // Couleur bordure
        field.style.borderColor = valid ? "#00ff88" : "#ff4444";
        return valid;
    }

    // -------------------------
    // ✨ Validation en direct
    // -------------------------
    form.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("blur", () => checkField(input));
        input.addEventListener("input", () => {
            if (input.checkValidity()) input.style.borderColor = "#00ff88";
        });
    });

    // -------------------------
    // 📩 Soumission
    // -------------------------
    form.addEventListener("submit", e => {
        e.preventDefault();
        let ok = true;

        form.querySelectorAll("input[required]").forEach(field => {
            if (!checkField(field)) ok = false;
        });

        if (!document.getElementById("cgu").checked) ok = false;

        if (!ok) {
            alert("Veuillez corriger les erreurs avant de soumettre");
            return;
        }

        // Succès
        document.getElementById("successMessage").classList.remove("hidden");
        form.reset();

        // (Optionnel) Redirection après succès
        setTimeout(() => location.href = "produits.html", 2000);
    });
});
