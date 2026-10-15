import { useEffect, useState } from 'react';
import { api } from '../api';
import CartModal from './CartModal';
import Header from './Header';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('Усі');
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState('Завантаження меню...');

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data);
        setMessage('');
      })
      .catch(() => setMessage('Не вдалося завантажити меню.'));
  }, []);

  function addToCart(product) {
    setCart((current) => {
      const saved = current.find((item) => item.product._id === product._id);
      return saved
        ? current.map((item) => item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...current, { product, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((current) => current
      .map((item) => item.product._id === id
        ? { ...item, quantity: item.quantity + amount }
        : item)
      .filter((item) => item.quantity > 0));
  }

  const categories = ['Усі', ...new Set(products.map((product) => product.category))];
  const visibleProducts = category === 'Усі'
    ? products
    : products.filter((product) => product.category === category);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <Header cartCount={count} cartTotal={total} onCart={() => setCartOpen(true)} />

      <section className="hero">
        <p>Coffee Spot</p>
        <h1>Наше меню</h1>
        <span>Кава та свіжі десерти</span>
      </section>

      <main className="container">
        <div className="categories">
          {categories.map((item) => (
            <button className={item === category ? 'active' : ''} onClick={() => setCategory(item)} key={item}>
              {item}
            </button>
          ))}
        </div>

        {message && <p className="message">{message}</p>}
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product" key={product._id}>
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} />
                : <div className="placeholder">☕</div>}
              <div>
                <h2>{product.name}</h2>
                {product.description && <p>{product.description}</p>}
                <strong>{Number(product.price).toFixed(2)} ₴</strong>
              </div>
              <button className="add" onClick={() => addToCart(product)}>+</button>
            </article>
          ))}
        </div>
      </main>

      {cartOpen && (
        <CartModal
          items={cart}
          total={total}
          onChange={changeQuantity}
          onClose={() => setCartOpen(false)}
          onSuccess={() => {
            setCart([]);
            setCartOpen(false);
            setMessage('Замовлення успішно оформлено!');
          }}
        />
      )}
    </div>
  );
}
