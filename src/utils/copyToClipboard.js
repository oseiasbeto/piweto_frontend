import { toast } from "vue3-toastify";

export default async function copyToClipboard(text) {
  // Método moderno (requer contexto seguro HTTPS ou localhost)
  await navigator.clipboard.writeText(text);
  toast("Copiado para a área de transferência!", {
    theme: "colored",
    position: "top-right",
    autoClose: 2000,
    type: "success",
  });
}
