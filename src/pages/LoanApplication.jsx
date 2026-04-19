import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';

const API = import.meta.env.VITE_API_URL;
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

export default function LoanApplication() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ applicant: '', cnic: '', contact: '', amount: '', purpose: 'Business', tenure: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const { showToast } = useToast();

  function update(field, val) { setForm(f => ({ ...f, [field]: val })); }

  function validateStep1() {
    const e = {};
    if (!form.applicant.trim()) e.applicant = 'Name is required';
    if (!CNIC_REGEX.test(form.cnic)) e.cnic = 'CNIC must be in format XXXXX-XXXXXXX-X';
    if (!form.contact.trim()) e.contact = 'Contact is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    const amt = parseFloat(form.amount);
    const ten = parseInt(form.tenure);
    if (!amt || amt < 5000 || amt > 5000000) e.amount = 'Amount must be between PKR 5,000 and 5,000,000';
    if (!ten || ten < 3 || ten > 60) e.tenure = 'Tenure must be between 3 and 60 months';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  }

  async function submit() {
    const res = await fetch(`${API}/api/loans/apply`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicant: form.applicant, amount: parseFloat(form.amount), purpose: form.purpose, tenure: parseInt(form.tenure) }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); return; }
    setSuccess(data);
  }

  if (success) return (
    <div className="page success-screen">
      <h2>✅ Loan Application Submitted!</h2>
      <p>Loan ID: <strong>{success.id}</strong></p>
      <p>Status: <strong>{success.status}</strong></p>
      <button onClick={() => { setSuccess(null); setStep(1); setForm({ applicant: '', cnic: '', contact: '', amount: '', purpose: 'Business', tenure: '' }); }}>Apply Again</button>
    </div>
  );

  return (
    <div className="page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      <p>Step {step} of 3</p>

      {step === 1 && (
        <div className="step-slide">
          <h3>Step 1: Personal Info</h3>
          <input className="input-field" placeholder="Full Name" value={form.applicant} onChange={e => update('applicant', e.target.value)} />
          {errors.applicant && <span className="error">{errors.applicant}</span>}
          <input className="input-field" placeholder="CNIC (XXXXX-XXXXXXX-X)" value={form.cnic} onChange={e => update('cnic', e.target.value)} />
          {errors.cnic && <span className="error">{errors.cnic}</span>}
          <input className="input-field" placeholder="Contact Number" value={form.contact} onChange={e => update('contact', e.target.value)} />
          {errors.contact && <span className="error">{errors.contact}</span>}
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="step-slide">
          <h3>Step 2: Loan Details</h3>
          <input className="input-field" type="number" placeholder="Amount (PKR)" value={form.amount} onChange={e => update('amount', e.target.value)} />
          {errors.amount && <span className="error">{errors.amount}</span>}
          <select className="input-field" value={form.purpose} onChange={e => update('purpose', e.target.value)}>
            {['Business', 'Education', 'Medical', 'Personal'].map(p => <option key={p}>{p}</option>)}
          </select>
          <input className="input-field" type="number" placeholder="Tenure (months)" value={form.tenure} onChange={e => update('tenure', e.target.value)} />
          {errors.tenure && <span className="error">{errors.tenure}</span>}
          <div className="btn-row">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-slide">
          <h3>Step 3: Review & Submit</h3>
          <p><strong>Name:</strong> {form.applicant}</p>
          <p><strong>CNIC:</strong> {form.cnic}</p>
          <p><strong>Contact:</strong> {form.contact}</p>
          <p><strong>Amount:</strong> {formatPKR(parseFloat(form.amount))}</p>
          <p><strong>Purpose:</strong> {form.purpose}</p>
          <p><strong>Tenure:</strong> {form.tenure} months</p>
          <div className="btn-row">
            <button onClick={() => setStep(2)}>Back</button>
            <button onClick={submit}>Submit Application</button>
          </div>
        </div>
      )}
    </div>
  );
}