const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
function storeOriginalQuantity(event) {
   const form = event.target.closest('form');
   form.dataset.originalQuantity = form.firstElementChild.value;
}
async function updateCartItem(event){
    event.preventDefault();
    const form = event.target;
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity =  form.firstElementChild.value;
    const originalQuantity = form.dataset.originalQuantity;
    if(quantity < 0){
      form.firstElementChild.value= originalQuantity; 
        alert('Quantity cannot be less than 0!');
        return;
      }
    let response;
 try{
     response = await  fetch('/cart/items',{
        method:'PATCH',
        body: JSON.stringify({
            productId:productId,
            quantity:quantity,
            _csrf:csrfToken,

        }),
        headers:{
            "Content-Type":"application/json"
        }

   });
 } catch(error){
    alert('Something went wrong!');
    return;
 }
 if(!response.ok ){
    alert('Something went wrong!');
    return;
 }
 const responseData= await response.json();
 if(responseData.updatedCartData.updatedItemPrice===0){
    form.parentElement.parentElement.remove();
 } else{
    const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
    cartItemTotalPriceElement.textContent= responseData.updatedCartData.updatedItemPrice.toFixed(2);
 }

 

cartTotalPriceElement.textContent= responseData.updatedCartData.newTotalPrice.toFixed(2);

for (const cartBadgeElement of cartBadgeElements)
{
   cartBadgeElement.textContent= responseData.updatedCartData.newTotalQuantity;
}



}
for (const formElement of cartItemUpdateFormElements){
   // Store the original quantity when the input is focused
   formElement.firstElementChild.addEventListener('focus', storeOriginalQuantity);
    formElement.addEventListener('submit',updateCartItem);
}
