 let waterPhotos = [];
let waterparam = { title: "water", sort: "id", order: "asc" };
const homeURL = 'http://localhost:3000';
//'http://localhost:3000/water?_sort=id&_order=asc'


function createURL(param) {
    let url = homeURL;
    if ('title' in param) { 
        url += `/${param['title']}` 
    };
    if (Object.keys(param).length > 1) { 
        url += "?" 
    };
    for (let filter in param) {
        if (filter != "title") {
            url += `_${filter}=${param[filter]}&`;
        }
    };
    return url.slice(-1) === "&" ? url.slice(0, url.length - 1) : url;
};


function getData(urlparam) {
    if(!sessionStorage.getItem('waterIndex')){
        sessionStorage.setItem('waterIndex', 0);
    }
    let url = createURL(urlparam);
    const fetchparameters = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        cache: 'no-cache'
    };
    fetch(url, fetchparameters)
        .then(data => data.json())
        .then(response => {
            waterPhotos = response;
            loadWaterPhoto(sessionStorage.getItem('waterIndex'));
        })
        .catch(error => console.error(error));
};


function loadWaterPhoto(index) {
    let waterImg = document.querySelector('.underwater-img');
    waterImg.innerHTML = "";
    let photo = waterPhotos[index];
    let img = document.createElement("img");
    img.src = photo.url;
    img.alt = photo.title;
    waterImg.appendChild(img);
    waterImg.removeEventListener('click', changePhoto);
    waterImg.addEventListener('click', changePhoto);
};

function changePhoto(){
    let currentIndex = parseInt(sessionStorage.getItem('waterIndex'));
    currentIndex = currentIndex + 1 == waterPhotos.length ? 0 : currentIndex + 1;
    loadWaterPhoto(currentIndex);
    sessionStorage.setItem('waterIndex', currentIndex);
}


getData(waterparam);