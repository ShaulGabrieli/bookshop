'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    var books = getBooksForDisplay()
    console.log('gBooks', gBooks)
    var strHtmls = books.map(
        (book) => `
    <tr> 
        <td> ${book.id}</td>
        <td> ${titleCase(book.name)}</td>
        <td> ${book.price}</td>
        <td> <button class="read-button" onclick="onActiveRead('${book.id}')">Read</button></td>
        <td> <button  class="update-button" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td> <button  class="remove-button" onclick="onRemoveBook('${book.id}')">Delete</button></td>
    </tr>`
    )

    document.querySelector('.books-list').innerHTML = strHtmls.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook() {
    const bookName = prompt('Please enter the book name:').toLowerCase()
    const bookPrice = +prompt('Please enter the price:')
    if (bookName === '' || bookPrice === '' || !bookName || !bookPrice) return
    addBook(bookName, bookPrice)
    renderBooks()
}

function onUpdateBook(bookId) {
    const bookPrice = +prompt('Please enter the price:')
    if (!bookPrice) return
    console.log('prompt', bookPrice)
    updateBook(bookId, bookPrice)
    renderBooks()
}

function onActiveRead(bookId) {
    const book = getBookById(bookId)
    console.log(book)
    const elModal = document.querySelector('.modal')
    elModal.classList.add('open')
    elModal.querySelector('h2').innerText = book.name
    elModal.querySelector('h3 span').innerText = book.price
    elModal.querySelector('p').innerText = book.desc
    elModal.querySelector('.modal-img').innerHTML = `
    <img onerror="this.src='img/default.png'" src="img/${book.name}.jpg" alt="Book Title is ${book.name}">`
    renderRateButtons(bookId)
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
}

function onPlusRate(bookId) {
    const rate = plusRate(bookId)
    document.querySelector('.rate-value').innerText = rate
}

function onMinusRate(bookId) {
    const rate = minusRate(bookId)
    document.querySelector('.rate-value').innerText = rate
}

function renderRateButtons(bookId) {
    const elRate = document.querySelector('.rate-container')
    const book = getBookById(bookId)
    elRate.innerHTML = `
    <span onclick="onPlusRate('${bookId}')" class="material-symbols-outlined ">
            add
            </span>
            <span class="rate-value">${book.rate}</span>
            <span onclick="onMinusRate('${bookId}')" class="material-symbols-outlined">
                remove
                </span>`
}

function onSetFilter(filterBy) {

    // console.log('filterBy', filterBy)
    setFilter(filterBy)
    renderBooks()

    const queryStringParams = `?option=${createStringParams(filterBy)}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function createStringParams(filterBy){
    if(filterBy === 'price') return `max_${filterBy}:${gMaxPrice}`
    else if(filterBy === 'rate') return `min_${filterBy}:${gMinRate}`
    else return `${filterBy}`
}

function onPrevPage(){
    prevPage()
    renderBooks()
}

function onNextPage(){
    nextPage()
    renderBooks()
}