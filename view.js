document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.getElementById("questionsContainer");

    fetch("questions.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((question) => {
                const questionElement = document.createElement("div");
                questionElement.classList.add("question-container");

                const questionHeading = document.createElement("div");
                questionHeading.classList.add("question-heading");

                const title = document.createElement("span");
                title.textContent = question.title;
                title.classList.add("title");
                title.addEventListener("click", () => toggleDropdown(question.id));

                questionHeading.appendChild(title);
                questionElement.appendChild(questionHeading);

                const questionTextContainer = document.createElement("div");
                questionTextContainer.classList.add("dropdown-content", `question-${question.id}`);
                questionTextContainer.textContent = question.question;
                questionElement.appendChild(questionTextContainer);

                const solutionsContainer = document.createElement("div");
                solutionsContainer.classList.add("solutions-container", `solutions-${question.id}`);
                solutionsContainer.style.display = "none";

                question.solutions.forEach((solution, index) => {
                    const solutionButton = document.createElement("button");
                    solutionButton.textContent = `Solution ${index + 1}`;
                    solutionButton.classList.add("solution-button");
                    solutionButton.addEventListener("click", () => toggleSolution(question.id, index));

                    const solutionTextContainer = document.createElement("div");
                    solutionTextContainer.classList.add("solution-text", `solution-${question.id}-${index}`);
                    solutionTextContainer.innerHTML = formatCode(solution.code);
                    solutionTextContainer.style.display = "none";

                    solutionsContainer.appendChild(solutionButton);
                    solutionsContainer.appendChild(solutionTextContainer);
                });

                questionElement.appendChild(solutionsContainer);
                questionsContainer.appendChild(questionElement);
            });
        })
        .catch((error) => console.error("Error loading JSON:", error));

    // Toggle question dropdown visibility
    function toggleDropdown(questionId) {
        // Close all solutions first
        const allSolutions = document.querySelectorAll('.solution-text');
        allSolutions.forEach(solution => {
            solution.style.display = "none";  // Hide all solutions
        });

        // Toggle current question's dropdown visibility
        const questionText = document.querySelector(`.question-${questionId}`);
        const solutionsContainer = document.querySelector(`.solutions-${questionId}`);
        questionText.classList.toggle("show");
        solutionsContainer.style.display = solutionsContainer.style.display === "none" ? "block" : "none";  // Toggle solutions visibility
    }

    function toggleSolution(questionId, solutionIndex) {
        const solutionText = document.querySelector(`.solution-${questionId}-${solutionIndex}`);
        solutionText.style.display = solutionText.style.display === "none" ? "block" : "none";
    }

    // Format code (escape newlines and special characters for HTML display)
    function formatCode(code) {
        return `<pre class="formatted-code"><code>${code}</code></pre>`;  // Wrap code in <pre><code> for proper formatting
    }

});
