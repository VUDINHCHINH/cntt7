document.addEventListener('DOMContentLoaded', () => {
  const connect_wallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        await window.solana.connect();
        const publicKey = window.solana.publicKey.toBase58();
        console.log("Connected to Phantom!");
        console.log("Public key:", publicKey);
        document.getElementById('walletInfo').innerText = "Public key: " + publicKey;
        const response = await axios.get(`/profile/wallet/${publicKey}`);
        if (response.data.redirected) {
          window.location.href = response.data.url;
        }
      } catch (error) {
        console.error("Error connecting to Phantom:", error);
      }
    } else {
      console.error("Phantom wallet extension not found.");
    }
  };

  document.getElementById('connect_wallet').addEventListener('click', connect_wallet);
});