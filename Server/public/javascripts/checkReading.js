// document.addEventListener("DOMContentLoaded", () => {
//   let button = document.getElementById("button");
//   let timeLeft = 30;
//   let countdownTimer;
//   let scrollTimeout;
//   let userHasScrolled = true;

//   function startCountdown() {
//     countdownTimer = setInterval(() => {
//       if (document.hidden || !userHasScrolled) return;

//       timeLeft--;
//       button.textContent = timeLeft;
//       if (timeLeft <= 0) {
//         clearInterval(countdownTimer);
//         button.textContent = "Claim reward";
//         button.disabled = false;
//         document.getElementById("rewardMessage").style.display = "block";
//       }
//     }, 1000);
//   }

//   function handleScroll() {
//     userHasScrolled = true;
//     clearTimeout(scrollTimeout);
//     scrollTimeout = setTimeout(() => {
//       userHasScrolled = false;
//     }, 5000);

//     if (!countdownTimer && timeLeft > 0) {
//       startCountdown();
//     }
//   }

//   document.addEventListener("visibilitychange", () => {
//     if (!document.hidden && timeLeft > 0) {
//       if (!countdownTimer) {
//         startCountdown();
//       }
//     } else {
//       clearInterval(countdownTimer);
//       countdownTimer = null;
//     }
//   });

//   window.addEventListener("focus", () => {
//     if (!countdownTimer && timeLeft > 0) {
//       startCountdown();
//     }
//   });

//   window.addEventListener("blur", () => {
//     clearInterval(countdownTimer);
//     countdownTimer = null;
//   });

//   window.addEventListener("scroll", handleScroll);

//   // button.addEventListener("click", () => {
//   //   if (button.textContent === "Claim reward") {
//   //     alert("Bạn đã nhận phần thưởng!");
//   //     button.style.display="none";
//   //   }
//   // });

//   button.addEventListener("click", () => {
//     if (button.textContent === "Claim reward") {
//       // Thay đổi URL API và gửi yêu cầu claim
//       fetch('/nft/transfer', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       })
//       .then(response => response.json())
//       .then(data => {
//         if (data && data.confirmationUrl) {
//           window.location.href = data.confirmationUrl;
//         } else {
//           console.error('Confirmation URL không có trong phản hồi');
//         }
//       })
//       .catch(error => {
//         console.error('Lỗi khi thực hiện claim:', error);
//       });
//     }
//   });

//   handleScroll();
// });
document.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("button");
  let timeLeft = 5;
  let countdownTimer;
  let scrollTimeout;
  let userHasScrolled = true;

  function startCountdown() {
    countdownTimer = setInterval(() => {
      if (document.hidden || !userHasScrolled) return;

      timeLeft--;
      button.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        button.textContent = "Claim reward";
        button.disabled = false;
        document.getElementById("rewardMessage").style.display = "block";
      }
    }, 1000);
  }

  function handleScroll() {
    userHasScrolled = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      userHasScrolled = false;
    }, 5000);

    if (!countdownTimer && timeLeft > 0) {
      startCountdown();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && timeLeft > 0) {
      if (!countdownTimer) {
        startCountdown();
      }
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  });

  window.addEventListener("focus", () => {
    if (!countdownTimer && timeLeft > 0) {
      startCountdown();
    }
  });

  window.addEventListener("blur", () => {
    clearInterval(countdownTimer);
    countdownTimer = null;
  });

  window.addEventListener("scroll", handleScroll);

  button.addEventListener("click", () => {
    if (button.textContent === "Claim reward") {
      window.location.href = '/nft/transfer';
    }
  });
  handleScroll();
});
