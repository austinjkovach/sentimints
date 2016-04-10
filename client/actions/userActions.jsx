import $ from 'jquery';


class UserActions {
  getAllReviews(name) {
    let name = encodeURIComponent(name);
    let uri = '/api/mint?business_name=' + name
    $.ajax({ url: uri })
      .done((data) => {
        console.log('GOT DATA!', data);
        return data;
      })
      .fail((err) => {
        console.error("Didn't get data :(", err);
        throw err;
      });
  }

  getReviewsByStars(name, stars) {
    let name = encodeURIComponent(name);
    let uri = '/api/mint/stars?business_name=' + name + '&business_stars=' + stars[0] + '_' + stars[1];
    $.ajax({url: uri})
      .done((data) => {
        console.log('GOT DATA!', data);
        return data;
      })
      .fail((err) => {
        console.error("Didn't get data :(", err);
        throw err;
      });
  }

  getReviewsByDate(name, dateRange) {
    let name = encodeURIComponent(name);
    let uri = '/api/mint/date?business_name=' + name + '&business_dates=' + dateRange[0] + '_' + dateRange[1];
    $.ajax({url: uri})
      .done((data) => {
        console.log('GOT DATA!', data);
        return data;
      })
      .fail((err) => {
        console.error("Didn't get data :(", err);
        throw err;
      });
  }

}

export default UserActions;