// Hardcoded test cases for manual QA
export const getSampleTestCases = async (difficulty: 'simple' | 'complex'): Promise<string[]> => {
  // Simulating an API delay for realistic UI behavior
  await new Promise(resolve => setTimeout(resolve, 600));

  const commonCases = [
    "მე მიყვარს საქარტველო.", // Typo: საქარტველო
    "დღეს კარგი ამინდია მაგრამ, წვიმს.", // Punctuation error
    "მასწავლებელმა მოსწავლეს წიგნი აჩუქა.", // Correct sentence for false positive check
    "ჩემი მეგობარი თბილიშში ცხოვრობს.", // Typo: თბილიშში
    "რომელი საათია ახლა?", // Correct
    "ისინი მიდიან სახლში.", // Correct
    "გუშინ ვნახე საინტერესო ფილმი.", // Correct
    "ეს არის ძალიან მნიშვნეოვანი საკითხი." // Typo: მნიშვნეოვანი
  ];

  // Return random 5 sentences
  return commonCases.sort(() => 0.5 - Math.random()).slice(0, 5);
};