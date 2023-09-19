const eventController = require("../DL/event.controller");
const mailInterface = require("./emailInterface");
const eventModel = require("../DL/event.model");
const settingService = require("../BL/setting.services");
const errController = require("../errController");

async function newCreateNewEvent(eventData) {
  const dates = [];
  let startDate = new Date(eventData.date);
  if (
    eventData.repeatType == "daily" ||
    (eventData.repeatType == "customized" && eventData.personalRepeat == "days")
  ) {
    console.log(startDate);
    const dayList = dailyRepetition(
      startDate,
      eventData.repeatTimes,
      eventData.repeatType,
      eventData.repeatSettingsPersonal.type,
      eventData.repeatSettingsPersonal.dateEnd.date,
      eventData.repeatSettingsPersonal.timesEnd
    );
    eventData.date = dayList;
  } else if (
    eventData.repeatType == "weekly" ||
    (eventData.repeatType == "customized" &&
      eventData.personalRepeat == "weeks")
  ) {
    const weekDaysList = weeklyRepetition(
      startDate,
      eventData.repeatType,
      eventData.repeatTimes,
      eventData.repeatSettingsPersonal.type,
      eventData.repeatSettingsPersonal.dateEnd,
      eventData.repeatSettingsPersonal.timesEnd,
      eventData.days
    );
    eventData.date = weekDaysList;
  } else {
    console.log("disposable");
    dates.push(new Date(startDate));
    eventData.date = dates;
  }
  const newEvent = await eventController.create(eventData);
  console.log(eventData.date);
  console.log(newEvent);
  return newEvent;
}

function dailyRepetition(
  startDate,
  repeatTimes,
  repeatType,
  endType,
  repeatDateEnd,
  repeatTimesEnd
) {
  // startDate = new Date(startDate);
  const dates = [];
  let endDate = new Date();
  const times = Number(repeatTimes);

  if (repeatType == "daily") {
    endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate()
    );
  }
  if (repeatType == "customized") {
    if (endType == "endDate") {
      endDate = new Date(repeatDateEnd);
      endDate <
      new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
      )
        ? endDate
        : (endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate()
          ));
    } else {
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + (repeatTimesEnd - 1) * times + 1
      );
      endDate <
      new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
      )
        ? endDate
        : (endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate()
          ));
    }
  }
  while (startDate <= endDate) {
    let currentDate = new Date(startDate);
    dates.push(currentDate);
    startDate = new Date(startDate.setDate(startDate.getDate() + times));
  }
  return dates;
}

