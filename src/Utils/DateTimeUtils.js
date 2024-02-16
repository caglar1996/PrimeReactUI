export function DateTimeConvertTr(params) {
  const inputDateTime = new Date(params);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // 24 saat formatında
  };

  return inputDateTime.toLocaleString('tr-TR', options);
}
