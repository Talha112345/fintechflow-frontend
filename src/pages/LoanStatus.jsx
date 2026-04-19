import { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';
import Skeleton from '../components/Skeleton';

const API = import.meta.env.VITE_API_URL;

function LoanCard({ loan, onUpdate }) {
  const [flipped, setFlipped] = useState(false);
  const { showToast } = useToast();

  async function updateStatus(status) {
    const res = await fetch(`${API}/api/loans/${loan.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); return; }
    onUpdate(data);
    showToast(`Loan ${status}`);
    setFlipped(false);
  }

  return (
    <div className="flip-container" onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        <div className="flip-front">
          <p><strong>{loan.applicant}</strong></p>
          <p>{formatPKR(loan.amount)} — {loan.tenure} months</p>
          <p>{loan.purpose}</p>
          <span className={`badge badge-${loan.status} ${loan.status === 'pending' ? 'pulse' : ''}`}>{loan.status}</span>
        </div>
        <div className="flip-back">
          <p>Loan #{loan.id}</p>
          {loan.status === 'pending' && (
            <>
              <button onClick={() => updateStatus('approved')}>✅ Approve</button>
              <button onClick={() => updateStatus('rejected')}>❌ Reject</button>
            </>
          )}
          {loan.status !== 'pending' && <p>Already {loan.status}</p>}
        </div>
      </div>
    </div>
  );
}

export default function LoanStatus() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('none');

  useEffect(() => {
    fetch(`${API}/api/loans`).then(r => r.json()).then(d => { setLoans(d); setLoading(false); });
  }, []);

  function onUpdate(updated) {
    setLoans(prev => prev.map(l => l.id === updated.id ? updated : l));
  }

  const sorted = [...loans].sort((a, b) => {
    if (sort === 'high') return b.amount - a.amount;
    if (sort === 'low') return a.amount - b.amount;
    if (sort === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const pending = loans.filter(l => l.status === 'pending').length;
  const approved = loans.filter(l => l.status === 'approved').length;
  const rejected = loans.filter(l => l.status === 'rejected').length;

  const cPending = useCountUp(pending);
  const cApproved = useCountUp(approved);
  const cRejected = useCountUp(rejected);

  return (
    <div className="page">
      <div className="summary-bar">
        <span>Pending: {cPending}</span>
        <span>Approved: {cApproved}</span>
        <span>Rejected: {cRejected}</span>
      </div>
      <div className="filter-row">
        <select className="input-field" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="high">Amount (High→Low)</option>
          <option value="low">Amount (Low→High)</option>
          <option value="status">Status</option>
        </select>
      </div>
      {loading ? <Skeleton rows={3} /> : (
        <div className="loan-grid">
          {sorted.map(l => <LoanCard key={l.id} loan={l} onUpdate={onUpdate} />)}
        </div>
      )}
    </div>
  );
}