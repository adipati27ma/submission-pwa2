document.addEventListener("DOMContentLoaded", function () {
  let urlParams = new URLSearchParams(window.location.search);
  let isFromSaved = urlParams.get("saved");

  let btnSave = document.getElementById("save");

  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    btnSave.style.display = 'none';

    // ambil artikel lalu tampilkan
    getSavedTeamById();
  } else {
    var item = getTeamById();
  }

  btnSave.onclick = function () {
    console.log("Saved button clicked.");
    item.then(function (team) {
      saveForLater(team);
    });
  }
});