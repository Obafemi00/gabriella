export type Word = {
  word: string;
  pos: string;
  def: string;
  ex: string;
  col: string;
  group: string;
  gi: number;
};

type Row = [word: string, pos: string, def: string, example: string, collocations: string];

// To add words: add a row to a group, or add a new group. Everything else updates automatically.
export const GROUPS: { name: string; words: Row[] }[] = [
  { name: "Environment", words: [
    ["mitigate", "verb", "to make something less severe, harmful or painful", "Planting trees can help mitigate the effects of urban heat.", "mitigate the impact, mitigate the risk"],
    ["deplete", "verb", "to reduce the amount of a resource until little is left", "Overfishing continues to deplete stocks in many coastal waters.", "deplete natural resources, depleted reserves"],
    ["sustainable", "adjective", "able to continue over time without damaging the environment", "Governments should invest in sustainable forms of transport.", "sustainable development, sustainable energy"],
    ["emissions", "noun", "gases or substances released into the air", "Carbon emissions from aviation have risen sharply.", "carbon emissions, cut emissions"],
    ["biodiversity", "noun", "the variety of plant and animal life in a particular area", "Deforestation poses a serious threat to biodiversity.", "protect biodiversity, loss of biodiversity"],
    ["degradation", "noun", "the process of something becoming worse in quality or condition", "Land degradation reduces the amount of food farmers can grow.", "environmental degradation, land degradation"],
    ["renewable", "adjective", "naturally replaced, so it will not run out", "Solar and wind are the most widely used renewable energy sources.", "renewable energy, renewable resources"],
    ["conservation", "noun", "the protection of natural environments, plants and animals", "Wildlife conservation projects often rely on tourism income.", "wildlife conservation, conservation efforts"],
  ]},
  { name: "Education", words: [
    ["curriculum", "noun", "the subjects included in a course of study", "Many argue that coding should be part of the school curriculum.", "national curriculum, part of the curriculum"],
    ["literacy", "noun", "the ability to read and write", "Adult literacy rates have improved considerably in recent decades.", "literacy rate, digital literacy"],
    ["tuition", "noun", "teaching, or the money paid for it", "Rising tuition fees may discourage students from lower-income families.", "tuition fees, private tuition"],
    ["vocational", "adjective", "relating to the skills needed for a particular job or trade", "Vocational courses prepare students for trades such as plumbing.", "vocational training, vocational qualifications"],
    ["rote learning", "phrase", "memorising information by repetition rather than understanding", "Critics claim that rote learning does little to develop critical thinking.", "rely on rote learning"],
    ["compulsory", "adjective", "required by law or a rule", "In some countries, military service is compulsory for young adults.", "compulsory education, compulsory subject"],
    ["extracurricular", "adjective", "done outside the normal timetable of classes", "Extracurricular activities help children build teamwork skills.", "extracurricular activities"],
    ["tertiary", "adjective", "relating to education at university or college level", "Access to tertiary education has expanded in many countries.", "tertiary education, tertiary institutions"],
  ]},
  { name: "Technology", words: [
    ["innovation", "noun", "a new idea, method or product", "Innovation in healthcare has extended millions of lives.", "technological innovation, drive innovation"],
    ["obsolete", "adjective", "no longer used because something newer exists", "Many traditional jobs may become obsolete as machines improve.", "become obsolete, render something obsolete"],
    ["automation", "noun", "the use of machines or computers to do work previously done by people", "Automation has reduced the need for manual labour in factories.", "workplace automation, increased automation"],
    ["breakthrough", "noun", "an important discovery or development", "The vaccine was hailed as a major medical breakthrough.", "major breakthrough, scientific breakthrough"],
    ["cutting-edge", "adjective", "the most advanced at the present time", "The university invests heavily in cutting-edge research.", "cutting-edge technology, cutting-edge research"],
    ["surveillance", "noun", "the careful watching of people, often by the authorities", "The growth of online surveillance raises concerns about privacy.", "mass surveillance, surveillance cameras"],
    ["digital divide", "phrase", "the gap between people who have access to modern technology and those who do not", "The digital divide leaves rural communities at a disadvantage.", "bridge the digital divide"],
    ["integrate", "verb", "to combine something so that it becomes part of a larger whole", "Schools are trying to integrate technology into everyday lessons.", "integrate technology into, fully integrated"],
  ]},
  { name: "Health", words: [
    ["sedentary", "adjective", "involving a lot of sitting and little physical activity", "A sedentary lifestyle increases the risk of heart disease.", "sedentary lifestyle, sedentary job"],
    ["obesity", "noun", "the condition of being very overweight in a way that harms health", "Childhood obesity has become a major public health concern.", "childhood obesity, obesity rates"],
    ["preventive", "adjective", "intended to stop something bad from happening", "Preventive care is usually cheaper than treating illness later.", "preventive measures, preventive care"],
    ["epidemic", "noun", "a rapid spread of a disease among many people in one area", "Health officials acted quickly to contain the epidemic.", "contain an epidemic, obesity epidemic"],
    ["well-being", "noun", "the state of being healthy, comfortable and happy", "Regular exercise benefits both physical and mental well-being.", "mental well-being, sense of well-being"],
    ["nutritious", "adjective", "containing substances that help the body grow and stay healthy", "Schools should provide nutritious meals at an affordable price.", "nutritious food, nutritious diet"],
    ["life expectancy", "phrase", "the average number of years a person is expected to live", "Life expectancy has risen steadily thanks to better sanitation.", "increase life expectancy, average life expectancy"],
    ["chronic", "adjective", "lasting for a long time or happening again and again", "Chronic stress can weaken the immune system over time.", "chronic illness, chronic shortage"],
  ]},
  { name: "Work and economy", words: [
    ["unemployment", "noun", "the state of not having a paid job", "Youth unemployment remains high in many developing economies.", "youth unemployment, unemployment rate"],
    ["incentive", "noun", "something that encourages a person to do something", "Tax breaks act as an incentive for companies to hire graduates.", "financial incentive, provide an incentive"],
    ["workforce", "noun", "all the people who work in a company, industry or country", "Remote work has changed how companies manage their workforce.", "skilled workforce, enter the workforce"],
    ["productivity", "noun", "the rate at which work or goods are produced", "Flexible hours may boost productivity rather than reduce it.", "boost productivity, labour productivity"],
    ["commute", "noun", "a regular journey between home and work", "A long daily commute can leave workers exhausted.", "daily commute, long commute"],
    ["lucrative", "adjective", "producing a large amount of money", "Software development has become a lucrative career path.", "lucrative career, lucrative market"],
    ["recession", "noun", "a period when a country's economy shrinks", "Many small businesses closed during the recession.", "economic recession, enter a recession"],
    ["entrepreneur", "noun", "a person who starts a business and takes financial risks", "Access to affordable loans helps a young entrepreneur get started.", "young entrepreneur, successful entrepreneur"],
  ]},
  { name: "Society and government", words: [
    ["infrastructure", "noun", "the basic systems a country needs, such as roads, power and water supply", "Poor infrastructure slows down economic growth.", "transport infrastructure, invest in infrastructure"],
    ["legislation", "noun", "a law or set of laws made by a government", "New legislation bans single-use plastic bags in several cities.", "introduce legislation, strict legislation"],
    ["inequality", "noun", "an unfair difference between groups in wealth, rights or opportunities", "Income inequality can undermine social cohesion.", "income inequality, gender inequality"],
    ["allocate", "verb", "to officially give something for a particular purpose", "The council plans to allocate more funds to public libraries.", "allocate funds, allocate resources"],
    ["urbanisation", "noun", "the movement of people from rural areas into cities", "Rapid urbanisation has put pressure on housing and transport.", "rapid urbanisation"],
    ["affluent", "adjective", "wealthy; having plenty of money", "Affluent households tend to produce more waste per person.", "affluent families, affluent areas"],
    ["welfare", "noun", "health and happiness; also help given by the state to people in need", "The welfare of elderly citizens should be a priority for the state.", "social welfare, animal welfare"],
    ["enforce", "verb", "to make sure a law or rule is obeyed", "Police struggle to enforce speed limits on rural roads.", "enforce the law, strictly enforced"],
  ]},
  { name: "Describing trends (Task 1)", words: [
    ["fluctuate", "verb", "to rise and fall irregularly", "Sales tended to fluctuate between 200 and 300 units per month.", "fluctuate wildly, fluctuate between X and Y"],
    ["plummet", "verb", "to fall very quickly and suddenly", "Coal consumption began to plummet after 2010.", "plummet to a low of"],
    ["surge", "noun", "a sudden, large increase", "There was a surge in online shopping during the holiday period.", "a surge in demand, a sharp surge"],
    ["plateau", "noun", "a period when a figure stays at the same level after rising", "Visitor numbers reached a plateau in the final three years.", "reach a plateau"],
    ["steadily", "adverb", "gradually and evenly", "The figure rose steadily throughout the decade.", "rise steadily, decline steadily"],
    ["marginally", "adverb", "by a very small amount", "Exports were marginally higher in 2020 than in 2019.", "marginally higher, marginally lower"],
    ["peak", "noun", "the highest point or level", "Electricity demand hit a peak at around 6 p.m.", "reach a peak, hit a peak of"],
    ["proportion", "noun", "a part or share of a whole, often given as a percentage", "The proportion of students studying abroad doubled over the period.", "a large proportion of, the proportion of"],
  ]},
  { name: "Linking and cohesion", words: [
    ["nevertheless", "linker", "despite what has just been said", "The plan is expensive; nevertheless, it may save money in the long run.", "...; nevertheless, ..."],
    ["consequently", "linker", "as a result", "Fuel prices rose; consequently, more people switched to public transport.", "...; consequently, ..."],
    ["whereas", "linker", "used to compare two facts that are different", "City dwellers rely on public transport, whereas rural residents mostly drive.", "X, whereas Y"],
    ["furthermore", "linker", "in addition; used to add a further point", "Furthermore, online courses allow learners to study at their own pace.", "Furthermore, ..."],
    ["albeit", "linker", "although; introduces something that limits what was just said", "The economy recovered, albeit more slowly than expected.", "albeit slowly, albeit briefly"],
    ["thereby", "linker", "as a result of this action", "Cities can add cycle lanes, thereby reducing traffic congestion.", "..., thereby reducing ..."],
    ["in contrast", "phrase", "used to show a clear difference from what was said before", "In contrast, the number of male applicants fell slightly.", "In contrast, ... / in contrast to"],
    ["to a large extent", "phrase", "mostly; in most respects", "I agree to a large extent that museums should be free.", "agree to a large extent"],
  ]},
];

export const WORDS: Word[] = GROUPS.flatMap((g, gi) =>
  g.words.map(([word, pos, def, ex, col]) => ({ word, pos, def, ex, col, group: g.name, gi }))
);

export function byGroup(value: string): Word[] {
  return value === "all" ? WORDS : WORDS.filter((w) => w.gi === Number(value));
}
