import { useEffect, useState } from 'react';
import { api } from '../api';
import Header from './Header';

const emptyForm = {
  name: '',
  category: '',
  price: '',
  imageUrl: '',
  description: '',
};

export default function AdminPage({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const [productList, orderList] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
      ]);
      setProducts(productList);
      setOrders(orderList);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function openForm(product = null) {
    setEditingId(product?._id || null);
    setForm(product || emptyForm);
    document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function removeProduct(product) {
    if (!window.confirm(`Видалити «${product.name}»?`)) return;

    try {
      await api.deleteProduct(product._id);
      setMessage('Товар видалено.');
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const product = { ...form, price: Number(form.price) };
      if (editingId) await api.updateProduct(editingId, product);
      else await api.addProduct(product);

      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? 'Товар змінено.' : 'Товар додано.');
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <Header onLogout={onLogout} />
      <main className="admin container">
        <h1>Панель адміністратора</h1>
        <p className="muted">Керування меню та перегляд замовлень</p>

        <section id="product-form">
          <h2>{editingId ? 'Змінити товар' : 'Новий товар'}</h2>
          <form onSubmit={submit}>
            <input name="name" placeholder="Назва" value={form.name} onChange={change} required />
            <input name="category" placeholder="Категорія" value={form.category} onChange={change} required />
            <input name="price" type="number" min="0" placeholder="Ціна" value={form.price} onChange={change} required />
            <input name="imageUrl" type="url" placeholder="Посилання на фото" value={form.imageUrl} onChange={change} />
            <input name="description" placeholder="Опис" value={form.description} onChange={change} />
            <button>{editingId ? 'Зберегти' : 'Додати товар'}</button>
          </form>
          {message && <p>{message}</p>}
        </section>

        <section>
          <h2>Товари ({products.length})</h2>
          <div>
            <table>
              <thead>
                <tr><th>Назва</th><th>Категорія</th><th>Дії</th><th>Ціна</th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <button onClick={() => openForm(product)}>Змінити</button>
                      <button onClick={() => removeProduct(product)}>Видалити</button>
                    </td>
                    <td>{Number(product.price).toFixed(2)} ₴</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Замовлення ({orders.length})</h2>
          <div>
            <table>
              <thead>
                <tr><th>Клієнт</th><th>Час</th><th>Товари</th><th>Сума</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{new Date(order.pickupTime).toLocaleString('uk-UA')}</td>
                    <td>{order.items.map((item) => `${item.product?.name || 'Товар'} × ${item.quantity}`).join(', ')}</td>
                    <td>{Number(order.totalPrice).toFixed(2)} ₴</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!orders.length && <p className="muted">Замовлень ще немає.</p>}
        </section>
      </main>
    </div>
  );
}
