import { useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { formatPKR } from '../utils/formatPKR';

const API = import.meta.env.VITE_API_URL;

function StatCard({ label, value }) {
  const animated = useCountUp(value);
  return (
    <div className="stat-card">
      <p>{label}</p>
      <p>{formatPKR(animated)}</p>
    </div>
  );
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');

  async function calculate() {
    setError('');
    const res = await fetch(`${API}/api/emi-calculator?principal=${principal}&annualRate=${rate}&months=${months}`);
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setResult(data);

    // Amortization table — computed on frontend using server-returned EMI
    const r = parseFloat(rate) / 100 / 12;
    const emi = data.emi;
    let remaining = parseFloat(principal);
    const rows = [];
    for (let i = 1; i <= parseInt(months); i++) {
      const interest = remaining * r;
      const principalComp = emi - interest;
      remaining -= principalComp;
      rows.push({ month: i, principal: principalComp.toFixed(2), interest: interest.toFixed(2), balance: Math.max(remaining, 0).toFixed(2) });
    }
    setSchedule(rows);
  }

  const principalPct = result ? ((parseFloat(principal) / result.totalPayable) * 100).toFixed(1) : 0;
  const interestPct = result ? (100 - principalPct).toFixed(1) : 0;

  return (
    <div className="page">
      <h2>EMI Calculator</h2>
      <div className="forms-row">
        <input className="input-field" type="number" placeholder="Principal (PKR)" value={principal} onChange={e => setPrincipal(e.target.value)} />
        <input className="input-field" type="number" placeholder="Annual Rate (%)" value={rate} onChange={e => setRate(e.target.value)} />
        <input className="input-field" type="number" placeholder="Tenure (months)" value={months} onChange={e => setMonths(e.target.value)} />
      </div>
      <button onClick={calculate}>Calculate</button>
      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <div className="forms-row">
            <StatCard label="Monthly EMI" value={result.emi} />
            <StatCard label="Total Payable" value={result.totalPayable} />
            <StatCard label="Total Interest" value={result.totalInterest} />
          </div>

          <div className="breakdown-bar">
            <div className="bar-principal" style={{ width: `${principalPct}%` }}>Principal {principalPct}%</div>
            <div className="bar-interest" style={{ width: `${interestPct}%` }}>Interest {interestPct}%</div>
          </div>

          <table className="amort-table">
            <thead><tr><th>Month</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>
              {schedule.map(row => (
                <tr key={row.month} className="fade-in" style={{ animationDelay: `${row.month * 20}ms` }}>
                  <td>{row.month}</td>
                  <td>{formatPKR(parseFloat(row.principal))}</td>
                  <td>{formatPKR(parseFloat(row.interest))}</td>
                  <td>{formatPKR(parseFloat(row.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}