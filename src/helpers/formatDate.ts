export default function formatDate(dateString : string) {
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря'
    ];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
    return `${day} ${month} ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }