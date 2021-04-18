// import { saveUserToSessionCookie, checkUserSignedIn } from './cookie.js'
import {apiHeaders} from './api.js';
//------------------------------------------------------------------------------------------------------------
//get location and show the time of sunrise:
if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(success, console.log)
}

//get location and show the time of sunrise:
function success(position) {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const { latitude, longitude } = position.coords;
    const location = latitude.toFixed(1).toString().split('.').join('%2C');

    fetch(`https://geo-services-by-mvpc-com.p.rapidapi.com/sun_positions?location=${location}&date=${date}`, {
        "method": "GET",
        "headers": apiHeaders
        // {
        //     "x-rapidapi-key": "1a7c023b07msh369e3890142c167p1921e9jsnfa3fd20869f8",
        //     "x-rapidapi-host": "geo-services-by-mvpc-com.p.rapidapi.com"
        // }
    })
        .then(data => data.json())
        .then(response => {
            let sunrisetime = new Date(response.data.sunrise);
            //GMT szerint - ez a helyes
            let timepattern = /\d{2}:\d{2}:\d{2}/;
            let sunrise = sunrisetime.toUTCString().match(timepattern)[0];
            //GMT+01 szerint
            // let sunrise = sunrisetime.toTimeString().split(" ")[0];
            document.getElementById('sunriseTime').innerHTML = sunrise;
            document.getElementsByClassName('sunrise-time')[0].style.visibility = "visible";
        })
        .catch(err => {
            console.error(err);
        });
}

//------------------------------------------------------------------------------------------------------------
//gallery: 
let mediaQuery = 768
let limit = 3;
let page = 1;
let total; //sum of galleryphotos from json-server
getPhotos(page, limit);

//get photos from json-server:
function getPhotos(page, limit) {
    const url = `http://localhost:3000/sun?_sort=id&_order=desc&_page=${page}&_limit=${limit}`;
    const fetchparameters = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        cache: 'no-cache'
    };
    fetch(url, fetchparameters)
        .then(data => {
            // console.log(data.headers.get("Link"));
            total = data.headers.get('X-Total-Count');
            return data.json()
        })
        .then(response => loadGallery(response, limit))
        .catch(error => console.log(error.message))
}

//load gallery photos:
function loadGallery(photoArray, limit) {
    let container = document.querySelector('.sunrise-more .container');
    container.innerHTML = "";
    for (let i = 0; i < limit; i++) {
        let img = document.createElement('img');
        img.src = photoArray[i].url;
        img.alt = photoArray[i].title;
        container.appendChild(img);
    }
}

Array.from(document.getElementsByClassName('arrow'))
    .forEach(element => element.addEventListener('click', (event) => {
        let endPage = Math.ceil(total / limit);
        if (window.innerWidth < mediaQuery) {
            console.log(endPage);
            if (event.target.id === 'prevBtn') {
                page = page !== 1 ? page - 1 : page;
            };
            if (event.target.id === 'nextBtn') {
                page = page !== endPage ? page + 1 : page;
            };
        } else {
            if (event.target.id === 'prevBtn') {
                if (limit === 9) {
                    page = page !== 1 ? page - 1 : page;
                }
            };
            if (event.target.id === 'nextBtn') {
                limit += 3;
                if (limit > 9) {
                    limit = 9;
                    page = page !== endPage ? page + 1 : page;
                }
            };
        }
        getPhotos(page, limit); //hibakezelés a getPhotos()-ban!   
    }));

//------------------------------------------------------------------------------------------------------------
// Upload photos if signed in:
const isLoggedIn = true; //in demo version

if (isLoggedIn) {
    let btn = document.getElementById("uploadBtn");
    btn.disabled = false;
    btn.addEventListener("click", showModal)
};

function showModal() {
    document.getElementById("upload-modal").style.display = "block";
    document.getElementById("closeModal").removeEventListener("click", closeModal);
    document.getElementById("closeModal").addEventListener("click", closeModal);
    uploadValidator();
}

function closeModal() {
    document.upload.title.value = "";
    document.upload.url.value = "";
    document.upload.date.value = "";
    document.upload.location.value = "";
    document.getElementById("upload-modal").style.display = "none";
}


//validator:

let title, url, date, location;

function uploadValidator() {
    let titleInput = document.upload.title;
    let urlInput = document.upload.url;
    let dateInput = document.upload.date;
    let locationInput = document.upload.location;
    let upload = document.querySelector(".uploadForm .submit-button");

    let titleIsValid = false;
    let urlIsValid = false;
    let dateIsValid = false;
    let locationIsValid = false;

    titleInput.onchange = () => {
        title = titleInput.value;
        titleIsValid = title.length <= 30;
        document.querySelector(".error-title").style.display = titleIsValid ? "none" : "block";
        upload.disabled = allInputAreValid();
    }

    urlInput.onchange = () => {
        url = urlInput.value;
        // let urlregex = /^https?:\/\/(www\.)?\w{1,250}\.[a-z]$/;
        let urlregex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        urlIsValid = url.match(urlregex) === null ? false : true;
        document.querySelector(".error-url").style.display = urlIsValid ? "none" : "block";
        upload.disabled = allInputAreValid();
    }

    dateInput.onchange = () => {
        date = dateInput.value;
        let dateStamp = new Date(date).getTime();
        let now = new Date();
        let todayStamp = now.getTime();
        dateIsValid = dateStamp <= todayStamp;
        document.querySelector(".error-date").style.display = dateIsValid ? "none" : "block";
        upload.disabled = allInputAreValid();
    }

    locationInput.onchange = () => {
        location = locationInput.value;
        locationIsValid = location.length >= 10;
        document.querySelector(".error-location").style.display = locationIsValid ? "none" : "block";
        upload.disabled = allInputAreValid();
    }

    function allInputAreValid() {
        return titleIsValid && urlIsValid && dateIsValid && locationIsValid ? false : true;
    }

    upload.addEventListener('click', ()=>{
        // let userID = getUserId();
        const photo = { title, url, date, location};
        // console.log(JSON.stringify(photo));
        const serverurl = 'http://localhost:3000/sun';
        const fetchInit = {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify(photo)
        }
        fetch(serverurl, fetchInit)
            .then(data => data.json())
            .then(resp => {
                const newPhoto = resp;
                // alert(newPhoto.title + " is uploaded");

                closeModal();
                getPhotos(page, limit);
            })
            .catch(err => console.error(err))
    });
}