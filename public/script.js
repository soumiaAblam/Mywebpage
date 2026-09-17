// Script para subir la foto del currículum (solo en el navegador, no se guarda en el servidor)
const photoInput = document.getElementById('photoInput') as HTMLInputElement;
const photoContainer = document.getElementById('photoContainer') as HTMLDivElement;

photoInput.addEventListener('change', (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    const result = ev.target?.result as string;
    photoContainer.innerHTML = `<img src="${result}" alt="Foto de Soumia Ablam">`;
  };
  reader.readAsDataURL(file);
});