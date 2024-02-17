const next = document.getElementById("next");
const previus = document.getElementById("previus");
const owner = document.querySelector(".dataPetOwner");
const pets = document.querySelector(".dataPets");
const form = document.getElementById("myForm");

next.addEventListener("click", () => {
  if (next.innerText === "Submit") {
    form.submit();
  } else {
    previus.classList.remove("previus");
    owner.style.display = "block";
    pets.style.display = "none";
    next.innerText = "Submit";
  }
});
previus.addEventListener("click", () => {
  previus.classList.add("previus");
  owner.style.display = "none";
  pets.style.display = "block";
  next.innerText = "Next";
});
