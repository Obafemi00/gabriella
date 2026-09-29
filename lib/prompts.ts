// gi links each prompt to a word group, so the page can suggest words to use.
export const CUE_CARDS: { topic: string; points: string[]; explain: string; gi: number }[] = [
  { topic: "Describe a skill you learned outside of school.", points: ["what the skill is", "who taught you or how you learned it", "how long it took to learn"], explain: "and explain why this skill is useful to you.", gi: 1 },
  { topic: "Describe a place in your city where you like to relax.", points: ["where it is", "how often you go there", "what you do there"], explain: "and explain why it helps you relax.", gi: 5 },
  { topic: "Describe a piece of technology you use every day.", points: ["what it is", "when you started using it", "what you use it for"], explain: "and explain how your life would change without it.", gi: 2 },
  { topic: "Describe a person who has influenced your career plans.", points: ["who this person is", "how you know them", "what they did or said"], explain: "and explain how they influenced you.", gi: 4 },
  { topic: "Describe an environmental problem in the area where you live.", points: ["what the problem is", "what causes it", "who it affects"], explain: "and explain what you think should be done about it.", gi: 0 },
  { topic: "Describe a healthy habit you would like to develop.", points: ["what the habit is", "why you do not have it yet", "how you plan to start"], explain: "and explain how it would improve your life.", gi: 3 },
  { topic: "Describe a change in your town or city that you have noticed.", points: ["what changed", "when it happened", "how people reacted"], explain: "and explain whether you think it was a positive change.", gi: 5 },
  { topic: "Describe a goal you hope to achieve in the next five years.", points: ["what the goal is", "why you chose it", "what you are doing to reach it"], explain: "and explain how you will feel when you achieve it.", gi: 4 },
];

export const ESSAYS: { prompt: string; gi: number }[] = [
  { prompt: "Some people believe that university education should be free for all students. Others think students should pay for their own studies. Discuss both views and give your own opinion.", gi: 1 },
  { prompt: "In many cities, the number of cars on the roads is increasing. What problems does this cause, and what solutions can you suggest?", gi: 0 },
  { prompt: "Some people think that modern technology has made people less sociable. To what extent do you agree or disagree?", gi: 2 },
  { prompt: "Governments should spend more money on preventing illness than on treating it. To what extent do you agree or disagree?", gi: 3 },
  { prompt: "More and more people are moving from rural areas to cities. Do the advantages of this trend outweigh the disadvantages?", gi: 5 },
  { prompt: "Some believe schools should teach practical skills such as cooking and managing money. Others think schools should focus on academic subjects. Discuss both views and give your own opinion.", gi: 1 },
  { prompt: "Many young people today prefer to start their own business rather than work for a company. Why is this, and is it a positive development?", gi: 4 },
];
