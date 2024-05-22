// 🌍 GLOBAL VARIABLES 🌍

const foods = document.getElementById("foods");
const box_filtered_btns = document.getElementById("box-btn");
const box_cart_articles = document.getElementById("added-items");
const cart_toggle_btn = document.getElementById("cart-toggle");
const cart_section = document.getElementById("cart");
const buy_btn = document.getElementById("buy-btn");
const return_home = document.getElementById("return-home");

/* ************************************************************************ */

// 🧠 SETTINGS 🧠

window.addEventListener("DOMContentLoaded", () => {
  fetch_menu_items();
  load_cart_items(); // Load cart items from localStorage when press F5
});

return_home.addEventListener("click", () => {
  foods.innerHTML = "";
  const filter_btns = box_filtered_btns.querySelectorAll(".filter-btn");
  filter_btns.forEach((btn) => btn.classList.remove("bg-indigo-500"));
  cart_section.classList.add("hidden");
});

const fetch_menu_items = async () => {
  try {
    const response = await fetch("data.json");
    const menu_items = await response.json();
    display_menu_buttons(menu_items);
  } catch (error) {
    console.log(error);
  }
};

cart_toggle_btn.addEventListener("click", () => {
  cart_section.classList.toggle("hidden");
});

/* ************************************************************************ */

// 📱 FUNCTIONALITY 📱

buy_btn.addEventListener("click", () => {
  if (box_cart_articles.children.length === 0) {
    Swal.fire(
      "Cart is Empty!",
      "You cannot make a purchase with an empty cart.",
      "error"
    );
  } else {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the purchase?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear the cart box
        box_cart_articles.innerHTML = "";
        // Clear local storage
        localStorage.removeItem("cartItems");
        Swal.fire(
          "Purchase Complete!",
          "Thank you for your purchase!",
          "success"
        );
      }
    });
  }
});

const display_menu_buttons = (menu_items) => {
  const categories = menu_items.reduce((values, item) => {
    if (!values.includes(item.category)) {
      values.push(item.category);
    }
    return values;
  }, []);
  const category_btns = categories
    .map((category) => {
      return `<button type="button" class="filter-btn text-indigo-100 px-4 rounded-full m-2 uppercase border-2 border-indigo-950 hover:bg-indigo-950" data-id=${category}>
          ${category}
        </button>`;
    })
    .join("");
  box_filtered_btns.innerHTML = category_btns;
  const filter_btns = box_filtered_btns.querySelectorAll(".filter-btn");
  filter_btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filter_btns.forEach((btn) => btn.classList.remove("bg-indigo-500"));
      e.currentTarget.classList.add("bg-indigo-500");
      const category = e.currentTarget.dataset.id; // example data-id="drinks"
      const menu_category = menu_items.filter(
        (menu_item) => menu_item.category === category
      );
      display_menu_items(menu_category);
    });
  });
};

const display_menu_items = (menu_items) => {
  let display_menu = menu_items
    .map((item) => {
      return `
                  <article class="menu-item bg-indigo-950 rounded shadow-md p-4">
                          <img src=${item.img} alt=${item.title} class="photo w-full h-48 object-cover rounded mb-4 border-2 border-violet-300" />
                          <div class="item-info text-center">
                                  <header class="flex justify-between items-center mb-4">
                                          <h4 class="card-title font-bold tracking-widest capitalize text-violet-300">${item.title}</h4>
                                          <h4 class="card-price px-4 text-indigo-300 font-bold border-2 border-indigo-200 rounded-full">$${item.price}</h4>
                                  </header>
                                  <h3 class="item-text mb-4 text-indigo-300">
                                          ${item.desc}
                                  </h3>
                                  <button class="btn add-btn bg-indigo-700 text-violet-100 px-4 rounded hover:bg-indigo-600">
                                          <i class="fa-solid fa-plus"></i>
                                  </button>
                          </div>
                  </article>
              `;
    })
    .join("");
  foods.innerHTML = display_menu;
  // Add event listeners directly to new "Add to Cart" buttons
  const add_to_cart_buttons = foods.querySelectorAll(".btn");
  add_to_cart_buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const menu_item = e.currentTarget.closest(".menu-item");
      const price = menu_item.querySelector(".card-price").textContent;
      const img = menu_item.querySelector(".photo").src;
      const item_added = {
        price: price,
        img: img,
      };
      add_to_cart(item_added);
    });
  });
};

