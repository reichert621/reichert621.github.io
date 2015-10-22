
$(function() {
  console.log("Loaded!");

  var testText = "Let's Go! Tutoring";
  var endpoint = 1;

  var typer = setInterval(typeContent, 200);

  function typeContent() {
    var text = testText.slice(0, endpoint);

    $('#typed-message').text(text);

    if (endpoint === testText.length) {
      $('#blinker').addClass('animated infinite flash');
      clearInterval(typer);
    } else {
      endpoint++;
    }
  }

  $('#email-btn').on('click', function(e) {
    e.preventDefault();

    var name = $('#contact-name').val();
    var email = $('#contact-email').val();
    var message = $('#contact-message').val();

    console.log(name, email, message);

  });

});