/* Global Variables */
const apiKey = "21af180c679e889a71cae84d2f006f21";
// api.openweathermap.org/data/2.5/weather?zip={zip code}&appid={API key}&units=metric
const baseUrl = "http://api.openweathermap.org/data/2.5/weather?zip=";
let units = "metric";
let errors = [];

const generate = document.querySelector("#generate");

// Event listener on generate buttun
generate.addEventListener("click", (Event) => {
  event.preventDefault();
  errors = [];
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = (d.getMonth()+1) + "." + d.getDate() + "." + d.getFullYear();
  let zip = document.querySelector("#zip").value;
  let feeling = document.querySelector("#feel").value;
  let url = `${baseUrl}${zip}&appid=${apiKey}&units=${units}`;
  if (zip.length === 0) {
    errors.push("Enter zip code");
    handlingErrors();
    return;
  }
  // fetching data from weather api then send it to server then updating ui from data back from server
  let resultData = fetchAppData(url).then((resultData) => {
    //  check if the response went well
    if (resultData.cod !== 200) {
      errors.push(resultData.message);
      handlingErrors();
      return;
    }
    // Data to be sent to server
    let data = { temp: resultData.main.temp, newDate, feeling };
    // sending all data to server side then retrieving it and update ui
    sendDataToServer(data).then(() => upDatingUi());
  });
});

//  fetch data from openweather map
let fetchAppData = async (url) => {
  const answer = await fetch(url);
  try {
    let result = await answer.json();
    return result;
  } catch (error) {
    console.log("error:" + error);
  }
};
// send data to server side
let sendDataToServer = async (data) => {
  fetch("/add", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// updating UI
const upDatingUi = async () => {
  const request = await fetch("/all");
  try {
    // Transform into JSON
    const data = await request.json();
    document.querySelector(".error").classList.add("hide");
    document.querySelector("#entryHolder").classList.remove("hide");
    // updated UI
    document.querySelector("#temp").innerHTML =
      "Tempreture : " + data.temp + " <sup>o</sup>C";
    document.querySelector("#date").innerHTML = "Date: " + data.newDate;
    if (data.feeling.length > 0) {
      document.querySelector("#content").innerHTML =
        "Feeling : " + data.feeling;
    }
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};

// showing errors in ui
function handlingErrors() {
  if (errors.length > 0) {
    console.log(errors);
    document.querySelector("#entryHolder").classList.add("hide");
    let errorArea = document.querySelector(".error");
    errorArea.innerHTML = errors;
    errorArea.classList.remove("hide");
  }
}
