function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return '0 Kz'

  // Converter para número de forma segura
  let num
  
  if (typeof amount === 'string') {
    // Remove todos os pontos (separadores de milhar)
    // e substitui vírgula por ponto (decimal)
    const cleaned = amount.replace(/\./g, '').replace(',', '.')
    num = parseFloat(cleaned)
  } else {
    num = Number(amount)
  }
  
  if (isNaN(num)) return '0 Kz'
  
  // Arredonda para 2 casas decimais
  num = Math.round(num * 100) / 100
  
  // Separa parte inteira e decimal
  const parts = num.toFixed(2).split('.')
  const integerPart = parseInt(parts[0], 10)
  const decimalPart = parts[1]
  
  // Adiciona pontos de milhar na parte inteira
  const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  // Se a parte decimal for "00", não mostra
  if (decimalPart === '00') {
    return formattedInteger + ' Kz'
  } else {
    return formattedInteger + ',' + decimalPart + ' Kz'
  }
}

module.exports = formatAmount