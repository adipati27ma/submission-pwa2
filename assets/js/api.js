let base_url = "http://api.football-data.org/v2/";
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getTeams() {

  if ('caches' in window) {
    caches.match(base_url + "competitions/2001/teams").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let teamsHTML = "";
          console.log(data);
          data.teams.forEach(function (team) {

            if (team.crestUrl !== null) {
              let src = team.crestUrl;
              let nation = team.area.name;

              if (nation === "Czech Republic") {
                nation = "Czech";
              }
              teamsHTML += `
                <div class = "col s6 m3 card-wrapper">
                  <div class="card">
                    <a href="./team.html?id=${team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${src.replace(/^http:\/\//i, 'https://')}" class="responsive-img"/>
                      </div>
                    </a>
                    <div class="card-content center-align">
                      <span class="card-title">${team.shortName}</span>
                    </div>
                    <div class="card-action row">
                      <span class="col s6 left-align">${team.founded}</span>
                      <span class="col s6 right-align">${nation}</span>
                    </div>
                  </div>
                </div>
                `;
            } else {
              console.log(`${team.name} tak memiliki link logo`);
            }
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        })
      }
    })
  }


  fetch(base_url + "competitions/2001/teams", {
      headers: {
        "X-Auth-Token": "0292f6cbac12476aadc969faec2ae5c6"
      }
    })
    .then(status)
    .then(json)
    .then(data => data.teams)
    .then(function (data) {
      // Menyusun komponen card artikel secara dinamis
      console.log(data);
      let teamsHTML = "";
      data.forEach(function (team) {

        if (team.crestUrl !== null) {
          let src = team.crestUrl;
          let nation = team.area.name;

          if (nation === "Czech Republic") {
            nation = "Czech";
          }


          teamsHTML += `
                <div div class = "col s6 m3 card-wrapper">
                  <div class="card">
                    <a href="./team.html?id=${team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${src.replace(/^http:\/\//i, 'https://')}" class="responsive-img"/>
                      </div>
                    </a>
                    <div class="card-content center-align">
                      <span class="card-title">${team.shortName}</span>
                    </div>
                    <div class="card-action">
                      <span class="col s6 left-align personnel">${team.founded}</span>
                      <span class="col s6 right-align nation">${nation}</span>
                    </div>
                  </div>
                </div>
                `;
        } else {
          console.log(`${team.name} tak memiliki link logo`);
        }
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}


// Blok kode untuk melakukan request data json menurut ID (details)
function getTeamById() {

  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ('caches' in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            teamHTML = `
                  <div class="card-wrapper">
                    <div class="card">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.result.cover}" />
                      </div>
                      <div class="card-content">
                        <span class="card-title">${data.result.post_title}</span>
                        ${snarkdown(data.result.post_content)}
                      </div>
                    </div>
                  </div>
                `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;
            resolve(data);
          });
        }
      });
    }


    fetch(base_url + "teams/" + idParam, {
        headers: {
          "X-Auth-Token": "0292f6cbac12476aadc969faec2ae5c6"
        }
      })
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat letiabel data.
        console.log(data);
        return;
        // Menyusun komponen card artikel secara dinamis
        let teamHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        resolve(data);
      });
  });
}


function getSavedTeams() {
  getAll().then(function (teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    let teamsHTML = "";

    teams.forEach(function (team) {
      let nation = team.area.name;

      if (nation === "Czech Republic") {
        nation = "Czech";
      }
      teamsHTML += `
        <div class="col s4 m3 card">
          <a href="./team.html?id=${team.ID}&saved=true">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${team.crestUrl}" />
            </div>
          </a>
          <div class="card-content center-align">
            <span class="card-title">${team.name}</span>
          </div>
          <div class="card-action row">
            <span class="col s6 left-align">${team.founded}</span>
            <span class="col s6 right-align">${nation}</span>
          </div>
        </div>
      `;
    });
    // Sisipkan card ke #body-content
    document.getElementById("body-content").innerHTML = teamsHTML;
  });
}

function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  getById(idParam).then(function (team) {
    let teamHTML = `
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${team.cover}" />
        </div>
        <div class="card-content">
          <span class="card-title">${team.post_title}</span>
          ${snarkdown(team.post_content)}
        </div>
      </div>
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
  });
}