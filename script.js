document.addEventListener("DOMContentLoaded", () => {
  const apiURL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"; // Replace with the actual API URL
  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout-btn");

  let cartData = [];

  // Fetch cart data
  async function fetchCartData() {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      cartData = data.items;
      renderCart(cartData);
      updateTotals();
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }

  // Render cart items
  function renderCart(items) {
    cartItemsContainer.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h3>${item.title}</h3>
          <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
          <input type="number" class="item-quantity" value="${item.quantity}" min="1">
          <p class="item-subtotal">Subtotal: ₹${(item.line_price / 100).toFixed(2)}</p>
        </div>
        <button class="remove-item">🗑️</button>
      </div>
    `
      )
      .join("");
    addEventListeners();
  }

  // Update totals
  function updateTotals() {
    const subtotal = cartData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
    totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
  }

  // Add event listeners
  function addEventListeners() {
    const quantityInputs = document.querySelectorAll(".item-quantity");
    const removeButtons = document.querySelectorAll(".remove-item");

    quantityInputs.forEach((input) =>
      input.addEventListener("change", handleQuantityChange)
    );
    removeButtons.forEach((button) =>
      button.addEventListener("click", handleRemoveItem)
    );
    checkoutButton.addEventListener("click", handleCheckout);
  }

  // Handle quantity change
  function handleQuantityChange(event) {
    const input = event.target;
    const cartItem = input.closest(".cart-item");
    const itemId = cartItem.dataset.id;
    const newQuantity = parseInt(input.value, 10);

    const item = cartData.find((item) => item.id == itemId);
    item.quantity = newQuantity;

    cartItem.querySelector(".item-subtotal").textContent = `Subtotal: ₹${(
      (item.price * item.quantity) /
      100
    ).toFixed(2)}`;
    updateTotals();
  }

  // Handle remove item
  function handleRemoveItem(event) {
    const button = event.target;
    const cartItem = button.closest(".cart-item");
    const itemId = cartItem.dataset.id;

    cartData = cartData.filter((item) => item.id != itemId);
    cartItem.remove();
    updateTotals();
  }

  // Handle checkout
  function handleCheckout() {
    alert(`Total Price: ₹${totalElement.textContent}`);
  }

  fetchCartData();
});