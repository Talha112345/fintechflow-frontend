import { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';

const API = import.meta.env.VITE_API_URL;

export default function WalletDashboard() {
  const [balance, setBalance] = useState(0);
  const [deposit, setDeposit] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [pulse, setPulse] = useState('');
  const { showToast } = useToast();
  const animatedBalance = useCountUp(balance);

  useEffect(() => {
    fetch(`${API}/api/wallet`).then(r => r.json()).then(d => setBalance(d.balance));
  }, []);

  async function handleDeposit(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/wallet/deposit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(deposit) }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); setPulse('shake'); setTimeout(() => setPulse(''), 500); return; }
    setBalance(data.balance);
    setPulse('pulse-green');
    setTimeout(() => setPulse(''), 600);
    showToast('Deposit successful!');
    setDeposit('');
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/wallet/withdraw`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(withdraw) }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); setPulse('shake'); setTimeout(() => setPulse(''), 500); return; }
    setBalance(data.balance);
    setPulse('pulse-red');
    setTimeout(() => setPulse(''), 600);
    showToast('Withdrawal successful!');
    setWithdraw('');
  }

  return (
    <div className="page">
      <div className={`balance-card ${pulse}`}>
        <h2>Wallet Balance</h2>
        <p className="balance">{formatPKR(animatedBalance)}</p>
      </div>
      <div className="forms-row">
        <form onSubmit={handleDeposit} className="form-card">
          <h3>Deposit</h3>
          <input className="input-field" type="number" placeholder="Amount" value={deposit} onChange={e => setDeposit(e.target.value)} />
          <button type="submit">Deposit</button>
        </form>
        <form onSubmit={handleWithdraw} className="form-card">
          <h3>Withdraw</h3>
          <input className="input-field" type="number" placeholder="Amount" value={withdraw} onChange={e => setWithdraw(e.target.value)} />
          <button type="submit">Withdraw</button>
        </form>
      </div>
    </div>
  );
}