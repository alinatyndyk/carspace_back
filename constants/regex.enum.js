module.exports = {
    NUMBER: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    PASSWORD:  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    BRANDS: ['BMW', 'AUDI']
}