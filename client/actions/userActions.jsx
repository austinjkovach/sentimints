class UserActions {
  getAllReviews() {
    $.ajax({ url: '/api/' })
      .done((data) => {
        console.log('GOT DATA!', data);
        return data;
      })
      .fail((err) => {
        console.error("Didn't get data :(", err);
        throw err;
      });
  }

  getSomeReviews(data) {
    $.ajax({ 
      type: 'POST',
      url: '/api/',
      data: data})
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