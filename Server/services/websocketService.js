// services/websocketService.js
const WebSocket = require('ws');
const { Connection, PublicKey } = require('@solana/web3.js');

// Tạo kết nối với mạng Solana
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Tạo WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Theo dõi số dư của ví
async function trackWalletBalance(publicKey, ws) {
    let currentBalance = await connection.getBalance(publicKey);

    setInterval(async () => {
        const newBalance = await connection.getBalance(publicKey);
        if (newBalance !== currentBalance) {
            currentBalance = newBalance;
            ws.send(JSON.stringify({
                event: 'balanceChange',
                balance: currentBalance / 1e9, // Chuyển đổi từ lamports sang SOL
            }));
        }
    }, 10000); // Kiểm tra thay đổi số dư mỗi 10 giây
}

// Theo dõi giao dịch mới
async function trackWalletTransactions(publicKey, ws) {
    const signatureSubscriptionId = connection.onSignature(publicKey.toString(), (notification) => {
        ws.send(JSON.stringify({
            event: 'newTransaction',
            transaction: notification,
        }));
    });

    // Hủy đăng ký sau khi kết thúc kết nối
    ws.on('close', () => {
        connection.removeSignatureListener(signatureSubscriptionId);
    });
}

// Theo dõi nhận token
async function trackTokenReceived(publicKey, ws) {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: PublicKey.default,
    });

    tokenAccounts.value.forEach(async (account) => {
        const accountPubkey = new PublicKey(account.pubkey);
        const accountBalance = await connection.getTokenAccountBalance(accountPubkey);

        setInterval(async () => {
            const newBalance = await connection.getTokenAccountBalance(accountPubkey);
            if (newBalance.value.uiAmount !== accountBalance.value.uiAmount) {
                ws.send(JSON.stringify({
                    event: 'tokenReceived',
                    account: account.pubkey,
                    balance: newBalance.value.uiAmount,
                }));
            }
        }, 10000); // Kiểm tra thay đổi số dư token mỗi 10 giây
    });
}

// Theo dõi chuyển token
async function trackTokenSent(publicKey, ws) {
    // Logic tương tự như trackTokenReceived
}

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        const publicKey = new PublicKey(data.address);

        if (data.event === 'trackBalance') {
            await trackWalletBalance(publicKey, ws);
        } else if (data.event === 'trackTransactions') {
            await trackWalletTransactions(publicKey, ws);
        } else if (data.event === 'trackTokenReceived') {
            await trackTokenReceived(publicKey, ws);
        } else if (data.event === 'trackTokenSent') {
            await trackTokenSent(publicKey, ws);
        }
    });
});

module.exports = wss;
