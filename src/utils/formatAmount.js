function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return '0,00 Kz'

  const formatter = new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return formatter.format(Number(amount))
}

module.exports = formatAmount