function weeklyRepetition(
  startDate,
  repeatType,
  repeatTimes,
  endType,
  repeatDateEnd,
  repeatTimesEnd,
  days
) {
  const dates = [];
  let endDate = new Date();
  let repeat = 1;

  let times = repeatTimes;

  if (times == 2) {
    repeat = 8;
  }

  const filteredArray = days.filter((obj) => Object.keys(obj).length !== 0);
  const daysName = filteredArray.map((d) => d.day);

  if (
    repeatType == "weekly" ||
    (repeatType == "customized" && endType == "endDate")
  ) {
    if (repeatType == "weekly") {
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate() - 1
      );
      const today = startDate.getDay();
      console.log("daysname", daysName);
      daysName.push(today);
    }

    if (repeatType == "customized" && endType == "endDate") {
      endDate = new Date(repeatDateEnd.date);
      endDate <=
      new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
      )
        ? endDate
        : (endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate()
          ));
    }

    while (startDate <= endDate) {
      if (daysName.includes(startDate.getDay())) {
        let currentDate = new Date(startDate);
        dates.push(currentDate);
      }
      startDate.getDay() == 6
        ? (startDate = new Date(
            startDate.setDate(startDate.getDate() + repeat)
          ))
        : (startDate = new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  }
  if (repeatType == "customized" && endType == "endNumTimes") {
    endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate()
    );
    let counter = 0;
    while (startDate <= endDate && counter < repeatTimesEnd) {
      if (daysName.includes(startDate.getDay())) {
        let currentDate = new Date(startDate);
        dates.push(currentDate);
        counter++;
      }
      startDate.getDay() == 6
        ? (startDate = new Date(
            startDate.setDate(startDate.getDate() + repeat)
          ))
        : (startDate = new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  }
  return dates;
}

async function createNewEvent(eventData) {
  var dates = [];
  let repeat = 1;
  const days = eventData.days ? getDays(eventData.days) : null;
  switch (eventData.repeatType) {
    case " אירוע יומי":
      repeat = 1;
    case "אירוע שבועי":
      repeat = 7;
    case "בהתאמה אישית":
      if (eventData.personalRepeat === "שבועי") var personalrepeat = 1;
      else if (eventData.personalRepeat === "דו חודשי") var personalrepeat = 7;
      else if (eventData.personalRepeat === "ללא חזרה") var personalrepeat = 1;
  }
  if (
    eventData.repeatSettings?.type === "endDate" &&
    eventData.personalRepeat !== "ללא חזרה"
  ) {
    dates = getDatesWithEndDate(
      eventData.date,
      new Date(eventData.repeatSettings.repeatEnd),
      repeat,
      days,
      personalrepeat
    );
  } else {
    dates = getDatesWithNumberOfOccurrences(
      new Date(eventData.date),
      eventData.personalRepeat !== "ללא חזרה"
        ? eventData.repeatSettings.repeatEnd
        : days.length,
      repeat,
      days,
      personalrepeat
    );
  }
  eventData.date = dates;
  eventData.days = days;

  const newEvent = await eventController.create(eventData);
  return newEvent;
}
const getDays = (days) => {
  const newDays = days.map((day) => {
    switch (day.name) {
      case "א":
        return 0;
      case "ב":
        return 1;
      case "ג":
        return 2;
      case "ד":
        return 3;
      case "ה":
        return 4;
      case "ו":
        return 5;
      case "ש":
        return 6;
    }
  });
  return newDays;
};
function getDatesWithEndDate(startDate, endDate, repeat, days, personalrepeat) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (!personalrepeat) {
    console.log("currentDate", currentDate);
    while (currentDate <= endDateObj) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + repeat);
    }
  } else {
    let push = 0,
      indexInWeek = 1;
    while (currentDate <= endDateObj) {
      days.forEach((day) => {
        if (push < days.length && day === new Date(currentDate).getDay()) {
          dates.push(new Date(currentDate));
          push++;
        }
      });
      if (indexInWeek < 7) {
        currentDate.setDate(currentDate.getDate() + 1);
        indexInWeek++;
      } else {
        currentDate.setDate(currentDate.getDate() + personalrepeat);
        indexInWeek = 0;
        push = 0;
      }
    }
  }
  return dates;
}
function getDatesWithNumberOfOccurrences(
  startDate,
  endNumber,
  repeat,
  days,
  personalrepeat
) {
  const dates = [];
  let currentDate = new Date(startDate);
  if (!personalrepeat) {
    while (currentDate && endNumber > 0) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + repeat);
      endNumber--;
    }
  } else {
    let push = 0,
      indexInWeek = 1;
    while (currentDate && endNumber > 0) {
      days.forEach((day) => {
        if (push < days.length && day === new Date(currentDate).getDay()) {
          dates.push(new Date(currentDate));
          endNumber--;
          push++;
        }
      });
      if (indexInWeek < 7) {
        currentDate.setDate(currentDate.getDate() + 1);
        indexInWeek++;
      } else {
        currentDate.setDate(currentDate.getDate() + personalrepeat);
        indexInWeek = 0;
        push = 0;
      }
    }
  }
  return dates;
}

async function pagination(filterModel, page, startDate, endDate) {
  const pageSize = 10;
  const skipCount = (page - 1) * pageSize;
  const results = {};
  const endIndex = page * pageSize;
  const Query = [
    { $match: filterModel },
    {
      $addFields: {
        date: {
          $filter: {
            input: "$date",
            as: "date",
            cond: { $gte: ["$$date", startDate] },
          },
        },
      },
    },
    { $sort: { date: 1 ,beginningTime:1, eventName:1} },
    { $skip: skipCount },
    { $limit: pageSize },
  ];
  results.startDate = startDate;
  results.endDate = endDate;
  results.event = await eventModel.aggregate(Query);

  if (endIndex < (await eventModel.find(filterModel).countDocuments().exec())) {
    results.nextPage = page + 1;
  }

  return results;
}

async function findEvent(page, search, user, tag) {
  const now = new Date();
  let wordKeys= search.split(/\s+/)
  const filterModel = {
    $and: [
      ...wordKeys.map((word) => ({
        $or: [
          { place: { $regex: word, $options: "i" } },
          { eventName: { $regex: word, $options: "i" } },
        ],
      })),
    ],
    date: { $gte: now },
  };

  if(tag=="event"){
    let tagUpdate= tag
    tagUpdate = ["event","noTag"]
    filterModel.tag = { $in: tagUpdate }
  } else if(tag){
    {filterModel.tag = tag}
  }
  
  if (!user || user.userType !== "admin") {
    filterModel.status = "published";
  }

  return pagination(filterModel, page, now);
}

