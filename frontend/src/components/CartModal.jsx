import { useState } from 'react';
import { api } from '../api';

function getPickupDate(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  if (date <= new Date()) date.setDate(date.getDate() + 1);
  return date.toISOString();
}

export default function CartModal({ items, total, onChange, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setError('');

    try {
      await api.createOrder({
        customerName: name,
        pickupTime: getPickupDate(time),
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
          price: product.price,
        })),
        totalPrice: total,
      });
      onSuccess();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <aside className="cart" onMouseDown={(event) => event.stopPropagation()}>
        <div className="cart-title">
          <h2>Ваше замовлення</h2>
          <button onClick={onClose}>×</button>
        </div>

        {!items.length && <p className="muted">Кошик порожній.</p>}
        {items.map(({ product, quantity }) => (
          <div className="cart-item" key={product._id}>
            <span>
              <b>{product.name}</b>
              <small>{Number(product.price).toFixed(2)} ₴ за шт.</small>
            </span>
            <div className="quantity">
              <button onClick={() => onChange(product._id, -1)}>−</button>
              <b>{quantity}</b>
              <button onClick={() => onChange(product._id, 1)}>+</button>
            </div>
          </div>
        ))}

        <form onSubmit={submit}>
          <strong>Разом: {total.toFixed(2)} ₴</strong>
          <label>Ім’я<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>Час отримання<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={!items.length || sending}>
            {sending ? 'Надсилання...' : 'Оформити замовлення'}
          </button>
        </form>
      </aside>
    </div>
  );
}
