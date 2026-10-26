import { Link } from 'react-router-dom';

export default function Header({ cartCount = 0, cartTotal = 0, onCart, onLogout }) {
  return (
    <header className="header-wrap">
      <div className="header">
        <Link className="logo" to="/">
          <img src="/noma-logo.jpg" alt="NOMA COFFEE" />
          NOMA COFFEE
        </Link>

        <nav>
          <Link to="/">Меню</Link>
          {onCart && (
            <button className="cart-button" onClick={onCart}>
              Кошик ({cartCount}) · {cartTotal.toFixed(2)} ₴
            </button>
          )}
          <Link to="/admin">Адміністратор</Link>
          {onLogout && <button onClick={onLogout}>Вийти</button>}
        </nav>
      </div>
    </header>
  );
}
