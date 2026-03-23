let currentIndex = -5;
let lastIndex = 0;
let isSearching = false;

const homeBtn = document.querySelector("#HomeBtn");
const searchInput = document.querySelector("#searchInput");
const wordsContainer = document.querySelector(".word-section");
const nextBtn = document.querySelector("#NextBtn");
const prevBtn = document.querySelector("#PrevBtn");

function showHome(){

    wordsContainer.innerHTML = `
    <div class="welcome">
        <h2>✨ Welcome to VocabWise</h2>
        <p>Click Next to explore words ➡️</p>
    </div>
    `;

    prevBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
}

fetch("words.json")
.then(response => response.json())
.then(data => {
    
    // Retrieve the value when the page loads
    const savedIndex = localStorage.getItem("pageIndex");

    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex);
    }

    // Show correct screen after page load
    if (currentIndex < 0) {
         showHome();
    } else {
        showWords(data);
    }

    document.addEventListener("keydown", (e) => {

        // RIGHT ARROW → NEXT
        if (e.key === "ArrowRight") {
            nextBtn.click();
        }

        // LEFT ARROW → PREVIOUS
        if (e.key === "ArrowLeft") {
            prevBtn.click();
        }

    });

    // Home Button
    homeBtn.addEventListener("click", () => {

    currentIndex = -5;  

    localStorage.setItem("pageIndex", currentIndex);

    showHome();

});

    // Next Button
    nextBtn.addEventListener("click", () => {
        currentIndex += 5;
        localStorage.setItem("pageIndex", currentIndex);
        showWords(data);
    });

    // Previous Button
    prevBtn.addEventListener("click", () => {
        if (currentIndex >= 5) {
            currentIndex -= 5;
            localStorage.setItem("pageIndex", currentIndex);
            showWords(data);
        }
    });

    // Search Feature
    searchInput.addEventListener("input", (e) => {

        const searchWord = e.target.value.toLowerCase().trim();

        wordsContainer.innerHTML = "";

        // Search empty → restore previous page
        if (!searchWord) {

            nextBtn.style.display = "inline-block";

            currentIndex = lastIndex;

            if (currentIndex < 0) {
                showHome();
                return;
            }

            showWords(data);

            return;
        }

        // Save current page before searching
        lastIndex = currentIndex;

        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        const results = data.filter(item =>
            item.word.toLowerCase().startsWith(searchWord)
        );

        if (!results.length) {

            wordsContainer.innerHTML =
            `<p class="no-result">This word is currently not available.</p>`;
            return;
        }

        results.slice(0,5).forEach(item => createCard(item));

    });

});




function showWords(data) {

    wordsContainer.innerHTML = "";

    nextBtn.style.display = "inline-block";

    // Prev button logic
    prevBtn.style.display = currentIndex <= 0 ? "none" : "inline-block";

    // Next button logic (hide on last page)
    if (currentIndex >= data.length) {

        nextBtn.style.display = "none";
        prevBtn.style.display = "inline-block";

        wordsContainer.innerHTML = `
        <div class="end-message">
            <h3>✨ That's all for now!</h3>
            <p>More words will be added in the future 😊</p>
        </div>
        `;

        return;
    }

    let hasData = false;

    for (let i = currentIndex; i < currentIndex + 5; i++) {

        const word = data[i];

        if (!word) break;

        hasData = true;

        const card = `
        <article class="card-section">
            <h3>${word.word}</h3>
            <p><strong>Meaning:</strong> ${word.meaning}</p>
            <p><strong>Context:</strong> ${word.context}</p>
            <p><strong>Example:</strong> ${word.example}</p>
        </article>
        `;

        wordsContainer.innerHTML += card;
    }

    // If no more words → show ending message
    if (!hasData) {
        wordsContainer.innerHTML = `
        <div class="end-message">
            <h3>✨ That's all for now!</h3>
            <p>More words will be added in the future 😊</p>
        </div>
        `;
    }
}



function createCard(item){

    const card = document.createElement("article");
    card.className = "card-section";

    card.innerHTML = `
        <h3>${item.word}</h3>
        <p><strong>Meaning:</strong> ${item.meaning}</p>
        <p><strong>Context:</strong> ${item.context}</p>
        <p><strong>Example:</strong> ${item.example}</p>
    `;

    wordsContainer.appendChild(card);
}
