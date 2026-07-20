import axios from "axios";

import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { BASE_URL } from "@redux/services/apiConfig";

const descargarArchivo = async (idCertificado, token, dispatch) => {
  try {
    const url = `${BASE_URL}descargar_certificado/${idCertificado}`;

    const response = await axios.get(url, {
      responseType: "blob", // Indica que esperas una respuesta tipo 'blob'
      headers: { Authorization: `Bearer ${token}` }, // Asume autenticación mediante token
    });

    const blobUrl = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    window.open(blobUrl, "_blank").focus();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    triggerNotification(dispatch, {
      message: "Error al descargar el archivo. Por favor, inténtalo de nuevo.",
      type: "error",
    });
    console.error("Error al descargar el archivo:", error);
  }
};

export default descargarArchivo;
