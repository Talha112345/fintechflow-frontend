import { useState, useEffect, useMemo } from 'react';
import { formatPKR } from '../utils/formatPKR';
import Skeleton from '../components/Skeleton';

const API = import.meta.env.VITE_API_URL;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`${API}/api/transactions`).then(r => r.json()).then(d => { setTransactions(d); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => filter === 'all' || t.type === (filter === 'credits' ? 'credit' : 'debit'))
      .filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
  }, [transactions, search, filter]);

  const totalCredits = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page">
      <div className="summary-bar">
        <span>Credits: {formatPKR(totalCredits)}</span>
        <span>Debits: {formatPKR(totalDebits)}</span>
        <span>Net: {formatPKR(totalCredits - totalDebits)}</span>
      </div>
      <input className="input-field" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="filter-row">
        {['all', 'credits', 'debits'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {loading ? <Skeleton rows={5} /> : filtered.map((t, i) => (
        <div key={t.id} className={`txn-card txn-${t.type}`} style={{ animationDelay: `${i * 100}ms` }}>
          <span>{t.type === 'credit' ? '↑' : '↓'}</span>
          <span>{t.description}</span>
          <span className={`badge badge-${t.type}`}>{t.type}</span>
          <span>{formatPKR(t.amount)}</span>
          <span>{new Date(t.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}