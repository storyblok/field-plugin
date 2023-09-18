const styles = {
  reset: '\u001b[0m',
  green: '\u001b[32m',
  gray: '\u001b[30;1m',
  red: '\u001b[31m',
  bold: '\u001b[1m',
}

export const green = (text: string) => `${styles.green}${text}${styles.reset}`
export const bold = (text: string) => `${styles.bold}${text}${styles.reset}`
export const gray = (text: string) => `${styles.gray}${text}${styles.reset}`
export const red = (text: string) => `${styles.red}${text}${styles.reset}`
