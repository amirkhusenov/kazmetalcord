/**
 * Script to analyze characters in a string input from console
 * Identifies if each character is Cyrillic, Latin, or other
 */

import * as readline from 'readline';

// Create readline interface for console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to analyze character type
function analyzeChar(char: string): string {
  const code = char.charCodeAt(0);
  
  // Cyrillic range: U+0400 to U+04FF (plus some extensions)
  if ((code >= 0x0400 && code <= 0x04FF) || 
      (code >= 0x0500 && code <= 0x052F)) {
    return 'Cyrillic';
  }
  
  // Basic Latin range: U+0000 to U+007F
  // Latin-1 Supplement: U+0080 to U+00FF
  // Latin Extended-A,B: U+0100 to U+024F
  if ((code >= 0x0000 && code <= 0x024F)) {
    return 'Latin';
  }
  
  // Other character types
  return 'Other';
}

// Prompt for input
rl.question('Enter a string to analyze: ', (input: string) => {
  console.log('\nCharacter analysis:');
  console.log('====================');
  
  // Loop through each character in the input
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const code = char.charCodeAt(0);
    const type = analyzeChar(char);
    
    console.log(`'${char}' - Unicode: U+${code.toString(16).padStart(4, '0').toUpperCase()} - Type: ${type}`);
  }
  
  rl.close();
});
