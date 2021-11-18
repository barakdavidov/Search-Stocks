class Marquee {
  constructor(element) {
    this.element = element;
    this.url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/gainers?";
    this.tickerItem = "";
  }
  async load() {
    await this.getStocks();
    const wrapper = document.createElement("div");
    wrapper.id = "ticker-wrapper";
    const prime = document.createElement("div");
    prime.id = "tickerPrime";
    const second = document.createElement("div");
    second.id = "tickerSecond";
    prime.innerHTML = `<p>${this.tickerItem}</p>`;
    second.innerHTML = `<p>${this.tickerItem}</p>`;
    wrapper.append(prime, second);
    this.element.append(wrapper);
  }
  async getStocks() {
    const response = await fetch(this.url);
    const data = await response.json();
    this.tickerItem = "";
    for (let x of data) {
      this.tickerItem += `${x["ticker"]} <span style="color: #137333;">$${x["price"]}  &nbsp </span>`;
    }
  }
}
