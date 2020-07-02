let base_url = "https://api.football-data.org/v2/";
const authToken = "0292f6cbac12476aadc969faec2ae5c6";

// fetch Competition API
const fetchApi = (base_url, id) => {
  return fetch(`${base_url}competitions/${id}/teams`, {
    headers: {
      'X-Auth-Token': authToken
    }
  });
};
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
  alert(error);
}

//cache all team list
function cacheCompetition(id) {
  fetchApi(base_url, id)
    .then(status);
}

// Blok kode untuk melakukan request data json
function getTeams(teamId) {

  if ('caches' in window) {
    caches.match(`${base_url}competitions/${teamId}/teams`).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let teamsHTML = "";
          changeLeague(data);

          data.teams.forEach(team => {
            if (team.crestUrl !== null && team.crestUrl !== "") {
              teamsHTML += inputCards(team);
            } else {
              console.log(`${team.name} tak memiliki link logo`);
            }
          });

          // Sisipkan komponen card ke dalam elemen dengan id #teams
          document.getElementById("teams").innerHTML = teamsHTML;
        })
      }
    });
  }


  fetchApi(base_url, teamId)
    .then(status)
    .then(json)
    .then(function (data) {
      // Menyusun komponen card artikel secara dinamis
      let teamsHTML = "";
      changeLeague(data);

      data.teams.forEach(team => {
        if (team.crestUrl !== null && team.crestUrl !== "") {
          teamsHTML += inputCards(team);
        } else {
          console.log(`${team.name} tak memiliki link logo`);
        }
      });

      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    });
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
              changeTeamData(data);

              showSquadMember(data);
              resolve(data);
            });
          }
        })
        .catch(error);
    }


    fetch(base_url + "teams/" + idParam, {
        headers: {
          "X-Auth-Token": authToken
        }
      })
      .then(status)
      .then(json)
      .then(function (data) {
        changeTeamData(data);

        showSquadMember(data);
        resolve(data);
      })
      .catch(err => {
        return reject(err);
      });
  });
}


function getSavedTeams() {
  getAll().then(function (teams) {
    // Menyusun komponen card artikel secara dinamis
    let teamsHTML = "";

    const titleEl = document.querySelector('h2.league-name');
    const imgEl = document.querySelector('img.league-img');
    const endDateEl = document.querySelector('.end-date>p');

    const title = "Favorited Team(s)";
    const imgSrc = "/assets/images/favorite-soccer.jpg";

    titleEl.innerText = title;
    imgEl.setAttribute('src', imgSrc);
    endDateEl.style.display = 'none';

    if (teams.length === 0) {
      document.getElementById("teams").innerHTML = '<h5 class="center">There are no favorite teams.</h5>';
    } else {
      teams.forEach(function (team) {
        let src = team.crestUrl;
        let nation = team.area.name;

        if (nation === "Czech Republic") {
          nation = "Czech";
        }

        teamsHTML += `
        <div class="col s12 m4 l3 card-wrapper">
          <div class="card">
            <a href="./team.html?id=${team.id}&saved=true">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${src.replace(/^http:\/\//i, 'https://')}" class="responsive-img" 
                alt="${team.shortName}" title="${team.shortName}"/>
              </div>
            </a>
            <div class="card-content center-align">
              <span class="card-title">${team.shortName}</span>
            </div>
            <div class="card-action row">
              <span class="col s6 left-align founded">${team.founded}</span>
              <span class="col s6 right-align nation">${nation}</span>
            </div>
          </div>
        </div>
        `;
      });
      // Sisipkan card ke #body-content
      document.getElementById("teams").innerHTML = teamsHTML;
    }
  });
}

function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = Number(urlParams.get("id"));

  getById(idParam).then(function (team) {
    console.log(team);
    changeTeamData(team);
    showSquadMember(team);
  });
  return idParam;
}

