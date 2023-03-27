
export function priceFormat(num) {
  if (num) {
    return (num / 100).toFixed(2)
  } else {
    return '0.00'
  }
}
