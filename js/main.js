function includeHTML() {
  const z = document.getElementsByTagName("*");
  for (let i = 0; i < z.length; i++) {
    const elmnt = z[i];
    const file = elmnt.getAttribute("w3-include-html");

    if (file) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
            if (elmnt.tagName === 'HEADER') {
              updateMenu()
            }
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
    }
  }
};


const cookieHandler = {
  saveCookie(key, value, expDays=0, path='/'){
      if(expDays!==0){
          let now = new Date();
          now.setTime(now.getTime() + expDays*24*60*60*1000)
          let expires = now.toUTCString();
          document.cookie = `${key}=${value}; expires=${expires}; path=${path}`;
      } else {
          //if expDays is not given, it will be a session cookie!!!
          document.cookie = `${key}=${value}; path=${path}`;
      }
  },
  getCookie(key){
      let cookie = document.cookie.split("; ").find(item=>item.startsWith(key))
      return cookie ? cookie.split("=")[1] : ""
  }
}

includeHTML();
