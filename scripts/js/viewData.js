document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/formData.json")
    .then((response) => response.json())
    .then((data) => {
      const formData = document.getElementById("formData");
      formData.innerHTML += `
      <li style='color: wheat'>Nombre de la mascota: ${data.namePet}</li>
      <li style='color: wheat'>Fecha de nacimiento de la mascota: ${data.birthdatePet}</li>
      <li style='color: wheat'>Género de la mascota: ${data.gener}</li>
      <li style='color: wheat'>Imagen de la mascota: ${data.imagePet}</li>
      <li style='color: wheat'>Nombre del propietario: ${data.nameOwner}</li>
      <li style='color: wheat'>Número de teléfono del propietario: ${data.cellphone}</li>
    `;
    })
    .catch((error) => console.error("Error al obtener los datos:", error));
});
