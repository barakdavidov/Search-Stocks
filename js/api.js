const BASEURL =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3";

async function getCompanyProfile(symbol) {
  const response = await fetch(`${BASEURL}/company/profile/${symbol}`);
  const data = await response.json();
  return data;
}
