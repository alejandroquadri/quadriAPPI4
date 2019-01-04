import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

export function send(snapshot:any, context:any) {

  const user = functions.config().gmail.user;
  const pass = functions.config().gmail.pass;
  const mailTransport = nodemailer.createTransport(`smtps://${user}:${pass}@smtp.gmail.com`);

  const consulta = snapshot.val();

  let price;
  consulta.purchase ? price = `$${consulta.purchase.price}` : price = '';

  const mailOptions = {
    from: `"Queo" <info@queo.com.ar>`,
    to: "ale@quadri.com.ar",
    subject: `Queo - ${consulta.origin}`,
    text : `${consulta.name} - ${consulta.email} - ${consulta.telephone || ''}\n \n${consulta.query || ''} \n${price} \n${consulta.readablePurchase || ''}`
  };

  return mailTransport.sendMail(mailOptions)
  .then(() => {
    console.log('New query sent');
  }).catch(error => {
    console.error('There was an error while sending the email:', error);  
  });
}