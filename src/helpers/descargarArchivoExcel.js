import axios from "axios";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const descargarArchivoExcel = async (token, idEvento, idTaller, dispatch) => {
  try {
    // Determina la URL base según si `idTaller` está presente o no

       const BASE_URL = idTaller
      ? `https://mdlk8s.ucuenca.edu.ec/ms/pentagono-d360/api/eventos/${idEvento}/inscritos/${idTaller}`
      : `https://mdlk8s.ucuenca.edu.ec/ms/pentagono-d360/api/eventos/${idEvento}/inscritos`;

   /*const BASE_URL = idTaller
      ? `https://desa-k8s.ucuenca.edu.ec/ms/pentagono-d360/api/eventos/${idEvento}/inscritos/${idTaller}`
      : `https://desa-k8s.ucuenca.edu.ec/ms/pentagono-d360/api/eventos/${idEvento}/inscritos`;*/

      

    const response = await axios.get(BASE_URL, {
      responseType: "blob", // Indica que esperas una respuesta tipo 'blob'
      headers: { Authorization: `Bearer ${token}` }, // Asume autenticación mediante token
    });

    // Obtener el nombre del archivo desde el encabezado `Content-Disposition`
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'inscritos.xlsx'; // Valor predeterminado en caso de que no se encuentre el nombre

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/);
      if (filenameMatch && filenameMatch[2]) {
        filename = filenameMatch[2]; // Captura el nombre del archivo
      }
    }

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    );

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Usar el nombre del archivo obtenido
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    triggerNotification(dispatch, {
      message: "Error al descargar el archivo. Por favor, inténtalo de nuevo.",
      type: "error",
    });
    console.error("Error al descargar el archivo:", error);
  }
};

export default descargarArchivoExcel;
