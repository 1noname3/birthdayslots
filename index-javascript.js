const items = ["apple", "banana", "mango", "gem"];
const images = {
  "apple": "apple.png",
  "banana": "banana.png",
  "mango": "mango.png",
  "gem": "gem.png"
};

const sounds = {
  "confetti": document.getElementById("confetti-sound"),
  "mango": document.getElementById("mango-sound"),
  "sigma": document.getElementById("sigma-sound"),
  "apple": document.getElementById("apple-sound"),
  "gem": document.getElementById("gem-sound"),
  "Spinning": document.getElementById("slotspinning-sound")
};
sounds["Spinning"].volume = 0.5;

// Probability setup (values must add up to 1.0)
const animationProbabilities = {
  "apple": 0.25,
  "banana": 0.25,
  "mango": 0.25,
  "gem": 0.25
};

const finalProbabilities = {
  "apple": 0.3,
  "banana": 0.3,
  "mango": 0.35,
  "gem": 0.05
};

let isCooldown = false; // Cooldown flag

function stopAllSounds() {
  Object.values(sounds).forEach(sound => {
    if (sound) { // Check if the sound is not null
      sound.pause();
      sound.currentTime = 0; // Reset to the beginning
    }
  });
}


function getRandomItem(probabilities = animationProbabilities) {
  const rand = Math.random();
  let sum = 0;
  for (const item in probabilities) {
    sum += probabilities[item];
    if (rand <= sum) return item;
  }
  return "apple";
}

function startRandomImageAnimation() {
  if (isCooldown) return; // Exit if cooldown is active
  isCooldown = true; // Set cooldown

  stopAllSounds(); // Stop any currently playing sounds
  sounds["Spinning"].play(); // Start the spinning sound

  const slots = document.querySelectorAll('.Slot');
  const birthdayMessage = document.getElementById("birthdayMessage");
  const sigmaMessages = document.getElementsByClassName("Sigma-message");
  let intervals = [];
  const isFirstSpin = !localStorage.getItem("firstSpin");

  // Hide the messages
  Array.from(sigmaMessages).forEach(message => message.style.display = "none");
  birthdayMessage.style.display = "none";

  slots.forEach(slot => {
    const interval = setInterval(() => {
      const randomItem = getRandomItem();
      slot.style.backgroundImage = `url(${images[randomItem]})`;
      slot.dataset.item = randomItem;
    }, 100);
    intervals.push(interval);
  });

  setTimeout(() => {
    intervals.forEach(interval => clearInterval(interval));
    slots.forEach(slot => {
      // On the first spin, force the result to "gem" for a guaranteed win
      const finalItem = isFirstSpin ? "gem" : getRandomItem(finalProbabilities);
      slot.style.backgroundImage = `url(${images[finalItem]})`;
      slot.dataset.item = finalItem;
    });

    // Set the first spin flag to "done" to prevent future forced wins
    if (isFirstSpin) {
      localStorage.setItem("firstSpin", "done");
    }

    checkForMatch();
    isCooldown = false; // Reset cooldown after animation completes
  }, 4000);
}

function checkForMatch() {
  const slots = document.querySelectorAll('.Slot');
  const birthdayMessage = document.getElementById("birthdayMessage");
  const firstItem = slots[0].dataset.item;
  const sigmaMessages = document.getElementsByClassName("Sigma-message");

  if (Array.from(slots).every(slot => slot.dataset.item === firstItem)) {
    switch (firstItem) {
      case "apple":
        redirectTo('https://www.youtube.com/shorts/tzD9OxAHtzU');
        break;
      case "banana":
        Sigma();
        break;
      case "mango":
        MangoMangoMango();
        break;
      case "gem":
        BirthDayCelebrationWin();
        break;
    }
  }
}

function Sigma() {
  stopAllSounds(); // Stop any currently playing sounds
  const sigmaMessages = document.getElementsByClassName("Sigma-message");
  if (sigmaMessages.length > 0) {
    Array.from(sigmaMessages).forEach(message => {
      message.style.display = "block";
    });
    sounds["sigma"].play();
  }
}

function redirectTo(url) {
  window.location.href = url;
}

function MangoMangoMango() {
  stopAllSounds(); // Stop any currently playing sounds
  sounds["mango"].play();
}

function BirthDayCelebrationWin() {

  const birthdayMessage = document.getElementById("birthdayMessage");
  sounds["confetti"].play();
  birthdayMessage.style.display = "block";
  createConfetti();
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  confettiContainer.style.display = "block";

  for (let i = 0; i < 200; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.backgroundColor = getRandomColor();
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = Math.random() * -50 + "vh";

    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = `${4 + Math.random() * 3}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;

    confettiContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }

  setTimeout(() => {
    confettiContainer.style.display = "none";
  }, 7000);
}

function getRandomColor() {
  const colors = ["#ff4b5c", "#ff8a5c", "#ffd95c", "#7ae582", "#4bb3ff", "#ff85cb"];
  return colors[Math.floor(Math.random() * colors.length)];
}
