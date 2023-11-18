document.addEventListener("DOMContentLoaded", function() {
    var generateButton = document.getElementById("generateButton");
    generateButton.disabled = true;
});

function toggleSelection() {
    const toggle = document.getElementById("toggle");
    const toggleText = document.getElementById("toggleText");

    if (toggle.checked) {
        toggleText.innerText = "Teams";
    } else {
        toggleText.innerText = "Names";
    }
}

function handleFileChange() {
    var fileInput = document.getElementById("file");
    var generateButton = document.getElementById("generateButton");
    
    if (fileInput.files.length > 0) {
        generateButton.disabled = false;
    } else {
        generateButton.disabled = true;
    }
}

function generateSelection() {
    const toggle = document.getElementById("toggle");
    const quantityInput = document.getElementById("quantity");
    const output = document.getElementById("output");
    const fileInput = document.getElementById("file");
    const countdown = document.getElementById("countdown");

    // Clear previous output
    output.innerHTML = "";

    // Read the file content
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result.trim().split("\n");
        const list = content.map(item => item.trim());

        // Check if number is valid
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) {
            alert("Please enter a valid number.");
            return;
        }

        // Ensure number does not exceed the list length
        if (quantity > list.length) {
            alert("Number exceeds the amount of names in the input file.");
            return;
        }

        // Disable button and show countdown
        document.getElementById("generateButton").disabled = true;
        countdown.style.display = "block";

        // Set the countdown duration
        let count = 3;
        countdown.innerText = count;

        const countdownInterval = setInterval(function() {
            count--;
            countdown.innerText = count;

            if (count === 0) {
                clearInterval(countdownInterval);

                // Randomly pick n names or divide into m teams
                const selectedItems = [];

                if (toggle.checked) {
                    // Create m teams
                    while (list.length > 0 && selectedItems.length < quantity) {
                        const teamSize = Math.ceil(list.length / (quantity - selectedItems.length));
                        const team = [];
                        for (let j = 0; j < teamSize && list.length > 0; j++) {
                            const randomIndex = Math.floor(Math.random() * list.length);
                            team.push(list[randomIndex]);
                            list.splice(randomIndex, 1);
                        }
                        selectedItems.push("<b>Team " + (selectedItems.length + 1) + "</b>" + ": " + team.join(", "));
                    }
                } else {
                    // Randomly pick n names without replacement
                    const usedIndices = new Set();

                    for (let i = 0; i < quantity; i++) {
                        let randomIndex;
                        do {
                            randomIndex = Math.floor(Math.random() * list.length);
                        } while (usedIndices.has(randomIndex));

                        usedIndices.add(randomIndex);
                        selectedItems.push(list[randomIndex]);
                    }
                }

                // Re-enable button and hide countdown
                document.getElementById("generateButton").disabled = false;
                countdown.style.display = "none";

                // Display the output
                output.innerHTML = selectedItems.join("<br>");
            }
        }, 1000);
    };

    reader.readAsText(file);
}