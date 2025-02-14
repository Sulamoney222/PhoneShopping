// Declaring all variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const content = document.querySelector('.content');


// cart 
let cart = []

// buttons
let buttonDom = []

class Products{
 async getProducts(){
    try {
        let product = await fetch('products1.json')
        let response = await product.json()

        let allProducts = response.item
     allProducts=allProducts.map((item)=>{
            const {id} = item.sys
            const {title,price,imageName} = item.fields
           
            return {id, title,price,imageName}
        })
        return allProducts
    } catch (error) {
        console.log(error); 
    }
 }
}

// display products
class UI{
    displayProducts(products){
        let result=''
        products.forEach((product) =>{
            result+= `
            <article class="product">
                    <div class="img-container">
                        <img src=${product.imageName} class="product-img">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    
                    <p>$${product.price}</p>
                </article>
            `
        })
        
        productsDOM.innerHTML = result
    }
    

    getBagButtons(){
        const btns = [...document.querySelectorAll('.bag-btn')];

        buttonDom= btns
        btns.forEach(btn=>{
            let id = btn.dataset.id
            let inCart = cart.find(item=> item.id ===id)
            if(inCart){
                btn.innerHTML = 'In Cart';
                btn.disabled = true
            }
                btn.addEventListener('click', (event)=>{
                    event.target.innerHTML = 'In Cart';
                    event.target.disabled = true

                    //get products from products
                   let cartItem = {...Storage.getProduct(id), amount:1}
                  
                   
                   
                    //add product to the cart
                    cart = [...cart, cartItem]
                    console.log(cart);
                    
                    //save cart to local storage
                   Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addcartItem(cartItem)
                    //show the cart
                    this.showCart()
                })
            
            
        })
        
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;;
            itemsTotal += item.amount
        })
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2))
        cartItems.innerHTML = itemsTotal;
        
    }

    addcartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item')
        div.innerHTML =`
         <img src=${item.imageName} alt="" srcset="">
                        
                        <div>
                            <h4>${item.title}</h4>
                            <h5>$${item.price}</h5>
                            <span class="remove-item" data-id =${item.id}>remove</span>
                        </div>

                        <div>
                            <i class="fas fa-chevron-up" data-id =${item.id}></i>
                            <p class="item-amount">${item.amount}</p>
                            <i class="fas fa-chevron-down" data-id =${item.id}></i>
                        </div>`
                        content.appendChild(div)
                        
                        
    }
    

    showCart(){
         cartOverlay.classList.add('transparentBcg')
         cartDom.classList.add('showCart')
    }
//setting up the application
    setupApp(){
        cart = Storage.getCart();
        this.setCartValues(cart)
        this.populate(cart);
        cartBtn.addEventListener('click',this.showCart)
        closeCartBtn.addEventListener('click',this.hideCart)


    }
    populate(cart){
        cart.forEach(item=>this.addcartItem(item));

    }

    hideCart(){
        cartOverlay.classList.remove('transparentBcg')
        cartDom.classList.remove('showCart')
    }

    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart()
        });
        //clear functionality
        content.addEventListener('click', event=>{
           if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                content.removeChild
              (removeItem.parentElement.parentElement);
               
                this.removeItem(id)
            } else if(event.target.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1
            }
            
        })
       
        
    }

    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id))
        while(content.children.length>0){
            content.removeChild(content.children[0])
        }
        this.hideCart()
       
    }
    removeItem(id){
        cart =cart.filter(item=> item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class='fas fa-shopping-cart'></i>add to cart`

    }
    getSingleButton(id){
        return buttonDom.find(button=> button.dataset.id === id)
    }
   
}

//local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products))
    }

    //adding specific product when clicking the buttton
   static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'))
    return products.find(product => product.id === id)
   }

   //adding cart to the localStorage
   static saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart))
    
   }
   static getCart(){
    return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : []
   }

}


document.addEventListener('DOMContentLoaded', ()=>{

    const ui = new UI()
    const products = new Products()

    //setupApp
    ui.setupApp()
    //get all products
    products.getProducts()
    .then(products => 
        {ui.displayProducts(products)
        Storage.saveProducts(products)
    })
    .then(()=>{
       ui.getBagButtons();
       ui.cartLogic();
    })
        


        })

 








        // {
        //     "sys":{"id": "2" },

        //     "fields": {
        //         "title":"anything for me",
        //         "price": 10.99,
        //         "image": {"fields": { "file": {"url":"https://tse1.mm.bing.net/th?id=OIP.Lq48hpv_1oJn-G_ixS9JWgHaHa&pid=Api&P=0&h=180"}}}

        //     }
        // },

        // {
        //     "sys":{"id": "3" },

        //     "fields": {
        //         "title":"anything for me",
        //         "price": 10.99,
        //         "image": {"fields": { "file": {"url":"iphone.jpg"}}}

        //     }
        // },

        // {
        //     "sys":{"id": "4" },

        //     "fields": {
        //         "title":"anything for me",
        //         "price": 10.99,
        //         "image": {"fields": { "file": {"url":"iphone.jpg"}}}

        //     }
        // },

        // {
        //     "sys":{"id": "5" },

        //     "fields": {
        //         "title":"anything for me",
        //         "price": 10.99,
        //         "image": {"fields": { "file": {"url":"iphone.jpg"}}}

        //     }
        // }