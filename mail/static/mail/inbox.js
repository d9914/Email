document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  document.querySelector("#compose-form").addEventListener("submit", send_mail);



  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#emails-view").style.display = "none";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function reply_email(){

}

function view_mail(email_id) {
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
    
      document.querySelector("#emails-view").style.display = "none";
      document.querySelector("#compose-view").style.display = "none";
      
      const detailView = document.querySelector("#emails-detail-view");
      detailView.style.display = "block";

      detailView.innerHTML = "";
    
      const detailEmail = document.createElement("div");
      detailEmail.innerHTML = `
  <div class="card mb-3">
    <div class="card-body">
      <h6 class="card-title font-weight-bold">Sender: ${email.sender}</h6>
      <h5 class="card-subtitle mb-2">Subject: ${email.subject}</h5>
      <p class="card-text">Time: ${email.timestamp}</p>
      <hr class="my-4">
      <p class="card-text">${email.body}</p>
      <button id="reply" type="button" class="btn btn-primary">Reply</button>
    </div>
  </div>
`;
      detailView.append(detailEmail);
    });
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#emails-detail-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  fetch(`/emails/${mailbox}`)
  .then((response) => response.json())
  .then((emails) => {

    for (const email of emails) {
      const newEmail = document.createElement('div');
      newEmail.className="list-group-item border-dark rounded"
      if (email.read) {
        newEmail.style.backgroundColor = 'lightgrey';
      } else {
        newEmail.style.backgroundColor = 'white';
      }
      newEmail.innerHTML = `<h6>Sender: ${email.sender}</h6> 
        <h5>Subject: ${email.subject} </h5>
        <p>Time: ${email.timestamp} </p>`;
        newEmail.addEventListener('click', function(){
          view_mail(email.id);
        }); 
      document.querySelector('#emails-view').append(newEmail);
    }
  });
}

function send_mail(event) {
  event.preventDefault();
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;
  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      load_mailbox("sent");
    });
}
