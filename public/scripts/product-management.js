const deleteProductButtonElements= document.querySelectorAll('.product-item button');

async function deleteProduct(event){
 const buttonElement = event.target;
 const productId= buttonElement.dataset.productid;
 const csrfToken = buttonElement.dataset.csrf;
const response= await fetch('/admin/products/'+productId,{
    method:"DELETE",
    body:JSON.stringify({
        _csrf:csrfToken
    })
});
 if(!response.ok){
alert('Something went wrong!');
return;
 }
 buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements){
    deleteProductButtonElement.addEventListener('click',deleteProduct);
}