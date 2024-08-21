const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart(){
    addToCartButtonElement.disabled = true;
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    let response;
    
    try{
 response=   await fetch('/cart/items',
    {
        method:'POST',
        body:JSON.stringify({
            productId:productId,
            _csrf:csrfToken
        }),
        headers:{
            "Content-Type":'application/json'
        }

    });
    if(!response.ok ){
        alert('Something went wrong');
        return;
    }
    const responseData = await response.json();
    const newTotalQuantity = responseData.newTotalItems;
    for (const cartBadgeElement of cartBadgeElements){
        cartBadgeElement.textContent= newTotalQuantity;
    }
    }catch(error){
        alert('Something went wrong1');
        return;
    }finally{
        addToCartButtonElement.disabled = false;
    }
  
    
}
addToCartButtonElement.addEventListener('click',addToCart);
