// Utilidades para manejo de fechas
export const getTimeLeft = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = Math.max(0, Math.floor((deadlineDate - now) / (1000 * 60 * 60)));
  const daysLeft = Math.floor(hoursLeft / 24);
  const hoursRemainder = hoursLeft % 24;

  if (daysLeft > 0) {
    return `${daysLeft}d ${hoursRemainder}h`;
  }
  return `${hoursLeft}h`;
};

export const isDeadlineUrgent = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = Math.floor((deadlineDate - now) / (1000 * 60 * 60));
  return hoursLeft <= 24;
};

export const formatDeadlineDate = (deadline) => {
  const date = new Date(deadline);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};