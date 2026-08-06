import React from 'react';

const EventTypeBadge = ({ type, typeName }) => {
  // 1: Jornada, 2: Charla, 3: Microtaller, 4: Observacion
  let bgHex = '';
  let textHex = '';
  switch (type) {
    case 1:
      bgHex = 'rgba(0, 31, 102, 0.1)';
      textHex = '#001F66';
      break;
    case 2:
      bgHex = 'rgba(166, 0, 0, 0.1)';
      textHex = '#a60000';
      break;
    case 3:
      bgHex = 'rgba(77, 77, 77, 0.1)';
      textHex = '#4d4d4d';
      break;
    case 4:
      bgHex = 'rgba(204, 204, 204, 0.3)';
      textHex = '#666666'; // Texto un poco más oscuro para asegurar legibilidad sobre gris claro
      break;
    default:
      bgHex = '#f3f4f6';
      textHex = '#374151';
  }

  return (
    <span 
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgHex, color: textHex }}
    >
      {typeName}
    </span>
  );
};

export default EventTypeBadge;
