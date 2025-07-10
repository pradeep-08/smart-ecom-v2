// PDF styling constants and color schemes
export const PDF_COLORS = {
  primaryBlue: [31, 81, 135] as const,
  lightBlue: [59, 130, 246] as const,
  accentBlue: [37, 99, 235] as const,
  grayColor: [107, 114, 128] as const,
  lightGray: [243, 244, 246] as const,
  white: [255, 255, 255] as const,
  black: [0, 0, 0] as const,
  red: [220, 38, 38] as const
};

export const PDF_LAYOUT = {
  pageWidth: 210,
  pageHeight: 297,
  headerHeight: 50,
  margin: 20,
  columnWidth: 170,
  boxWidth: 80,
  boxHeight: 45
};

export const PDF_FONTS = {
  title: { size: 36, style: 'bold' as const },
  subtitle: { size: 14, style: 'bold' as const },
  body: { size: 11, style: 'normal' as const },
  small: { size: 10, style: 'normal' as const },
  footer: { size: 9, style: 'italic' as const },
  total: { size: 12, style: 'bold' as const },
  thankYou: { size: 20, style: 'bold' as const }
};
