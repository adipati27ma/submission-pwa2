const savedButton = document.querySelector('.saved-button-only');

savedButton.addEventListener('click', function () {
  window.location.hash = '#saved';
  window.location.reload();
});