var webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BNyuYiLzZfpQiSLOFed8TV63x_Bh3RH8d2ZBB01x8waIyv82Fw0B3K8KnWKqVyIXCDSTq9KIYlEDQizqttC7S-s",
  "privateKey": "lTtBpCcd1C6GTFuHq3iCxEF65lcebuU5OE1De9hrHMY"
};


webPush.setVapidDetails(
  'mailto:adipati.cs.samsung@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
var pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/fb0lzrg-2QU:APA91bE0J7g7p89KlcIP-wPdroJba_A_keh4r-i89ahvgXyX5koa3SjHPGDJUf5vTJ8QB5LB_sUXNYACs3dw8e0-UGbF5pnqXbz8H0viMjVj83I_6LvrLXuyLTqOvqI6IyZmjBs9URWM",
  "keys": {
    "p256dh": "BP5rmPV1qXNueE41YQhl81kGqCJbwzbygWgoYLDqEknAhuHDtPFbEYkeCLWpm7ko26Cwtpo732YXF0hMxRn8r6w=",
    "auth": "zIxFFIhL2Ncp2exDWCDJVA=="
  }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
  gcmAPIKey: '567243452816',
  TTL: 60
};
webPush.sendNotification(
  pushSubscription,
  payload,
  options
);