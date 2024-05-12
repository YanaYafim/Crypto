document.addEventListener("DOMContentLoaded", function() {
  const cryptoCoinInput = document.getElementById("cryptoCoin");
  const usdPaymentInput = document.getElementById("usdPayment");

  function usdToCoin(usdValue) {
    const price = getCookie("price");
    return (usdValue / price).toFixed(10);
  }

  function coinToUsd(coinValue) {
    const price = getCookie("price");
    return (coinValue * price).toFixed(2);
  }

  function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : null;
  }

  usdPaymentInput.addEventListener("input", function() {
    const usdValue = parseFloat(usdPaymentInput.value);
    if (!isNaN(usdValue)) {
      const coinValue = usdToCoin(usdValue);
      cryptoCoinInput.value = coinValue;
    }
  });

  cryptoCoinInput.addEventListener("input", function() {
    const coinValue = parseFloat(cryptoCoinInput.value);
    if (!isNaN(coinValue)) {
      const usdValue = coinToUsd(coinValue);
      usdPaymentInput.value = usdValue;
    }
  });
});