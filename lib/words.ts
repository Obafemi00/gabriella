export type Word = {
  word: string;
  pos: string;
  def: string;
  ex: string;
  col: string;
  group: number;
};

type Row = [word: string, pos: string, def: string, example: string, collocations: string, group: number];

// To add a word: add a row in alphabetical order. Progress is saved by the word text,
// so renaming a word resets its mark.
// The last number is the word's group on the Words page (one new group opens each day).
// Groups are fixed here, never chosen at runtime, and mixed so a group isn't A to Z or one
// topic. Give a new word the highest group with fewer than GROUP_SIZE words, or start the
// next group when that one is full.
const ROWS: Row[] = [
  ["affluent", "adjective", "wealthy; having plenty of money", "Affluent households tend to produce more waste per person.", "affluent families, affluent areas", 2],
  ["albeit", "linker", "although; introduces something that limits what was just said", "The economy recovered, albeit more slowly than expected.", "albeit slowly, albeit briefly", 1],
  ["allocate", "verb", "to officially give something for a particular purpose", "The council plans to allocate more funds to public libraries.", "allocate funds, allocate resources", 2],
  ["automation", "noun", "the use of machines or computers to do work previously done by people", "Automation has reduced the need for manual labour in factories.", "workplace automation, increased automation", 1],
  ["biodiversity", "noun", "the variety of plant and animal life in a particular area", "Deforestation poses a serious threat to biodiversity.", "protect biodiversity, loss of biodiversity", 1],
  ["breakthrough", "noun", "an important discovery or development", "The vaccine was hailed as a major medical breakthrough.", "major breakthrough, scientific breakthrough", 1],
  ["chronic", "adjective", "lasting for a long time or happening again and again", "Chronic stress can weaken the immune system over time.", "chronic illness, chronic shortage", 1],
  ["commute", "noun", "a regular journey between home and work", "A long daily commute can leave workers exhausted.", "daily commute, long commute", 2],
  ["compulsory", "adjective", "required by law or a rule", "In some countries, military service is compulsory for young adults.", "compulsory education, compulsory subject", 3],
  ["consequently", "linker", "as a result", "Fuel prices rose; consequently, more people switched to public transport.", "...; consequently, ...", 1],
  ["conservation", "noun", "the protection of natural environments, plants and animals", "Wildlife conservation projects often rely on tourism income.", "wildlife conservation, conservation efforts", 3],
  ["curriculum", "noun", "the subjects included in a course of study", "Many argue that coding should be part of the school curriculum.", "national curriculum, part of the curriculum", 1],
  ["cutting-edge", "adjective", "the most advanced at the present time", "The university invests heavily in cutting-edge research.", "cutting-edge technology, cutting-edge research", 1],
  ["degradation", "noun", "the process of something becoming worse in quality or condition", "Land degradation reduces the amount of food farmers can grow.", "environmental degradation, land degradation", 2],
  ["deplete", "verb", "to reduce the amount of a resource until little is left", "Overfishing continues to deplete stocks in many coastal waters.", "deplete natural resources, depleted reserves", 1],
  ["digital divide", "phrase", "the gap between people who have access to modern technology and those who do not", "The digital divide leaves rural communities at a disadvantage.", "bridge the digital divide", 1],
  ["emissions", "noun", "gases or substances released into the air", "Carbon emissions from aviation have risen sharply.", "carbon emissions, cut emissions", 1],
  ["enforce", "verb", "to make sure a law or rule is obeyed", "Police struggle to enforce speed limits on rural roads.", "enforce the law, strictly enforced", 2],
  ["entrepreneur", "noun", "a person who starts a business and takes financial risks", "Access to affordable loans helps a young entrepreneur get started.", "young entrepreneur, successful entrepreneur", 1],
  ["epidemic", "noun", "a rapid spread of a disease among many people in one area", "Health officials acted quickly to contain the epidemic.", "contain an epidemic, obesity epidemic", 1],
  ["extracurricular", "adjective", "done outside the normal timetable of classes", "Extracurricular activities help children build teamwork skills.", "extracurricular activities", 2],
  ["fluctuate", "verb", "to rise and fall irregularly", "Sales tended to fluctuate between 200 and 300 units per month.", "fluctuate wildly, fluctuate between X and Y", 1],
  ["furthermore", "linker", "in addition; used to add a further point", "Furthermore, online courses allow learners to study at their own pace.", "Furthermore, ...", 2],
  ["in contrast", "phrase", "used to show a clear difference from what was said before", "In contrast, the number of male applicants fell slightly.", "In contrast, ... / in contrast to", 1],
  ["incentive", "noun", "something that encourages a person to do something", "Tax breaks act as an incentive for companies to hire graduates.", "financial incentive, provide an incentive", 1],
  ["inequality", "noun", "an unfair difference between groups in wealth, rights or opportunities", "Income inequality can undermine social cohesion.", "income inequality, gender inequality", 1],
  ["infrastructure", "noun", "the basic systems a country needs, such as roads, power and water supply", "Poor infrastructure slows down economic growth.", "transport infrastructure, invest in infrastructure", 1],
  ["innovation", "noun", "a new idea, method or product", "Innovation in healthcare has extended millions of lives.", "technological innovation, drive innovation", 2],
  ["integrate", "verb", "to combine something so that it becomes part of a larger whole", "Schools are trying to integrate technology into everyday lessons.", "integrate technology into, fully integrated", 2],
  ["legislation", "noun", "a law or set of laws made by a government", "New legislation bans single-use plastic bags in several cities.", "introduce legislation, strict legislation", 2],
  ["life expectancy", "phrase", "the average number of years a person is expected to live", "Life expectancy has risen steadily thanks to better sanitation.", "increase life expectancy, average life expectancy", 1],
  ["literacy", "noun", "the ability to read and write", "Adult literacy rates have improved considerably in recent decades.", "literacy rate, digital literacy", 1],
  ["lucrative", "adjective", "producing a large amount of money", "Software development has become a lucrative career path.", "lucrative career, lucrative market", 2],
  ["marginally", "adverb", "by a very small amount", "Exports were marginally higher in 2020 than in 2019.", "marginally higher, marginally lower", 1],
  ["mitigate", "verb", "to make something less severe, harmful or painful", "Planting trees can help mitigate the effects of urban heat.", "mitigate the impact, mitigate the risk", 2],
  ["nevertheless", "linker", "despite what has just been said", "The plan is expensive; nevertheless, it may save money in the long run.", "...; nevertheless, ...", 2],
  ["nutritious", "adjective", "containing substances that help the body grow and stay healthy", "Schools should provide nutritious meals at an affordable price.", "nutritious food, nutritious diet", 2],
  ["obesity", "noun", "the condition of being very overweight in a way that harms health", "Childhood obesity has become a major public health concern.", "childhood obesity, obesity rates", 3],
  ["obsolete", "adjective", "no longer used because something newer exists", "Many traditional jobs may become obsolete as machines improve.", "become obsolete, render something obsolete", 1],
  ["peak", "noun", "the highest point or level", "Electricity demand hit a peak at around 6 p.m.", "reach a peak, hit a peak of", 2],
  ["plateau", "noun", "a period when a figure stays at the same level after rising", "Visitor numbers reached a plateau in the final three years.", "reach a plateau", 2],
  ["plummet", "verb", "to fall very quickly and suddenly", "Coal consumption began to plummet after 2010.", "plummet to a low of", 2],
  ["preventive", "adjective", "intended to stop something bad from happening", "Preventive care is usually cheaper than treating illness later.", "preventive measures, preventive care", 1],
  ["productivity", "noun", "the rate at which work or goods are produced", "Flexible hours may boost productivity rather than reduce it.", "boost productivity, labour productivity", 2],
  ["proportion", "noun", "a part or share of a whole, often given as a percentage", "The proportion of students studying abroad doubled over the period.", "a large proportion of, the proportion of", 1],
  ["recession", "noun", "a period when a country's economy shrinks", "Many small businesses closed during the recession.", "economic recession, enter a recession", 1],
  ["renewable", "adjective", "naturally replaced, so it will not run out", "Solar and wind are the most widely used renewable energy sources.", "renewable energy, renewable resources", 2],
  ["rote learning", "phrase", "memorising information by repetition rather than understanding", "Critics claim that rote learning does little to develop critical thinking.", "rely on rote learning", 1],
  ["sedentary", "adjective", "involving a lot of sitting and little physical activity", "A sedentary lifestyle increases the risk of heart disease.", "sedentary lifestyle, sedentary job", 2],
  ["steadily", "adverb", "gradually and evenly", "The figure rose steadily throughout the decade.", "rise steadily, decline steadily", 2],
  ["surge", "noun", "a sudden, large increase", "There was a surge in online shopping during the holiday period.", "a surge in demand, a sharp surge", 2],
  ["surveillance", "noun", "the careful watching of people, often by the authorities", "The growth of online surveillance raises concerns about privacy.", "mass surveillance, surveillance cameras", 1],
  ["sustainable", "adjective", "able to continue over time without damaging the environment", "Governments should invest in sustainable forms of transport.", "sustainable development, sustainable energy", 1],
  ["tertiary", "adjective", "relating to education at university or college level", "Access to tertiary education has expanded in many countries.", "tertiary education, tertiary institutions", 2],
  ["thereby", "linker", "as a result of this action", "Cities can add cycle lanes, thereby reducing traffic congestion.", "..., thereby reducing ...", 2],
  ["to a large extent", "phrase", "mostly; in most respects", "I agree to a large extent that museums should be free.", "agree to a large extent", 2],
  ["tuition", "noun", "teaching, or the money paid for it", "Rising tuition fees may discourage students from lower-income families.", "tuition fees, private tuition", 1],
  ["unemployment", "noun", "the state of not having a paid job", "Youth unemployment remains high in many developing economies.", "youth unemployment, unemployment rate", 2],
  ["urbanisation", "noun", "the movement of people from rural areas into cities", "Rapid urbanisation has put pressure on housing and transport.", "rapid urbanisation", 3],
  ["vocational", "adjective", "relating to the skills needed for a particular job or trade", "Vocational courses prepare students for trades such as plumbing.", "vocational training, vocational qualifications", 2],
  ["welfare", "noun", "health and happiness; also help given by the state to people in need", "The welfare of elderly citizens should be a priority for the state.", "social welfare, animal welfare", 2],
  ["well-being", "noun", "the state of being healthy, comfortable and happy", "Regular exercise benefits both physical and mental well-being.", "mental well-being, sense of well-being", 1],
  ["whereas", "linker", "used to compare two facts that are different", "City dwellers rely on public transport, whereas rural residents mostly drive.", "X, whereas Y", 2],
  ["workforce", "noun", "all the people who work in a company, industry or country", "Remote work has changed how companies manage their workforce.", "skilled workforce, enter the workforce", 2],
];

export const WORDS: Word[] = ROWS.map(([word, pos, def, ex, col, group]) => ({ word, pos, def, ex, col, group }));

export const GROUP_SIZE = 30;
export const LAST_GROUP = Math.max(...WORDS.map((w) => w.group));
export const wordsInGroup = (g: number) => WORDS.filter((w) => w.group === g);
