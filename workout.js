// Replace with your Google Sheet ID and API key
const SPREADSHEET_ID = "1fhO6DkJriUWq8vPjqNx3huiFO_OPxmiu-pSIvoiJEDM";
const API_KEY = "AIzaSyBAJJJy5vAYssuSgwCzzE-2UBjCQDbsflA";

// Helper to get URL query parameters
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

const week = getQueryParam("week") || "Week1";
const day = getQueryParam("day");

const dayRanges = {
      "Pull #1": "B5:P10",
      "Push #1": "B11:P16",
      "Legs #1": "B18:P22",
      "Arms and Weak Points #1": "B23:P29",
      "Pull #2": "B34:P39",
      "Push #2": "B40:P45",
      "Legs #2": "B47:P52",
      "Arms and Weak Points #2": "B53:P59"
};

const RANGE = dayRanges[day];

if (!RANGE) {
  document.querySelector("#workoutTable tbody").innerHTML =
    "<tr><td colspan='4'>Invalid day selected.</td></tr>";
} else {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${week}!${RANGE}?key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#workoutTable tbody");
      tbody.innerHTML = ""; // clear table

      if (!data.values || data.values.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No data found for this day.</td></tr>";
        return;
      }

      data.values.forEach(row => {
        const tr = document.createElement("tr");
        // Adjust column indexes depending on your sheet
        const cols = [0,1,2,3]; // Exercise, Weight, Reps, Notes
        cols.forEach(i => {
          const td = document.createElement("td");
          td.textContent = row[i] || "";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Error fetching sheet:", err));
}
