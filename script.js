function sendMessage() {

    let input = document.getElementById("message");

    let message = input.value.trim();

    if (message === "") return;

    let chat = document.getElementById("chat-box");

    // Show user's message
    chat.innerHTML += `
    <div class="user">
        <strong>👤 You</strong><br>
        ${message}
    </div>
    `;
    // Show typing message
chat.innerHTML += `
<div class="bot" id="typing">
    <strong>🤖 Gemini</strong><br><br>
    Bot is typing...
</div>
`;

    chat.scrollTop = chat.scrollHeight;

    let imageInput = document.getElementById("image");

let formData = new FormData();

formData.append("message", message);

if(imageInput.files.length > 0){

    formData.append("image", imageInput.files[0]);

}

fetch("/chat",{

    method:"POST",

    body:formData

})

    .then(response => response.json())

    .then(data => {

        // Remove typing message
        document.getElementById("typing").remove();

        // Show Gemini response
        chat.innerHTML += `
<div class="bot">

    <strong>🤖 Gemini</strong><br><br>

    <div class="response-text">
        ${data.response}
    </div>

    <button class="copy-btn"
            onclick="copyResponse(this)">
        📋 Copy
    </button>

</div>
`;

        chat.scrollTop = chat.scrollHeight;

    })

    .catch(error => {

        document.getElementById("typing").remove();

        chat.innerHTML += `
        <div class="bot">
            <strong>🤖 Gemini</strong><br><br>
            Something went wrong. Please try again.
        </div>
        `;

        console.error(error);

    });

    input.value = "";
}

// Press Enter to send
document.getElementById("message").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});
// ---------------------------
// New Chat Button
// ---------------------------

document.getElementById("new-chat").addEventListener("click", function () {

    document.getElementById("chat-box").innerHTML = `
    <div class="bot">
        <strong>🤖 Nova AI</strong>
        <div class="response-text">
            👋 Hello! I'm <b>Nova AI</b>
        </div>
    </div>
    `;

    document.getElementById("message").value = "";

    document.getElementById("image").value = "";

});

// ---------------------------
// Dark Mode Button
// ---------------------------
document.getElementById("dark-mode").addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

});
// --------------------
// Image Preview
// --------------------

const imageInput = document.getElementById("image");

const preview = document.getElementById("image-preview");

const previewContainer = document.getElementById("image-preview-container");

imageInput.addEventListener("change", function () {

    if (imageInput.files.length > 0) {

        const file = imageInput.files[0];

        preview.src = URL.createObjectURL(file);

        previewContainer.style.display = "block";

    }
});
