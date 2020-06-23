document.addEventListener("DOMContentLoaded", function () {
  let urlParams = new URLSearchParams(window.location.search);
  let isFromSaved = urlParams.get("saved");
  let idParam = Number(urlParams.get("id"));
  // let teamSaved = false;
  let item;
  let teamId;
  const btnSave = document.getElementById("save-button");

  if (isFromSaved) {
    // ambil artikel lalu tampilkan
    teamId = getSavedTeamById();
  } else {
    getTeamById()
      .then(response => {
        console.log(response);
        item = response;
        teamId = item.id;
      })
      .catch(err => {
        console.error(err);
        M.toast({
          html: `Can't connect to network or API request limit reached.`
        });
      });
  }

  getById(idParam)
    .then(team => {
      if (team) {
        btnSave.firstElementChild.innerText = 'favorite_border';
        btnSave.addEventListener('click', e => {
          if (isFromSaved) {
            deleteFavTeam(idParam);
            window.location.href = 'index.html#saved';
          } else {
            deleteFavTeam(idParam);
          }
        })
      } else {
        btnSave.firstElementChild.innerText = 'favorite';
        btnSave.addEventListener('click', e => {
          saveForLater(item);
        })
      }
    })
});