async function findEventSearch(
  location,
  btnDates,
  categories,
  audiences,
  page,
  user,
  tag
) {
  const now = new Date();
  // startDate endDate הגדרת
  const fixTimezoneHour = -3;
  const fixTimezoneMinute = 60 * fixTimezoneHour;
  let dayPas = new Date(now.getTime() + fixTimezoneMinute * 60 * 1000);
  dayPas.setHours(24 + fixTimezoneHour, 0, 0, 0);
  let startDate;
  let endDate;
  if (btnDates === "allDate") {
    startDate = now;
    endDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
  } // תאריך סיום בעוד 100 שנה
  else if (btnDates === "today") {
    startDate = now;
    endDate = dayPas;
  } else if (btnDates === "tomorrow") {
    startDate = dayPas;
    endDate = new Date(dayPas.getTime() + 24 * 60 * 60 * 1000);
  } else if (btnDates === "thisWeek") {
    startDate = now;
    const fixDateOfDay = new Date(
      now.getTime() + fixTimezoneMinute * 60 * 1000
    );
    const dayOfWeek = fixDateOfDay.getDay();
    const daysUntilEndOfWeek = (13 - dayOfWeek) % 7;
    endDate = new Date(
      dayPas.getTime() + daysUntilEndOfWeek * 24 * 60 * 60 * 1000
    );
  } else {
    throw errController.errMessage.SETTING_NOT_FOUND;
  }
  //סוף

  const matchQuery = {
    date: { $elemMatch: { $gte: startDate, $lt: endDate } },
  };

  if(tag=="event"){
    let tagUpdate= tag
    tagUpdate = ["event","noTag"]
    matchQuery.tag = { $in: tagUpdate }
  } else if(tag){
    {matchQuery.tag = tag}
  }

  if (typeof location === "string") {
    if (location.length > 0) {
      matchQuery.place = location;
    }
  } else if (Array.isArray(location)) {
    matchQuery.place = { $in: location };
  } else {
    throw errController.errMessage.SETTING_NOT_FOUND;
  }

  if (!user || user.userType !== "admin") {
    matchQuery.status = "published";
  }

  if (categories.length > 0) {
    matchQuery.categories = { $in: categories };
  }
  if (audiences.length > 0) {
    matchQuery.audiences = { $in: audiences };
  }

  return pagination(matchQuery, page, startDate, endDate);
}

async function findEventById(id) {
  const event = await eventController.readOne({ _id: id });
  return event;
}

async function findEventByID(id, currentDate) {
  const event = await eventController.readOne({ _id: id });
  const futureDates = event.date.filter(
    (date) => new Date(date) >= currentDate
  );
  event.date = futureDates.slice(0, 1);
  return event;
}

async function updateStatusEvent(id, newData) {
  const updateEvent = await eventController.update(id, newData);
  if(newData.status){
    const event = await findEventById(id);
    sendEventDetailsToAdvertiser(event.advertiser.email, event._id);
  }
  return updateEvent;
}

async function eventIsExists(id) {
  return await eventController.read({ id });
}

async function sendEventDetailsToAdvertiser(email, _id) {
  const eventData = await findEventById(_id);
  const {
    eventName,
    summary,
    advertiser,
    categories,
    audiences,
    registrationPageURL,
    date,
    beginningTime,
    finishTime,
    place,
    cardImageURL,
    coverImageURL,
  } = eventData;
  console.log({ registrationPageURL });
  const categoriesNames = await settingService.getCategorysNames(categories);
  const audiencesNames = await settingService.getAudiencesNames(audiences);
  const dateTimeString = await date
    .map((v) => new Date(v).toLocaleDateString("en-US"))
    .join(", ");

  const subject = "פורסם אירוע חדש - KorePo";
  const html = `
<div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
  <h1 style="color: #333; text-align: center;">איזה כיף, האירוע שלך פורסם!</h1>
  <button type="button" style="margin: 10px;"><h2> <a href="${
    process.env.CLAIENT_DOMAIN
  }/viewEvent/${_id}">לצפיה בדף האירוע שלך: ${eventName}</a></h2></button>
  <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
    <p>אלה פרטי האירוע שפרסמת:</p>
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333;">${eventName}</h3>
      <p><strong>מפרסם:</strong> ${advertiser.name}</p>
      <p><strong>טלפון:</strong> ${advertiser.tel}</p>
      <p><strong>מייל:</strong> ${advertiser.email}</p>
    </div>
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333;">פרטים על האירוע:</h3>
      <p><strong>קטגוריות:</strong> ${categoriesNames.join(", ")}</p>
      <p><strong>קהל יעד:</strong> ${audiencesNames.join(", ")}</p>
      <p><strong>תאריך האירוע:</strong> ${dateTimeString}</p>
      <p><strong>שעות האירוע:</strong> ${beginningTime}-${finishTime}</p>
      <p><strong>מיקום האירוע:</strong> ${place}</p>
      <p><strong>תיאור האירוע:</strong> ${summary}</p>
     ${
       registrationPageURL != null
         ? `<p><strong>דף הרשמה לאירוע:</strong> <a href="${registrationPageURL}">${registrationPageURL}</a></p>`
         : `<p><strong>לינק לדף הרשמה: </strong>לא הוזן</p>`
     }
    </div>
    <div>
      <h3 style="color: #333;">תמונות:</h3>
      <div style="display: flex; justify-content: space-between;">
        <img src="${cardImageURL}" alt="Image 1" width="100" height="100" style="margin-right: 10px;">
        <img src="${coverImageURL}" alt="Image 2" width="100" height="100" style="margin-left: 10px;">
      </div>
    </div>
  </div>
</div>`;

  await mailInterface.sendMail(email, subject, html);
}

module.exports = {
  newCreateNewEvent,
  createNewEvent,
  findEvent,
  findEventByID,
  findEventById,
  sendEventDetailsToAdvertiser,
  updateStatusEvent,
  findEventSearch,
};
