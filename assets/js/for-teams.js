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

  // cek team saved/belum
  getById(idParam)
    .then(team => {
      if (team) {
        btnSave.firstElementChild.innerText = 'favorite';
      } else {
        btnSave.firstElementChild.innerText = 'favorite_border';
      }
    });

  btnSave.onclick = async function () {
    console.log("Saved button clicked.");
    const isTeamSaved = await getById(idParam);

    if (!isTeamSaved) {
      btnSave.firstElementChild.innerText = 'favorite';
      saveForLater(item);
    } else {
      if (isFromSaved) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You will remove this team from favorite.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
          if (result.value) {
            btnSave.firstElementChild.innerText = 'favorite_border';
            deleteFavTeam(teamId);
            window.location.href = 'index.html#saved';
          }
        })
      } else {
        btnSave.firstElementChild.innerText = 'favorite_border';
        deleteFavTeam(item.id);
      }
    }
  }
});