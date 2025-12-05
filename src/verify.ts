import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const runVerification = async () => {
    try {
        console.log('Starting Verification...');

        // 1. Register User A
        console.log('Registering User A...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'User A',
                phoneNumber: '1234567890',
                password: 'password123',
            });
        } catch (e: any) {
            if (e.response?.status !== 400) throw e; // Ignore if already exists
            console.log('User A already exists');
        }

        // 2. Register User B
        console.log('Registering User B...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'User B',
                phoneNumber: '0987654321',
                password: 'password123',
            });
        } catch (e: any) {
            if (e.response?.status !== 400) throw e;
            console.log('User B already exists');
        }

        // 3. Login User A
        console.log('Logging in User A...');
        const loginA = await axios.post(`${API_URL}/auth/login`, {
            phoneNumber: '1234567890',
            password: 'password123',
        });
        const tokenA = loginA.data.token;
        console.log('User A Logged In');

        // 4. Login User B
        console.log('Logging in User B...');
        const loginB = await axios.post(`${API_URL}/auth/login`, {
            phoneNumber: '0987654321',
            password: 'password123',
        });
        // const tokenB = loginB.data.token; // Not needed for now
        console.log('User B Logged In');

        // 5. Check Balance A
        console.log('Checking Balance A...');
        const balanceA1 = await axios.get(`${API_URL}/wallet/balance`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log(`Balance A: ${balanceA1.data.balance}`);

        // 6. Load Funds A
        console.log('Loading Funds to A (100)...');
        await axios.post(
            `${API_URL}/wallet/load`,
            { amount: 100 },
            { headers: { Authorization: `Bearer ${tokenA}` } }
        );
        console.log('Funds Loaded');

        // 7. Check Balance A
        const balanceA2 = await axios.get(`${API_URL}/wallet/balance`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log(`Balance A: ${balanceA2.data.balance}`);

        // 8. Transfer from A to B
        console.log('Transferring 50 from A to B...');
        await axios.post(
            `${API_URL}/wallet/transfer`,
            { toPhoneNumber: '0987654321', amount: 50 },
            { headers: { Authorization: `Bearer ${tokenA}` } }
        );
        console.log('Transfer Successful');

        // 9. Check Balance A
        const balanceA3 = await axios.get(`${API_URL}/wallet/balance`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log(`Balance A: ${balanceA3.data.balance}`);

        // 10. Get Transactions A
        console.log('Getting Transactions for A...');
        const transactionsA = await axios.get(`${API_URL}/wallet/transactions`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log(`Found ${transactionsA.data.length} transactions`);
        console.log(JSON.stringify(transactionsA.data, null, 2));

        console.log('Verification Completed Successfully!');
    } catch (error: any) {
        console.error('Verification Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

runVerification();
