class SearchResults {
  constructor(element) {
    this.element = element;
    this.search = document.getElementById("searchInput");
    this.companies = [];
  }

  renderResults(companyProfiles) {
    const searchInput = this.search;
    let dataList = "";
    companyProfiles.forEach((company) => {
      const { profile } = company;
      const profileChangesPercent = Number(profile.changesPercentage);
      let changesPercentage;
      if (profileChangesPercent >= 0) {
        changesPercentage = `<span style="color: green;"> ${profileChangesPercent.toFixed(
          2
        )}%</span>`;
      } else if (profileChangesPercent < 0) {
        changesPercentage = `<span style="color: red;"> ${profileChangesPercent.toFixed(
          2
        )}%</span>`;
      } else {
        changesPercentage = "";
      }
      let { companyName } = profile;
      let match = companyName.match(new RegExp(searchInput.value, "gi"));
      if (match) {
        companyName = companyName.replace(
          match[0],
          `<strong style="background: yellow;">${match[0]}</strong>`
        );
      }
      let { symbol } = company;
      match = symbol.match(new RegExp(searchInput.value, "gi"));
      if (match) {
        symbol = symbol.replace(
          match[0],
          `<strong style="background: yellow;">${match[0]}</strong>`
        );
      }

      dataList += `<li onclick="location.href='./html/company.html?symbol=${company.symbol}'">
        <span><img src='${profile.image}' width="30px" height="30px" onerror="this.src='./images/MonkeyPlaceholder.png'" alt="monkey"/ > 
        <p>${companyName}</p></span> <span><span style="font-weight:bold">${symbol}</span> <span>${changesPercentage}</span><span><button class="companyButton" data-company-name="${company.profile.companyName}">Compare</button></span></span></li>`;
    });

    this.element.innerHTML = `<ul>${dataList}</ul>`;

    this.bindButtonsClickEvent();
  }

  bindButtonsClickEvent() {
    document.querySelectorAll(".companyButton").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const { companyName } = button.dataset;

        if (this.companies.includes(companyName)) {
          return console.log("Company already exists!");
        }

        const company = document.createElement("div");
        company.classList.add("compare-company");
        company.id = "compareCompany";
        // compareCompany.innerText.add(`${object.symbol} &#10006`);
        company.innerHTML = companyName;
        document.querySelector("#compare-container").appendChild(company);

        this.companies.push(companyName);
      });
    });
  }
}
