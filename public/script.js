document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");
  const addProductButton = document.getElementById("add-product");
  const modal = document.getElementById("product-modal");
  const modalClose = document.querySelector(".close");
  const productForm = document.getElementById("product-form");
  const productNameInput = document.getElementById("name");
  const productPriceInput = document.getElementById("price");
  const productIdInput = document.getElementById("product-id");

  // Function to render products
  function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button class="btn btn-edit" data-product-id="${product._id}">Edit</button>
                <button class="btn btn-delete" data-product-id="${product._id}">Delete</button>
            `;

      const editButton = productCard.querySelector(".btn-edit");
      const deleteButton = productCard.querySelector(".btn-delete");

      editButton.addEventListener("click", () => {
        const productId = editButton.getAttribute("data-product-id");
        const product = products.find((p) => p._id === productId);

        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productIdInput.value = productId;

        modal.style.display = "block";
      });

      deleteButton.addEventListener("click", () => {
        const productId = deleteButton.getAttribute("data-product-id");
        deleteProduct(productId);
      });

      productList.appendChild(productCard);
    });
  }

  // Function to handle adding a new product
  async function addProduct(event) {
    event.preventDefault();
  
    const name = productNameInput.value;
    const price = parseFloat(productPriceInput.value);
  
    if (name && price) {
      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, price }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const product = await response.json();
  
        renderProducts([...products, product]);
        modal.style.display = "none";
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  }
  

  // Function to handle editing an existing product
  async function editProduct(event) {
    event.preventDefault();
  
    const productId = productIdInput.value;
    const name = productNameInput.value;
    const price = parseFloat(productPriceInput.value);
  
    if (productId && name && price) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, price }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const updatedProduct = await response.json();
        const updatedProducts = products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
  
        renderProducts(updatedProducts);
        modal.style.display = "none";
      } catch (error) {
        console.error("Error editing product:", error);
      }
    }
  }
  

  // Function to handle deleting a product
  async function deleteProduct(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      const updatedProducts = products.filter((product) => product._id !== productId);
      renderProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  // Event listeners
  addProductButton.addEventListener("click", () => {
    productNameInput.value = "";
    productPriceInput.value = "";
    productIdInput.value = "";
    modal.style.display = "block";
  });

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  productForm.addEventListener("submit", (event) => {
    if (productIdInput.value) {
      editProduct(event);
    } else {
      addProduct(event);
    }
  });

  // Fetch and display grocery products
  let products = [];
  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      products = data;
      renderProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  fetchProducts();


  const searchInput = document.getElementById("search");

  // Function to filter products based on search input
  function filterProducts(searchTerm) {
    const filteredProducts = products.filter((product) => {
      const productName = product.name.toLowerCase();
      return productName.includes(searchTerm.toLowerCase());
    });
    renderProducts(filteredProducts);
  }

  // Event listener for search input
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    filterProducts(searchTerm);
  });
});
