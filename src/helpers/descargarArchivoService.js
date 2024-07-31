import axios from "axios";

import { triggerNotification } from "@redux/features/notification/notificationSlice";

const descargarArchivo = async (idCertificado, token, dispatch) => {
  try {
    const BASE_URL = `http://localhost:5000/descargar_certificado/${idCertificado}`;

    const response = await axios.get(BASE_URL, {
      responseType: "blob", // Indica que esperas una respuesta tipo 'blob'
      headers: { Authorization: `Bearer ${token}` }, // Asume autenticación mediante token
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    window.open(url, "_blank").focus();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    triggerNotification(dispatch, {
      message: "Error al descargar el archivo. Por favor, inténtalo de nuevo.",
      type: "error",
    });
    console.error("Error al descargar el archivo:", error);
  }
};

export default descargarArchivo;
