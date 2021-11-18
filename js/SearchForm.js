class SearchForm {
  constructor(element) {
    const div = document.createElement("div");
    div.className = "searchbar";
    const input = document.createElement("input");
    input.id = "searchInput";
    input.className = "input";
    input.type = "text";
    input.onkeyup = "debouncedInputValue(this.value)";
    input.placeholder = "Search for stocks, ETF's & more";
    const button = document.createElement("button");
    button.className = "submit";
    button.type = "submit";
    button.textContent = "Search";

    let timer;
    input.addEventListener("keyup", async ({ target }) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.stocksListURL(target.value);
      }, 500);
    });

    button.addEventListener("click", () => {
      if (!input.value) {
        return;
      }
      this.stocksListURL(input.value);
    });
    div.appendChild(input);
    div.appendChild(button);
    element.appendChild(div);
    this.searchBar = div;
    this.input = input;
    this.submit = button;
    this.addCompareBlock();
  }
  onSearch(fun) {
    this.callback = fun;
  }
  stocksListURL(searchInput) {
    if (!searchInput) return;
    let loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.remove(".loader");
    } else {
      loader = document.createElement("div");
      loader.classList.add("loader");
      this.searchBar.appendChild(loader);
      this.submit.style.display = "none";
      const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
      fetch(url)
        .then((response) => response.json())
        .then(async (data) => {
          const symbols = [];
          for (let i = 0; i < data.length; i++) {
            symbols.push(data[i]["symbol"]);
          }
          const profiles = await Promise.all(
            symbols.map((symb) => getCompanyProfile(symb))
          );
          loader.classList.remove("loader");
          this.submit.style.display = "block";
          this.callback(profiles);
        });
    }
  }
  addCompareBlock() {
    const compareButton = document.createElement("button");
    compareButton.innerHTML = "Compare";
    compareButton.className = "compareButton";

    compareButton.addEventListener("click", () => {
      const companies = [];
      compareContainer
        .querySelectorAll(".compare-company")
        .forEach((company) => {
          const companyName = company.innerText;
          companies.push(companyName);
        });

      const link = `compare.html?symbols=${companies.join()}`;
      window.location.href = link;
    });

    const compareContainer = document.createElement("div");
    compareContainer.id = "compare-container";
    compareContainer.appendChild(compareButton);
    document.querySelector("header").append(compareContainer);
  }
}
