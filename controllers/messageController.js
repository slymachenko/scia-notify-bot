module.exports = (source, options) => {
  let response;
  options = options || {};

  switch (source) {
    case "/start":
      response = `Привет ${options.name}!\nЯ помогу тебе не пропустить крутые мероприятия от комитета нашей Альма-матер!\n/help для большей информации`;
      break;
    case "/help":
      response = `<b>Вот все команды которые могут тебе пригодиться:</b>\n\n/stop - остановит рассылку уведомлений (кому это вообще может понадобиться)\n/silent - бот будет отправлять тебе безшумные уведомления о мероприятиях\n/notify - бот будет отправлять тебе обычные уведомления о мероприятиях\n/events - список предстоящих мероприятий\n\nЧтобы стать администратором - пришлите мне код`;
      if (options.isAdmin)
        response += `\nЧтобы перестать быть администратором пришлите мне тот же код\n\n/create_event - создать мероприятие\n/delete_event - удалить мероприятие\nКак только наступит дата указаная при создании мероприятия, оно автоматически будет удалено\n\nУведомления о мероприятиях будут присылаться в формате:\n\n<b>Название мероприятия</b>\n<b>Дата:</b> 01.01.2021\n<b>Описание:</b>\nОписание`;
      break;
    case "/stop":
      response = `Уведомления были успешно отключены! Чтобы снова включить уведомления напишите мне.`;
      break;
    case "/silent":
      response = `Безшумные уведомления были успешно активированы!`;
      break;
    case "/notify":
      response = `Безшумные уведомления были успешно выключены!`;
      break;
    case "/admin":
      response = {
        add: `Вы успешно стали администратором`,
        remove: `Вы успешно перестали быть администратором`,
      };
      break;
    case "/create_event":
      response = {
        success: `Мероприятие было успешно создано`,
        provideName: `Напишите название будущего мероприятия`,
        provideDate: `Напишите дату будущего мероприятия в формате дд.мм.гггг чч:мм\nНапример: <b>31.12.1999 12:30</b>`,
        provideDescription: `Напишите описание мероприятия`,
        nameErr: `ОШИБКА: имя мероприятия должно быть уникальным`,
        dateErr: `ОШИБКА: укажите будущюю дату в формате дд.мм.гггг чч:мм\nНапример: <b>31.12.1999 12:30</b>`,
        timeErr: `ОШИБКА: время мероприятия должно указываться в рамках работы бота (7:00-23:59)`,
        adminErr: `ОШИБКА: вы не являетесь администратором`,
      };
      break;
    case "/delete_event":
      response = {
        success: `Мероприятие было успешно удалено`,
        provideName: `Напишите название мероприятия, которое вы хотите удалить`,
        nameErr: `ОШИБКА: укажите имя существующего мероприятия. Посмотреть список мероприятия можно используя команду /events`,
        adminErr: `ОШИБКА: вы не являетесь администратором`,
      };
      break;
    case "/events":
      response = {
        createEventsAnswer(events) {
          if (events.length === 0)
            return `Никаких мероприятий пока не запланировано`;

          let response = `<b>Мероприятия:</b>\n\n`;
          events.forEach((event, i) => {
            response += `<b>${i + 1}.${event.name}</b>\n`;
            response += `<b>Дата:</b> ${event.date.getDate()}.${
              event.date.getMonth() + 1
            }.${event.date.getFullYear()}\n`;
            response += `<b>Время:</b> ${
              event.date.getHours() < 10
                ? `0${event.date.getHours()}`
                : event.date.getHours()
            }:${
              event.date.getMinutes() < 10
                ? `0${event.date.getMinutes()}`
                : event.date.getMinutes()
            }\n`;
            response += `<b>Описание:</b>\n${event.description}\n\n`;
          });

          return response;
        },
      };
      break;
    case "event":
      response = {
        responses: [
          "Хэй, у меня отличная новость! Скоро будет мероприятие!",
          "Привет. Тут скоро будет классный ивент и я думаю тебе стоит на него сходить!",
          "Как делишки?) Я просто хотел напомнить что тут недолго осталось до крутезного мероприятия)",
        ],
        getRandomNotification(event) {
          const randEl = Math.floor(Math.random() * this.responses.length);
          let response = this.responses[randEl];

          response += `\n\n<b>Название:</b> ${event.name}\n`;
          response += `<b>Дата:</b> ${event.date.getDate()}.${
            event.date.getMonth() + 1
          }.${event.date.getFullYear()}\n`;
          response += `<b>Время:</b> ${
            event.date.getHours() < 10
              ? `0${event.date.getHours()}`
              : event.date.getHours()
          }:${
            event.date.getMinutes() < 10
              ? `0${event.date.getMinutes()}`
              : event.date.getMinutes()
          }\n`;
          response += `<b>Описание:</b>\n${event.description}\n\n`;

          return response;
        },
      };
      break;
  }

  return response;
};
