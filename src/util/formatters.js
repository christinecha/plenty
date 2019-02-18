export const formatMoney = (n) => (
  n < 1
    ? `-$${Math.abs(n).toFixed(2)}`
    : `$${n.toFixed(2)}`
)