const pageWrapper = document.createElement('div')
pageWrapper.style.display = 'flex'
pageWrapper.style.gap = '20px'

const container = document.createElement('div')
container.classList.add('container')

const products_container = document.createElement('div')
products_container.classList.add('products_container')
const searchContainer = document.createElement('div')
searchContainer.classList.add('search-container')

const searchInput = document.createElement('input')
searchInput.classList.add('search-input')
searchInput.placeholder = 'Search products...'

const searchBtn = document.createElement('button')
searchBtn.innerText = 'Search'

const clearBtn = document.createElement('button')
clearBtn.innerText = 'Clear Searches'

searchContainer.append(searchInput, searchBtn, clearBtn)

const sortContainer = document.createElement('select')
sortContainer.style.alignSelf = 'start'

const default_select = document.createElement('option')
default_select.value = ''
default_select.innerText = 'Select'
default_select.disabled = true
default_select.selected = true

const sortByLowHigh = document.createElement('option')
sortByLowHigh.classList.add('sort-options')
sortByLowHigh.innerText = 'Sort By Price Low To High'
sortByLowHigh.value = 'lowToHigh'


const sortByHighLow = document.createElement('option')
sortByHighLow.classList.add('sort-options')
sortByHighLow.innerText = 'Sort By Price High To Low'
sortByHighLow.value = 'highToLow'

const sortByRating = document.createElement('option')
sortByRating.classList.add('sort-options')
sortByRating.innerText = 'Sort By Rating (High To Low)'
sortByRating.value = 'rating'


sortContainer.append(default_select, sortByLowHigh, sortByHighLow, sortByRating)

const leftSidebar = document.createElement('div')
leftSidebar.classList.add('left-sidebar')

async function getProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=15')
    const data = await response.json()
    console.log(data)
    return data.products
}

async function getCategories() {
    const response = await fetch('https://dummyjson.com/products/categories')
    const data = await response.json()
    return data
}

function renderCategories(categories) {
    categories.forEach(cat => {
        const label = document.createElement('label')
        label.style.display = 'block'
        label.style.marginBottom = '8px'

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'category'
        radio.value = cat.slug

        radio.addEventListener('change', async () => {
            const response = await fetch(`https://dummyjson.com/products/category/${cat.slug}`)
            const data = await response.json()
            renderProducts(data.products)
        })

        label.appendChild(radio)
        label.append(` ${cat.name}`)
        leftSidebar.appendChild(label)
    })
}

let products = null

sortContainer.addEventListener('change', () => {
    const value = sortContainer.value

    if (value === 'lowToHigh') {
        const sorted = [...products].sort((a, b) => {
            const priceA = a.price - (a.price * a.discountPercentage / 100)
            const priceB = b.price - (b.price * b.discountPercentage / 100)
            return priceA - priceB
        })
        renderProducts(sorted)
    } else if (value === 'highToLow') {
        const sorted = [...products].sort((a, b) => {
            const priceA = a.price - (a.price * a.discountPercentage / 100)
            const priceB = b.price - (b.price * b.discountPercentage / 100)
            return priceB - priceA
        })
        renderProducts(sorted)
    } else if (value === 'rating') {
        const sorted = [...products].sort((a, b) => b.rating - a.rating)
        renderProducts(sorted)
    }
})

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value
    const response = await fetch(`https://dummyjson.com/products/search?q=${query}`)
    const data = await response.json()
    renderProducts(data.products)
})

clearBtn.addEventListener('click', () => {
    searchInput.value = ''
    renderProducts(products)  // back to original 15
})

const clearCatBtn = document.createElement('button')
clearCatBtn.innerText = 'Clear Categories'
clearCatBtn.classList.add('clearCatBtn')
clearCatBtn.addEventListener('click', () => {
    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false)
    renderProducts(products)
})
leftSidebar.appendChild(clearCatBtn)

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
    product.images.slice(0,4).forEach(imgUrl => {
        const thumb = document.createElement('img')
        thumb.src = imgUrl
        thumb.classList.add('thumb')
        thumb.addEventListener('click',()=>{
            mainImg.src = imgUrl
        })
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

function renderProducts(products) {
    products_container.innerHTML = ''
    products.forEach((product, index) => {
        const card = createProductCard(product)
        products_container.appendChild(card)
    })
}
container.appendChild(searchContainer)
container.appendChild(sortContainer)
container.appendChild(products_container)
pageWrapper.appendChild(leftSidebar)
pageWrapper.appendChild(container)
document.body.appendChild(pageWrapper)

async function init() {
    products = await getProducts()
    renderProducts(products)
    const categories = await getCategories()
    renderCategories(categories)
}

init()
