const companyTitle = document.getElementById("company-title");
const companySymbol = document.getElementById("company-stock-symbol");
const companyLogo = document.getElementById("company-logo");
const companyCeo = document.getElementById("company-ceo");
const companyAddress = document.getElementById("company-address");
const companyWebsite = document.getElementById("company-website");
const employees = document.getElementById("employees");
const createdDate = document.getElementById("created");
const price = document.getElementById("price");
const companyDescription = document.getElementById("company-description");
const changesPercentage = document.getElementById("changesPercentage");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const symbol = window.location.search.replace("?symbol=", "");

if (symbol) {
  getCompanyProfile(symbol);
} else {
  alert("nothing has passed");
}

function getCompanyProfile(symbol) {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const profile = data.profile;
      companyTitle.textContent = profile.companyName;
      companySymbol.textContent = symbol;
      companyWebsite.innerHTML = `<a href>` + profile.website + `</a>`;
      companyCeo.textContent = profile.ceo;
      companyAddress.textContent =
        profile.address + ` ` + profile.city + ` ` + profile.state;
      employees.textContent = profile.fullTimeEmployees;
      createdDate.textContent = profile.ipoDate;
      companyDescription.textContent = profile.description;
      price.textContent = `Stock Price: $` + profile.price;
      const profileChangesPercent = Number(profile.changesPercentage);

      if (profileChangesPercent >= 0) {
        changesPercentage.classList.add(`green`);
      } else if (profileChangesPercent < 0) {
        changesPercentage.classList.add(`red`);
      }
      changesPercentage.textContent = profileChangesPercent.toFixed(2) + `%`;
      // set logo and placeholder in case of error
      const img = document.createElement(`img`);
      img.onerror = "this.src='./images/MonkeyPlaceholder.png'";
      img.src = profile.image;
      companyLogo.appendChild(img);
    })
    .catch((err) => {
      console.warn(`Something went wrong.`, err.message);
    });
}

// Object destructing
function chartIt(data) {
  let ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
    type: `line`,
    data: {
      labels: data.xAxis,
      datasets: [
        {
          label: `Historical Stock Price`,
          data: data.yAxis,
          backgroundColor: [`rgba(54, 162, 235, 0.2)`],
          borderColor: [`rgba(54, 162, 235, 1)`],
          fill: true,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, values) {
              return `$` + value;
            },
          },
        },
      },
    },
    type: `line`,
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });
}

async function historicalPrice() {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
  const historicalData = fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  let yAxis = [];
  let xAxis = [];

  await historicalData.then((history) => {
    console.log(`printHistory: `, history.historical);

    const arr = history.historical.reverse();
    arr.map((element) => {
      // (WIP)select year range...tie into user select date
      const start = new Date(`2005-01-01`);
      const end = new Date(`2021-11-01`);

      const elementDate = new Date(element.date);
      if (
        elementDate.getTime() >= start.getTime() &&
        elementDate.getTime() <= end.getTime()
      ) {
        xAxis.push(element.date);
        yAxis.push(element.close);
      }
    });
  });

  chartIt({ xAxis, yAxis });
}
//Auto change End Date based on Start Date
$(`#startDate`).on(`change`, function (e) {
  const d = new Date($(this).val());
  d.setFullYear(d.getFullYear() + 1);
  $(`#endDate`).val(d.toISOString().split("T")[0]);
});

historicalPrice();
