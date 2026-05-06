import React from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/ToastContext';

function parsePrice(price) {
	if (!price) return 0;
	const num = String(price).replace(/[^0-9.]/g, '');
	return parseFloat(num) || 0;
}

function formatPrice(n) {
	return `₹${Math.round(n)}`;
}

function Cart() {
	const { cart, removeItem, updateQty, clearCart } = useCart();
	const { showToast } = useToast();

	const subtotal = cart.reduce((s, it) => s + (parsePrice(it.price) || 0) * (it.qty || 1), 0);

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-4">Your Cart</h2>
			{cart.length === 0 && (
				<div className="p-4 text-gray-600">Your cart is empty.</div>
			)}

			{cart.length > 0 && (
				<div className="space-y-4">
					{cart.map((it) => (
						<div key={it.id} className="flex items-center border rounded p-3">
							<img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded mr-4" onError={(e)=>{e.target.onerror=null;e.target.src='https://picsum.photos/200/150'}} />
							<div className="flex-1">
								<div className="font-semibold">{it.name}</div>
								<div className="text-sm text-gray-600">{it.price}</div>
								<div className="mt-2 flex items-center space-x-2">
									  <button onClick={() => updateQty(it.id, (it.qty||1) - 1)} className="px-2 py-1 border rounded cursor-pointer">-</button>
									<div className="px-3">{it.qty || 1}</div>
									  <button onClick={() => updateQty(it.id, (it.qty||1) + 1)} className="px-2 py-1 border rounded cursor-pointer">+</button>
								</div>
							</div>
							<div className="ml-4 text-right">
								<div className="font-semibold">{formatPrice((parsePrice(it.price) || 0) * (it.qty || 1))}</div>
								  <button onClick={() => { removeItem(it.id); showToast(`${it.name} removed`); }} className="text-sm text-red-500 mt-2 cursor-pointer">Remove</button>
							</div>
						</div>
					))}

					<div className="flex justify-between items-center border-t pt-4">
						<div className="font-semibold">Subtotal</div>
						<div className="font-bold text-lg">{formatPrice(subtotal)}</div>
					</div>

					<div className="flex space-x-3 mt-4">
						<button onClick={() => { clearCart(); showToast('Cart cleared'); }} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Clear Cart</button>
						<button className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer">Proceed to Checkout</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Cart;