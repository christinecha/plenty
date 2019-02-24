export const formatMoney = (n) => {
  const neg = n < 0 ? '-' : ''
  const absValue = Math.abs(n)

  const dollars = Math.floor(absValue)
  const cents = Math.floor((absValue - dollars) * 100)

  let dollarString = dollars + ''
  const formattedDollars = dollarString
    .split('')
    .reverse()
    .reduce((str, digit, i) => {
      if (i === 0) return digit
      if (i % 3 === 0) return digit + ',' + str
      return digit + str
    }, '')
  
  const centsString = cents < 10 ? `0${cents}` : cents

  return `${neg}$${formattedDollars}.${centsString}`
}