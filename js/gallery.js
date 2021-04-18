//gallery.js get gallery photos from json-server to display, 
//and create the mdoal window to gallery view:

//get photos from json-server:
function getPhotos() {
    const url = 'http://localhost:3000/gallery?_sort=id&_order=desc';
    const fetchparameters = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        cache: 'no-cache'
    };
    fetch(url, fetchparameters)
        .then(data => data.json())
        .then(response => {
            photos = response;
            loadGallery();
        })
        .catch(error => console.error(error))
}


//load gallery photos:
function loadGallery() {
    let imgDiv = Array.from(document.querySelectorAll('.gallery-image'));

    for (let div of imgDiv) {
        let index = imgDiv.indexOf(div);
        let img = document.createElement('img');
        img.src = photos[index].url;
        img.alt = photos[index].alt;

        img.addEventListener('click', () => {
            currentIndex = index;
            showModal();
        })
        // img.dataset.title = photos[index].title;
        // img.dataset.author = photos[index].author;
        // img.dataset.loc = photos[index].location;
        // img.dataset.date = photos[index].date;
        div.appendChild(img);
    }
}


function showModal() {
    const modal = document.querySelector('#gallery-modal');
    modal.style.display = 'block';
    currentIndex = currentIndex ? currentIndex : 0;
    modalBackground();
    showModalPhoto();
}

function showPrev() {
    currentIndex = (currentIndex - 1 < 0) ? photos.length - 1 : currentIndex - 1;
    showModalPhoto();
}

function showNext() {
    currentIndex = (currentIndex + 1 >= photos.length) ? 0 : currentIndex + 1;
    showModalPhoto();
}

function modalBackground() {
    const background = document.createElement("div");
    background.className = "modal-background";
    document.body.appendChild(background);
    background.addEventListener('click', () => {
        const modal = document.querySelector('#gallery-modal');
        modal.style.display = 'none';
        document.body.removeChild(background);
    })
};

function showModalPhoto() {
    const currentPhoto = photos[currentIndex];
    const mainImage = document.querySelector('.gallery-modal-main img');
    mainImage.src = currentPhoto.url;
    mainImage.alt = currentPhoto.alt;
    const infoText = document.querySelector('#gallery-modal .infos');
    infoText.innerHTML = `&copy; ${currentPhoto.author}: ${currentPhoto.title} | ${currentPhoto.date}`;
};



// ------------------------------------------------------------------------------- //
//main:

let photos = [];
let currentIndex;

getPhotos();

//include modal using jQuery:
$(document).ready(() => {
    $('#gallery-modal').load('../html/gallery-modal.html', () => {
        $('#view-gallery').on('click', showModal);
        //navigation:
        $('.nav-next').on('click', showNext);
        $('.nav-prev').on('click', showPrev);

        //navigation with arrow buttons:
        $(window).on('keyup', (event) => {
            if (event.keyCode === 39) {
                showNext();
            } else if (event.keyCode === 37) {
                showPrev();
            }
        });

        //touchmove navigation:
        $('#gallery-modal').on('swiperight', () => {
            console.log("swiped to right");
            showPrev();
        });
        $('#gallery-modal').on('swipeleft', ()=>{
            console.log("swipe to left");
            showNext();
        });
    });
});