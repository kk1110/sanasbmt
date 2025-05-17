import { db, ref, push, get, child } from './firebase-config.js';

const categorySelect = document.getElementById("category");

async function loadCategories() {
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    const categories = snapshot.val();
    // Clear existing options except first placeholder
    categorySelect.innerHTML = `<option value="">Select Category</option>`;
    for (const [key, cat] of Object.entries(categories)) {
      const option = document.createElement("option");
      option.value = key;         // store category key as value
      option.textContent = cat.name; // show category name
      categorySelect.appendChild(option);
    }
  }
}
loadCategories();


document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value.trim());
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const isFeatured = document.getElementById("isFeatured").checked;

  if (!imageUrl) {
    alert("Please provide a direct image URL.");
    return;
  }

  const newProduct = {
    name,
    price,
    category,
    description,
    image: imageUrl,
    isFeatured: isFeatured // Optional boolean
  };

  await push(ref(db, 'products'), newProduct);

  alert("Product added!");
  e.target.reset();
});
