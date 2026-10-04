// ==========================================
// ELEMENTS
// ==========================================

const intro = document.getElementById('envelopeIntro');
const seal = document.getElementById('openSeal');

const music = document.getElementById('bgMusic');
const musicCtl = document.getElementById('musicControl');
const musicBtn = document.getElementById('musicBtn');



// ==========================================
// MUSIC STATE
// ==========================================

function setMusicState(isPlaying) {

  if (isPlaying) {

    musicCtl.classList.add('playing');

    // pause icon
    musicBtn.textContent = 'Ⅱ';

    musicBtn.setAttribute(
      'aria-label',
      'მუსიკის გამორთვა'
    );

  } else {

    musicCtl.classList.remove('playing');

    // music icon
    musicBtn.textContent = '♪';

    musicBtn.setAttribute(
      'aria-label',
      'მუსიკის ჩართვა'
    );

  }

}



// ==========================================
// OPEN ENVELOPE + START MUSIC
// ==========================================

seal.addEventListener('click', async () => {

  intro.classList.add('opened');

  document.body.classList.remove('locked');


  document
    .getElementById('cover')
    .scrollIntoView({
      behavior: 'auto'
    });


  // MUSIC START

  try {

    music.currentTime = 0;

    await music.play();

    setMusicState(true);

  } catch (error) {

    console.log(
      'Music could not start:',
      error
    );

    setMusicState(false);

  }

});



// ==========================================
// MUSIC ON / OFF BUTTON
// ==========================================

musicBtn.addEventListener('click', async (event) => {

  event.preventDefault();

  event.stopPropagation();


  // თუ მუსიკა გამორთულია → ჩავრთოთ

  if (music.paused) {

    try {

      await music.play();

      setMusicState(true);

    } catch (error) {

      console.log(
        'Music play failed:',
        error
      );

      setMusicState(false);

    }


  // თუ მუსიკა ჩართულია → გამოვრთოთ

  } else {

    music.pause();

    setMusicState(false);

  }

});



// ==========================================
// IF MUSIC ENDS / STOPS
// ==========================================

music.addEventListener('pause', () => {

  setMusicState(false);

});


music.addEventListener('play', () => {

  setMusicState(true);

});



// ==========================================
// PAGE REVEAL + NAVIGATION DOTS
// ==========================================

const pages = [
  ...document.querySelectorAll('.page')
];

const dots = [
  ...document.querySelectorAll('.pager a')
];


const observer = new IntersectionObserver(

  entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {
        return;
      }


      entry.target.classList.add('in-view');


      const index =
        pages.indexOf(entry.target);


      dots.forEach((dot, dotIndex) => {

        dot.classList.toggle(
          'active',
          index === dotIndex
        );

      });

    });

  },

  {
    threshold: 0.55
  }

);


pages.forEach(page => {

  observer.observe(page);

});



// ==========================================
// RSVP → GOOGLE SHEETS
// ==========================================

const RSVP_URL =
  'https://script.google.com/macros/s/AKfycbzICHkuf5J12Hf2D3z6e-sHBYKmFbWiZuT4eSXEk8CactuCt8oLqrU2URKSnqU_N4C9sA/exec';


const rsvpForm =
  document.getElementById('rsvpForm');


rsvpForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    // FORM ELEMENTS

    const button =
      rsvpForm.querySelector('.submit');

    const nameInput =
      document.getElementById('name');

    const name =
      nameInput.value.trim();

    const attendance =
      rsvpForm.querySelector(
        'input[name="attendance"]:checked'
      );



    // ======================================
    // VALIDATION
    // ======================================

    if (!name) {

      alert(
        'გთხოვთ, მიუთითოთ სახელი და გვარი.'
      );

      nameInput.focus();

      return;
    }


    if (!attendance) {

      alert(
        'გთხოვთ, მონიშნოთ დასწრება.'
      );

      return;
    }



    // ======================================
    // SENDING
    // ======================================

    const originalText =
      button.textContent;


    button.disabled = true;

    button.textContent =
      'იგზავნება...';



    // ======================================
    // SEND TO GOOGLE APPS SCRIPT
    // ======================================

    try {

      await fetch(
        RSVP_URL,
        {
          method: 'POST',

          mode: 'no-cors',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body: JSON.stringify({
            name: name,
            attendance: attendance.value
          })
        }
      );



      // ====================================
      // SUCCESS
      // ====================================

      button.textContent =
        'მადლობა ♡';


      nameInput.value = '';

      attendance.checked = false;



    } catch (error) {


      // ====================================
      // ERROR
      // ====================================

      console.error(
        'RSVP ERROR:',
        error
      );


      button.disabled = false;

      button.textContent =
        originalText;


      alert(
        'დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ თავიდან.'
      );

    }

  }
);