const add_to_cart = (x) => {
  // Check if the item already is in cart
  const existing_cart_item = box_cart_articles.querySelector(
    `[data-img="${x.img}"][data-price="${x.price}"]`
  );
  if (existing_cart_item) {
    // If the item is inside, increment quantity in DOM
    const quantity_element = existing_cart_item.querySelector(".quantity");
    let quantity = parseInt(quantity_element.textContent);
    quantity++;
    quantity_element.textContent = quantity;
    // Increment quantity in Storage
    update_cart_item_quantity(x, quantity);
  } else {
    // If the item does not exist in the cart, create a new element for it
    const cart_item = document.createElement("article");
    cart_item.classList.add(
      "cart-item",
      "flex",
      "items-center",
      "space-x-4",
      "text-violet-500",
      "rounded",
      "p-4",
      "shadow-md",
      "border-b-2",
      "border-violet-200"
    );
    cart_item.innerHTML = `
      <img src=${x.img} alt=${x.title} class="photo w-20 h-20 object-cover rounded-full border-8 border-indigo-950" />
      <div class="item-info flex-1">
        <h4 class="card-price px-4 text-indigo-300 font-bold border-2 border-indigo-200 rounded-full">${x.price}</h4>
        <span class="quantity text-violet-300 ml-2 font-bold">1</span>
      </div>
      <button class="btn remove-btn bg-red-700 text-red-100 px-4 rounded hover:bg-red-800">X</button>
    `;
    cart_item.setAttribute("data-img", x.img);
    cart_item.setAttribute("data-price", x.price);
    box_cart_articles.appendChild(cart_item);
    // Saving item with quantity 1
    x.q = 1;
    save_cart_item_to_local_storage(x);
    // Add event listener to the "Remove" button
    const remove_btn = cart_item.querySelector(".remove-btn");
    remove_btn.addEventListener("click", () => {
      remove_from_cart(x, cart_item);
    });
  }
};

const update_cart_item_quantity = (x, quantity) => {
  let cart_items = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existing_item_index = cart_items.findIndex(
    (item) => item.img === x.img && item.price === x.price
  );
  if (existing_item_index !== -1) {
    cart_items[existing_item_index].q = quantity;
    localStorage.setItem("cartItems", JSON.stringify(cart_items));
  }
};

const save_cart_item_to_local_storage = (x) => {
  let cart_items = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart_items.push(x);
  localStorage.setItem("cartItems", JSON.stringify(cart_items));
};

const load_cart_items = () => {
  let cart_items = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart_items.forEach((item) => {
    const cart_item = document.createElement("article");
    cart_item.classList.add(
      "cart-item",
      "flex",
      "items-center",
      "space-x-4",
      "border-b-2",
      "rounded",
      "p-4",
      "shadow-md",
      "text-violet-500"
    );
    cart_item.innerHTML = `
      <img src=${item.img} class="photo w-20 h-20 object-cover rounded-full border-8 border-indigo-950" />
      <div class="item-info flex-1">
              <h4 class="card-price px-4 text-indigo-300 font-bold border-2 border-indigo-200 rounded-full">${item.price}</h4>
      </div>
      <button class="btn remove-btn bg-red-700 text-red-100 px-4 rounded hover:bg-red-800">X</button>
    `;
    box_cart_articles.appendChild(cart_item);
    // Add event listener to the "Remove" button
    const remove_btn = cart_item.querySelector(".remove-btn");
    remove_btn.addEventListener("click", () => {
      remove_from_cart(item, cart_item);
    });
  });
};

const remove_from_cart = (x, cart_item_element) => {
  // Remove the item from the DOM
  cart_item_element.remove();
  // Remove the item from localStorage
  let cart_items = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart_items = cart_items.filter(
    (item) => item.img !== x.img && item.price !== x.price
  );
  localStorage.setItem("cartItems", JSON.stringify(cart_items));
};
