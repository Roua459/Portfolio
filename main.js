
let list = document.querySelectorAll('.nav li');
function active(){
    list.forEach((i) =>
    i.classList.remove('activea'));
    this.classList.add('activea');
}
list.forEach((i) =>
i.addEventListener('click',active));

let menuToggle = document.querySelector('.menuToggle');
let header = document.querySelector('header');
menuToggle.onclick = function(){
    header.classList.toggle('active');
}

const accordion = document.querySelector(".accordion");

accordion.addEventListener("click", (e) => {
  const activePanel = e.target.closest(".accordion-panel");
  if (!activePanel) return;
  toggleAccordion(activePanel);
});

function toggleAccordion(panelToActivate) {
  const buttons = panelToActivate.parentElement.querySelectorAll("button");
  const contents =
    panelToActivate.parentElement.querySelectorAll(".accordion-content");
    
  buttons.forEach((button) => {
    button.setAttribute("aria-expanded", false);
  });

  contents.forEach((content) => {
    content.setAttribute("aria-hidden", true);
  });

  panelToActivate.querySelector("button").setAttribute("aria-expanded", true);

  panelToActivate
    .querySelector(".accordion-content")
    .setAttribute("aria-hidden", false);

    
}




/*--------------------
Vars for change the first card show
--------------------*/
let progress = 0;
let startX = 0;
let startY = 0; // New variable to track the initial Y-coordinate position for touch events
let activee = 0;
let isDown = false;

/*--------------------
Contants
--------------------*/
const speedWheel = 0.5;
const speedDrag = -0.19;

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  );

/*--------------------
Items
--------------------*/
const carousel = document.querySelector(".carousel");
const $items = carousel.querySelectorAll(".carousel-item");
const $cursors = carousel.querySelectorAll(".cursor");

const displayItems = (item, index, activee) => {
  const zIndex = getZindex([...$items], activee)[index];
  item.style.setProperty("--zIndex", zIndex);
  item.style.setProperty("--active", (index - activee) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100));
  activee = Math.floor((progress / 100) * ($items.length - 1));

  $items.forEach((item, index) => displayItems(item, index, activee));
    // Request the next animation frame
};
animate();

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener("click", () => {
    progress = (i / $items.length) * 100 + 10;
    animate();
  });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = (e) => {
  const wheelProgress = e.deltaY * speedWheel;
  progress = progress + wheelProgress;
  animate();
};

const handleMouseMove = (e) => {
  if (e.type === "mousemove") {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
  if (!isDown) return;
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const y = e.clientY || (e.touches && e.touches[0].clientY) || 0; // New variable to track Y-coordinate for touch events
  const mouseProgress = (x - startX) * speedDrag;
  const touchProgress = (y - startY) * speedDrag; // Calculate touch progress
  progress = progress + mouseProgress + touchProgress; // Combine both mouse and touch progress
  startX = x;
  startY = y; // Update startY for touch events
  animate();
};

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  startY = e.clientY || (e.touches && e.touches[0].clientY) || 0; // Set startY for touch events
};

const handleMouseUp = () => {
  isDown = false;
};

/*--------------------
Touch swipe handling
--------------------*/
const handleTouchStart = (e) => {
  handleMouseDown(e); // Reuse the handleMouseDown function for touch events
};

const handleTouchMove = (e) => {
  e.preventDefault(); // Prevent default touchmove behavior (prevents page scrolling)
  handleMouseMove(e); // Reuse the handleMouseMove function for touch events
};

const handleTouchEnd = () => {
  handleMouseUp(); // Reuse the handleMouseUp function for touch events
};

/*--------------------
Listeners
--------------------*/
carousel.addEventListener("mousedown", handleMouseDown);
carousel.addEventListener("mousemove", handleMouseMove);
carousel.addEventListener("mouseup", handleMouseUp);
carousel.addEventListener("touchstart", handleTouchStart); // Listen for touchstart event
carousel.addEventListener("touchmove", handleTouchMove); // Listen for touchmove event
carousel.addEventListener("touchend", handleTouchEnd); // Listen for touchend event

/*
reviews
*/
const wrap = document.querySelector(".wrap");
const cardReview = document.querySelector(".cardReview");
const firstCardWidth = cardReview.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrap i");
const cardReviewChildrens = [...cardReview.children];

let isDragging = false, isAutoPlay = true, startXt, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the cardReview at once
let cardPerView = Math.round(cardReview.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of cardReview for infinite scrolling
cardReviewChildrens.slice(-cardPerView).reverse().forEach(card => {
    cardReview.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of cardReview for infinite scrolling
cardReviewChildrens.slice(0, cardPerView).forEach(card => {
    cardReview.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the cardReview at appropriate postition to hide first few duplicate cards on Firefox
cardReview.classList.add("no-transition");
cardReview.scrollLeft = cardReview.offsetWidth;
cardReview.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the cardReview left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        cardReview.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    cardReview.classList.add("dragging");
    // Records the initial cursor and scroll position of the cardReview
    startXt = e.pageX;
    startScrollLeft = cardReview.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the cardReview based on the cursor movement
    cardReview.scrollLeft = startScrollLeft - (e.pageX - startXt);
}

const dragStop = () => {
    isDragging = false;
    cardReview.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the cardReview is at the beginning, scroll to the end
    if(cardReview.scrollLeft === 0) {
        cardReview.classList.add("no-transition");
        cardReview.scrollLeft = cardReview.scrollWidth - (2 * cardReview.offsetWidth);
        cardReview.classList.remove("no-transition");
    }
    // If the cardReview is at the end, scroll to the beginning
    else if(Math.ceil(cardReview.scrollLeft) === cardReview.scrollWidth - cardReview.offsetWidth) {
        cardReview.classList.add("no-transition");
        cardReview.scrollLeft = cardReview.offsetWidth;
        cardReview.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over cardReview
    clearTimeout(timeoutId);
    if(!wrap.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the cardReview after every 2500 ms
    timeoutId = setTimeout(() => cardReview.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

cardReview.addEventListener("mousedown", dragStart);
cardReview.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
cardReview.addEventListener("scroll", infiniteScroll);
wrap.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrap.addEventListener("mouseleave", autoPlay);
