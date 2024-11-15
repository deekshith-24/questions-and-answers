document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.getElementById("questionsContainer");

    fetch("questions.yaml")
        .then(response => response.text())
        .then(yamlText => {
            const data = jsyaml.load(yamlText); // Parse YAML into JS object
            renderQuestions(data);
        })
        .catch(error => console.error("Error loading YAML:", error));

    function renderQuestions(data) {
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
            questionTextContainer.innerHTML = `<pre>${question.question}</pre>`; // Use <pre> for proper formatting
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
    }

    function toggleDropdown(questionId) {
        const allSolutions = document.querySelectorAll('.solution-text');
        allSolutions.forEach(solution => solution.style.display = "none");

        const questionText = document.querySelector(`.question-${questionId}`);
        const solutionsContainer = document.querySelector(`.solutions-${questionId}`);
        questionText.classList.toggle("show");
        solutionsContainer.style.display = solutionsContainer.style.display === "none" ? "block" : "none";
    }

    function toggleSolution(questionId, solutionIndex) {
        const solutionText = document.querySelector(`.solution-${questionId}-${solutionIndex}`);
        solutionText.style.display = solutionText.style.display === "none" ? "block" : "none";
    }

    function formatCode(code) {
        return `<pre class="formatted-code"><code>${code}</code></pre>`;
    }
});
