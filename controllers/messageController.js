module.exports = (source, options) => {
  let response;
  options = options || {};

  switch (source) {
    case "/start":
      response = `Привіт, ${options.name}!\nЯ допоможу тобі не пропустити круті заходи від комітету міжнародних відносин нашої Альма-матері!\nНатисни /help для детальної інформації`;
      break;
    case "/help":
      response = `<b>Ось всі мої команди, що стануть тобі у нагоді:</b>\n\n/events - перелік майбутніх заходів\n/notify - повідомлення від боту будуть надходити у звичайному режимі\n/silent - повідомлення від боту будуть надходити без звуку\n/stop - припинити розсилку повідомлень (невже це взагалі може комусь знадобитися?...)\n\nДля того щоб стати адміністратором надішліть мені код`;
      if (options.isAdmin)
        response += `\nДля того щоб перестати бути адміністратором надішліть мені код\n\n/create_event - створити захід\n/delete_event - видалити захід\nЗаходи автоматично видаляються при настанні дати, зазначеної при створенні\n\nПовідомлення про заходи надсилатимуться у форматі:\n\n<b>Назва заходу</b>\n<b>Дата:</b> 01.01.2021\n<b>Час:</b> 13:45\n<b>Опис:</b>\nОпис`;
      break;
    case "/stop":
      response = `Повідомлення були успішно вимкнені! Щоб знову увімкнути повідомлення надішліть /start`;
      break;
    case "/silent":
      response = `Безшумні повідомлення були успішно активовані!`;
      break;
    case "/notify":
      response = `Безшумні повідомлення були успішно вимкнені!`;
      break;
    case "/admin":
      response = {
        add: `Ви успішно стали адміністратором. Щоб ознайомитися з новими можливостями, скористайтеся командою /help`,
        remove: `Ви успішно перестали бути адміністратором`,
      };
      break;
    case "/create_event":
      response = {
        success: `Захід був успішно створений`,
        provideName: `Напишіть назву майбутнього заходу`,
        provideDate: `Напишіть дату майбутнього заходу у форматі дд.мм.рррр год:хв\nНаприклад: <b>31.12.1999 12:30</b>`,
        provideDescription: `Напишіть опис заходу`,
        nameErr: `ПОМИЛКА: назва заходу має бути унікальним`,
        dateErr: `ПОМИЛКА: вкажіть майбутню дату у форматі дд.мм.рррр год:хв\nНаприклад: <b>31.12.1999 12:30</b>`,
        timeErr: `ПОМИЛКА: час заходу має вказуватися в рамках роботи робота (7:00-23:59)`,
        adminErr: `ПОМИЛКА: ви не є адміністратором`,
      };
      break;
    case "/delete_event":
      response = {
        success: `Захід було успішно видалено`,
        provideName: `Напишіть назву заходу, який ви хочете видалити`,
        nameErr: `ПОМИЛКА: вкажіть назву існуючого заходу. Переглянути перелік заходів можна за допомогою команди /events`,
        adminErr: `ПОМИЛКА: ви не є адміністратором`,
      };
      break;
    case "/events":
      response = {
        createEventsAnswer(events) {
          if (events.length === 0) return `Жодних заходів поки не заплановано`;

          let response = `<b>Заходи:</b>\n\n`;
          events.forEach((event, i) => {
            response += `<b>${i + 1}.${event.name}</b>\n`;
            response += `<b>Дата:</b> ${event.date.getDate()}.${
              event.date.getMonth() + 1
            }.${event.date.getFullYear()}\n`;
            response += `<b>Час:</b> ${
              event.date.getHours() < 10
                ? `0${event.date.getHours()}`
                : event.date.getHours()
            }:${
              event.date.getMinutes() < 10
                ? `0${event.date.getMinutes()}`
                : event.date.getMinutes()
            }\n`;
            response += `<b>Опис:</b>\n${event.description}\n\n`;
          });

          return response;
        },
      };
      break;
    case "event":
      response = {
        responses: [
          "Хей, у мене чудова новина! Незабаром буде захід!",
          "Привіт. Тут скоро буде класний івент і я думаю тобі варто на нього сходити!",
          "Як справи?) Я просто хотів нагадати що тут трохи залишилося до крутого івенту)",
        ],
        getRandomNotification(event) {
          const randEl = Math.floor(Math.random() * this.responses.length);
          let response = this.responses[randEl];

          response += `\n\n<b>Назва:</b> ${event.name}\n`;
          response += `<b>Дата:</b> ${event.date.getDate()}.${
            event.date.getMonth() + 1
          }.${event.date.getFullYear()}\n`;
          response += `<b>Час:</b> ${
            event.date.getHours() < 10
              ? `0${event.date.getHours()}`
              : event.date.getHours()
          }:${
            event.date.getMinutes() < 10
              ? `0${event.date.getMinutes()}`
              : event.date.getMinutes()
          }\n`;
          response += `<b>Опис:</b>\n${event.description}\n\n`;

          return response;
        },
      };
      break;
  }

  return response;
};
