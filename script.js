document.addEventListener('DOMContentLoaded', () => {
    const typingtext = document.querySelector('.typing-text p');
    const input = document.querySelector('.input-field');
    const time = document.querySelector('.time span b');
    const mistakes = document.querySelector('.mistake span');
    const wpm = document.querySelector('.wpm span');
    const cpm = document.querySelector('.cpm span');
    const btn = document.querySelector('button');
    const modal = document.getElementById('resultModal');
    const wpmResult = document.getElementById('wpmResult');
    const cpmResult = document.getElementById('cpmResult');
    const mistakeResult = document.getElementById('mistakeResult');
    const modalHeading = document.querySelector('#resultModal h3');
    const closeModal = document.getElementById('closeModal');

    let timer;
    let maxtime = 60;
    let timeleft = maxtime;
    let charindex = 0;
    let mistake = 0;
    let istyping = false;

    function showModal(finalWpm, finalCpm, finalMistakes, message) {
        wpmResult.innerText = `WPM: ${finalWpm}`;
        cpmResult.innerText = `CPM: ${finalCpm}`;
        mistakeResult.innerText = `Mistakes: ${finalMistakes}`;
        modalHeading.innerText = message;
        modal.classList.remove('hidden');
    }

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    function loadparagraph() {
        const paragraph = [
            "There was no time. He ran out of the door without half the stuff he needed for work, but it didn't matter. He was late and if he didn't make this meeting on time, someone's life may be in danger",
            "Sometimes that's just the way it has to be. Sure, there were probably other options, but he didn't let them enter his mind. It was done and that was that. It was just the way it had to be",
            "He heard the crack echo in the late afternoon about a mile away. His heart started racing and he bolted into a full sprint. It wasn't a gunshot, it wasn't a gunshot, he repeated under his breathlessness as he continued to sprint",
            "It's never good to give them details, Janice told her sister. Always be a little vague and keep them guessing.",
            "Her hand was balled into a fist with her keys protruding out from between her fingers. This was the weapon her father had shown her how to make when she walked alone to her car after work. She wished that she had something a little more potent than keys between her fingers.",
            "The boxed moved. That was a problem. Peter had packed the box three hours before and there was nothing inside that should make it move. The question now was whether or not Peter was going to open it up and look inside to see why it had moved. The answer to that question was obvious. Peter dropped the package into the mailbox so he would never have to see it again."
        ];
        const randomindex = Math.floor(Math.random() * paragraph.length);
        typingtext.innerHTML = '';
        for (const char of paragraph[randomindex]) {
            typingtext.innerHTML += `<span>${char}</span>`;
        }
        typingtext.querySelectorAll('span')[0].classList.add('active');
        document.addEventListener("keydown", () => input.focus());
        typingtext.addEventListener("click", () => input.focus());
    }

    function initTyping() {
        const char = typingtext.querySelectorAll('span');
        const typedchar = input.value.charAt(charindex);

        if (charindex < char.length && timeleft > 0) {
            if (!istyping) {
                timer = setInterval(initTimer, 1000);
                istyping = true;
            }

            if (char[charindex].innerText === typedchar) {
                char[charindex].classList.add("correct");
            } else {
                mistake++;
                char[charindex].classList.add("incorrect");
            }

            char[charindex].classList.remove("active");
            charindex++;

            if (charindex < char.length) {
                char[charindex].classList.add("active");
            }

            mistakes.innerText = mistake;
            cpm.innerText = charindex - mistake;

            // Check if completed
            if (charindex === char.length) {
                clearInterval(timer);
                input.value = '';
                const finalWpm = wpm.innerText;
                const finalCpm = cpm.innerText;
                const finalMistakes = mistakes.innerText;
                showModal(finalWpm, finalCpm, finalMistakes, "Great Job!");
            }
        }
    }

    function initTimer() {
        if (timeleft > 0) {
            timeleft--;
            time.innerText = timeleft;
            let wpmval = Math.round(((charindex - mistake) / 5) / ((maxtime - timeleft) / 60));
            wpm.innerText = wpmval;
        } else {
            clearInterval(timer);
            input.value = '';
            showModal(wpm.innerText, cpm.innerText, mistakes.innerText, "Time's up!");
        }
    }

    function reset() {
        loadparagraph();
        clearInterval(timer);
        timeleft = maxtime;
        time.innerText = timeleft;
        input.value = "";
        charindex = 0;
        mistake = 0;
        istyping = false;
        wpm.innerText = 0;
        cpm.innerText = 0;
        mistakes.innerText = 0;
    }

    input.addEventListener('input', initTyping);
    btn.addEventListener("click", reset);
    loadparagraph();
});

// Theme toggle logic
const themeIcon = document.getElementById('themeIcon');

function updateIcon(isDark) {
    themeIcon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
}

themeIcon.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('typingAppTheme', isDark ? 'dark' : 'light');
    updateIcon(isDark);
});

const savedTheme = localStorage.getItem('typingAppTheme');
const isDark = savedTheme === 'dark';
document.body.classList.toggle('dark', isDark);
updateIcon(isDark);
