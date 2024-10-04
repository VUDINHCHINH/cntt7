// models/walletModel.js
const { Connection, PublicKey } = require('@solana/web3.js');

// Tạo kết nối với mạng Solana
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Hàm để lấy thông tin ví
async function getWalletInfo(address) {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: PublicKey.default,
    });

    return {
        balance: balance / 1e9, // Chuyển đổi từ lamports sang SOL
        tokenAccounts: tokenAccounts.value,
    };
}

module.exports = {
    getWalletInfo,
};
