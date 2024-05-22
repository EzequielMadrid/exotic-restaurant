/* ************************************************************************ */
// ADDING FONT FAMILY IN VANILLA JS, another way is directly in <head> tag ...
const style = document.createElement("style");
style.innerHTML = `
  .title {
        font-family: "Ewert", serif;
        font-weight: 400;
        font-style: normal;
  }
  .filter-btn {
      font-family: "Oleo Script Swash Caps", system-ui;
      font-size: 2.5rem;
  }
  @media (max-width: 640px) {
      .filter-btn {
            font-size: 2rem; /* This is equivalent to 16px */
      }
}
  .card-title {
      font-family: "Zilla Slab Highlight", serif;
      font-weight: 700;
      font-style: normal;    
      font-size: 2rem;
  }
  .card-price {
      font-family: "Protest Guerrilla", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 1.2rem;
  }
  .item-text {
        font-family: "Redressed", cursive;
        font-weight: 400;
        font-style: normal;
  }
`;
document.head.appendChild(style);
/* ************************************************************************ */