// Fungsi-fungsi API
function changeLeague(data) {
  const endDate = new Date(data.season.endDate).toDateString();
  const leagueName = data.competition.name;
  const leagueId = data.competition.id;
  const imgSrc = `/assets/images/${leagueId}.jpg`;

  const leagueTitle = document.querySelector('h2.league-name');
  const leagueImg = document.querySelector('img.league-img');
  const endDateLeague = document.querySelector('.end-date span');
  leagueTitle.innerText = leagueName;
  leagueImg.setAttribute("src", imgSrc);
  leagueImg.setAttribute("alt", leagueName);
  leagueImg.setAttribute("title", leagueName);
  endDateLeague.innerText = endDate;
}

function changeTeamData(data) {
  const teamLastUpdated = new Date(data.lastUpdated).toDateString();
  const teamNation = data.area.name;
  const teamName = data.name;
  const teamCrestSrc = data.crestUrl;
  const teamFounded = data.founded;
  const teamWebsite = data.website;
  const teamColor = data.clubColors;
  let teamVenue = data.venue;
  const clubNameSince = `${teamName}<sup>since ${teamFounded}</sup>`;

  const teamLastUpdatedEl = document.querySelector('.last-updated span');
  const teamNationEl = document.querySelector('.last-updated span.new.badge');
  const teamNameEl = document.querySelector('h4.team-name');
  const teamLogoEl = document.querySelector('img.club-logo');
  const teamWebsiteEl = document.querySelector('#team-website');
  const teamColorEl = document.querySelector('#team-color');
  const teamVenueEl = document.querySelector('#team-venue');

  if (teamVenue === null) {
    teamVenue = "-";
  }

  teamLastUpdatedEl.innerText = teamLastUpdated;
  teamNationEl.setAttribute('data-badge-caption', teamNation);
  teamNameEl.innerHTML = clubNameSince;
  teamLogoEl.setAttribute('src', teamCrestSrc);
  teamLogoEl.setAttribute('alt', teamName);
  teamLogoEl.setAttribute('title', teamName);
  teamWebsiteEl.innerHTML = `<a href="${teamWebsite}" target="_blank">${teamWebsite}</a>`;
  teamColorEl.innerText = teamColor;
  teamVenueEl.innerText = teamVenue;
}

function showSquadMember(data) {
  let squadHTML = `
          <div class="row">
            <div class="col s1"><b>#</b></div>
            <div class="col s3"><b>Name</b></div>
            <div class="col s3"><b>Position</b></div>
            <div class="col s3"><b>Nationality</b></div>
            <div class="col s2"><b>Role</b></div>
          </div><hr>
        `;
  data.squad.forEach(squad => {
    let shirtNumber = "";
    let position = "";

    (squad.shirtNumber === null) ? (shirtNumber = "-") : (shirtNumber = squad.shirtNumber);
    (squad.position === null) ? (position = "-") : (position = squad.position);

    squadHTML += `
            <div class="row">
              <div class="col s1">${shirtNumber}</div>
              <div class="col s3">${squad.name}</div>
              <div class="col s3">${position}</div>
              <div class="col s3">${squad.nationality}</div>
              <div class="col s2">${squad.role}</div>
            </div><hr>
          `;
  });

  document.getElementById("squad-member").innerHTML = squadHTML;
}

function inputCards(team) {
  let card;
  let src = team.crestUrl;
  let nation = team.area.name;

  // memperpendek nama negara ceko
  if (nation === "Czech Republic") {
    nation = "Czech";
  }

  card = `
        <div class="col s12 m4 l3 card-wrapper">
          <div class="card">
            <a href="./team.html?id=${team.id}">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${src.replace(/^http:\/\//i, 'https://')}" class="responsive-img" 
                alt="${team.shortName}" title="${team.shortName}"/>
              </div>
            </a>
            <div class="card-content center-align">
              <span class="card-title">${team.shortName}</span>
            </div>
            <div class="card-action">
              <span class="col s6 left-align founded">${team.founded}</span>
              <span class="col s6 right-align nation">${nation}</span>
            </div>
          </div>
        </div>
        `;

  return card;
}