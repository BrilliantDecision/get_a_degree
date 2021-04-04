const sidebarBox = document.querySelector('#box'),
sidebarBtn = document.querySelector('#btn'),
pageWrapper = document.querySelector('#page');

sidebarBtn.addEventListener('click', event => {
  sidebarBtn.classList.toggle('active');
  sidebarBox.classList.toggle('active');
});

pageWrapper.addEventListener('click', event => {

  if (sidebarBox.classList.contains('active')) {
    sidebarBtn.classList.remove('active');
    sidebarBox.classList.remove('active');
  }
});
