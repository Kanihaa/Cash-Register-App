let price = 19.5;  // Set default price
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];  // Default cash in drawer

const CURRENCY_UNIT = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

document.getElementById('purchase-btn').addEventListener('click', () => {
  const cashProvided = parseFloat(document.getElementById('cash').value);
  if (cashProvided < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (cashProvided === price) {
    document.getElementById('change-due').textContent = "No change due - customer paid with exact cash";
    return;
  }
  
  const changeDue = cashProvided - price;
  const result = calculateChange(changeDue, cid);

  document.getElementById('change-due').textContent = result;
});

function calculateChange(changeDue, cid) {
  let totalCid = 0;
  for (let currency of cid) {
    totalCid += currency[1];
  }
  totalCid = Math.round(totalCid * 100) / 100;  // To handle floating-point precision issues

  if (totalCid < changeDue) {
    return "Status: INSUFFICIENT_FUNDS";
  } else if (totalCid === changeDue) {
    return `Status: CLOSED ${formatChange(cid)}`;
  }

  let change = [];
  for (let i = cid.length - 1; i >= 0; i--) {
    const currencyName = cid[i][0];
    const currencyTotal = cid[i][1];
    const currencyValue = CURRENCY_UNIT[currencyName];
    let amount = 0;

    while (changeDue >= currencyValue && currencyTotal - amount >= currencyValue) {
      changeDue -= currencyValue;
      changeDue = Math.round(changeDue * 100) / 100;
      amount += currencyValue;
    }

    if (amount > 0) {
      change.push([currencyName, amount]);
    }
  }

  if (changeDue > 0) {
    return "Status: INSUFFICIENT_FUNDS";
  }

  return `Status: OPEN ${formatChange(change)}`;
}

function formatChange(change) {
  return change.map(c => `${c[0]}: $${c[1].toFixed(2)}`).join(" ");
}
