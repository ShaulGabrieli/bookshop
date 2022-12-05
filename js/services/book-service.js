'use strict'

const STORAGE_KEY = 'shopDB'
var gFilterBy = 'all'
var gBooks
var gBookNames = ['Harry Potter', 'Lord of the rings', 'Goosebumps', 'The Devil Wears Prada']
var gMinRate
var gMaxPrice
const PAGE_SIZE = 5
var gPageIdx = 0
_createBooks()

function _createBook(name, price = getRandomIntInclusive(50, 250)) {
    return {
        id: makeId(),
        name,
        price,
        desc: makeLorem(),
        rate: 0,
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 4; i++) {
            var bookName = gBookNames[i].toLowerCase()
            books.push(_createBook(bookName))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
    const idx = gBooks.findIndex((book) => bookId === book.id)
    gBooks.splice(idx, 1)
    _saveBooksToStorage()
}

function addBook(bookName, bookPrice) {
    var book = _createBook(bookName, bookPrice)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function updateBook(bookId, bookPrice) {
    const idx = gBooks.findIndex((book) => bookId === book.id)
    gBooks[idx].price = bookPrice
    _saveBooksToStorage()
}

function getBookById(bookId) {
    const book = gBooks.find((book) => bookId === book.id)
    return book
}

function plusRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate === 10) return book.rate
    book.rate++
    return book.rate
}

function minusRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate === 0) return book.rate
    book.rate--
    return book.rate
}

function setFilter(filterBy) {
    gFilterBy = filterBy
    gPageIdx = 0
}

function getBooksForDisplay() {
    // gPageIdx = 0
    var currBooks
    if (gFilterBy === 'all' || gFilterBy === '') currBooks = gBooks.slice()
    else {
        gMinRate = getMinRate()
        gMaxPrice = getMaxPrice()
        currBooks = gBooks.filter(
            (book) => (book.price === gMaxPrice && gFilterBy === 'price') || (book.rate === gMinRate && gFilterBy && gFilterBy === 'rate') || book.name === gFilterBy.toLowerCase()
        )
    }

    var startIdx = gPageIdx * PAGE_SIZE
    return currBooks.slice(startIdx, startIdx + PAGE_SIZE)
}

function getMaxPrice() {
    var max = -Infinity
    gBooks.forEach((book) => {
        if (book.price > max) max = book.price
    })
    return max
}

function getMinRate() {
    var min = Infinity
    gBooks.forEach((book) => {
        if (book.rate < min) min = book.rate
    })
    return min
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx--
        return
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx < 0) {
        gPageIdx++
        return
    }
}
