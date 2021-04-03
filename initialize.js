var s = new sigma();
s.addCamera('cam0');
s.addRenderer({
  container: document.getElementById("container"),
  camera: 'cam0',
})
s.refresh();
