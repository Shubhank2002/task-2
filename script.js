const container = document.createElement('div')

const products_container = document.createElement('div')
products_container.style.display = 'flex'
products_container.style.flexWrap = 'wrap'
products_container.style.width = '80%'
products_container.style.gap = '20px'

async function getProducts(){
    const response = await fetch('https://dummyjson.com/products?limit=15')
    const data = await response.json()
    console.log(data)
    return data.products
}

function createProductCard(product) {
    const discountedPrice = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2)

    // Card
    const card = document.createElement('div')
    card.classList.add('card')

    // Main Image
    const mainImg = document.createElement('img')
    mainImg.src = product.images[0]
    mainImg.classList.add('main-image')
    card.appendChild(mainImg)

    // Thumbnails
    const thumbContainer = document.createElement('div')
    thumbContainer.classList.add('thumb-container')
    product.images.forEach(imgUrl => {
        const thumb = document.createElement('img')
        thumb.src = imgUrl
        thumb.classList.add('thumb')
        thumbContainer.appendChild(thumb)
    })
    card.appendChild(thumbContainer)

    // Title
    const title = document.createElement('p')
    title.innerText = product.title
    title.classList.add('title')
    card.appendChild(title)

    // Original Price (strikethrough)
    const originalPrice = document.createElement('p')
    originalPrice.innerText = `Rs. ${product.price}`
    originalPrice.classList.add('original-price')
    card.appendChild(originalPrice)

    // Discounted Price
    const discPrice = document.createElement('p')
    discPrice.innerText = `Rs. ${discountedPrice}`
    discPrice.classList.add('disc-price')
    card.appendChild(discPrice)

    // Save Badge
    const saveBadge = document.createElement('span')
    saveBadge.innerText = `save ${product.discountPercentage}%`
    saveBadge.classList.add('save-badge')
    card.appendChild(saveBadge)

    // Star Rating
    const rating = document.createElement('p')
    const stars = Math.round(product.rating)
    rating.innerText = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    rating.classList.add('rating')
    card.appendChild(rating)

    // Show Description Button
    const showDescBtn = document.createElement('button')
    showDescBtn.innerText = 'Show Description'
    showDescBtn.classList.add('show-desc-btn')
    card.appendChild(showDescBtn)

    // Description Div (hidden by default)
    const descDiv = document.createElement('div')
    descDiv.classList.add('desc-div')
    descDiv.style.display = 'none'

    const descText = document.createElement('p')
    descText.innerText = product.description
    descDiv.appendChild(descText)

    const lessDescBtn = document.createElement('button')
    lessDescBtn.innerText = 'Less Description'
    lessDescBtn.classList.add('less-desc-btn')
    descDiv.appendChild(lessDescBtn)

    card.appendChild(descDiv)

    // Show/Hide Description Logic
    showDescBtn.addEventListener('click', () => {
        descDiv.style.display = 'block'
        showDescBtn.style.display = 'none'
    })
    lessDescBtn.addEventListener('click', () => {
        descDiv.style.display = 'none'
        showDescBtn.style.display = 'block'
    })

    // Add to Cart Button
    const addToCart = document.createElement('button')
    addToCart.innerText = 'Add to cart'
    addToCart.classList.add('add-to-cart')
    card.appendChild(addToCart)

    return card
}

function renderProducts(products){
    products.forEach((product, index)=>{
        const card = createProductCard(product)
        products_container.appendChild(card)
    })
    container.appendChild(products_container)
    document.body.appendChild(container)
}

async function init() {
    const products = await getProducts()
    renderProducts(products)
}

init()
