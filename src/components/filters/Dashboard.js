import moment from 'moment';

export default {
  formatHours(val) {
    if (!val) {
      return '-';
    }
    const date = val.toDate();
    return moment(date).fromNow();
  },
  formatDate(val) {
    if (!val) {
      return '-';
    }
    const date = val.toDate();
    return `${moment(date).month() + 1} - ${moment(date).date()} - ${moment(
      date,
    ).year()}`;
  },
  trimLength(val) {
    if (val.length < 200) {
      return val;
    }
    return `${val.substring(0, 200)}...`;
  },
};
