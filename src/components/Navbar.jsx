import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  return (
    <nav className="navbar">
      <span className="logo">FintechFlow</span>
      <div className="nav-links">
        <NavLink to="/">Wallet</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/loan-apply">Apply Loan</NavLink>
        <NavLink to="/loan-status">Loan Status</NavLink>
        <NavLink to="/emi">EMI Calculator</NavLink>
      </div>
      <button onClick={toggle}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
    </nav>
  );
}