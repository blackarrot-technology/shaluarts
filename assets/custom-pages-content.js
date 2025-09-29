/*for the forc click event trigger on products having customly app applied*/

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('trigger-button').addEventListener('click', function () {
        // Add a class to the trigger-button
        this.classList.add('disabled');
        
        // Trigger the click event on the customily-cart-btn
        const customilyButton = document.getElementById('customily-cart-btn');
        if (customilyButton) {
            customilyButton.click();
        } else {
            alert('customily-cart-btn not found');
        }
    });
});



/*for the product page otion apened in title section*/


document.addEventListener('DOMContentLoaded', () => {
  const productTitle = document.querySelector('.product-title'); // Adjust selector for product title
  const hideScrollbarDivs = document.querySelectorAll('.rio-hide-scrollbar'); // Get all divs to listen for clicks
  const optionValues = document.querySelectorAll('.rio-product-option-title-option-value'); // Options to fetch values

  if (productTitle && hideScrollbarDivs.length > 0) {
      hideScrollbarDivs.forEach(hideScrollbarDiv => {
          hideScrollbarDiv.addEventListener('click', () => {
              // Get the text content from all option values
              const selectedOptions = Array.from(optionValues)
                  .map(option => option.textContent.trim())
                  .filter(value => value) // Filter out empty values
                  .join(', ');

              // Remove existing appended content
              const existingOption = productTitle.querySelector('.product-option-append');
              if (existingOption) {
                  existingOption.remove();
              }

              // Append the selected options to the product title
              if (selectedOptions) {
                  const htmlToAppend = `<span class="product-option-append"> - ${selectedOptions}</span>`;
                  productTitle.insertAdjacentHTML('beforeend', htmlToAppend);
              }
          });
      });
  }
});

