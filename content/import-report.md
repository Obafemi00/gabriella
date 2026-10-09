# IELTS word list import report

Source: `design-handoff/project/content/IELTS_1000_Word_Vocabulary_Workbook.pdf` (55 pages).
Extracted to `content/words-import.csv` (columns: word, section, pdf_meaning, pdf_collocation).
Nothing in the app has been changed.

## Counts

| | Words |
|---|---:|
| Total in the PDF | 1000 |
| Real meanings | 65 |
| Placeholder meanings (“a useful IELTS term related to …”) | 935 |
| Real collocations | 19 |
| Placeholder collocations (“… + relevant noun/verb”) | 981 |
| Exact duplicates inside the PDF | 0 |
| Same-word duplicates inside the PDF (one of each pair removed, see below) | 9 |
| **Words left after removing duplicates** | **991** |
| Of those, already in `lib/words.ts` (exact spelling) | 41 |
| Words left after also removing those already in the app | 950 |
| Words left after also removing the basic words listed below | 831 |

Notes on the counts:
- “Duplicates” means the same word in another form with the same meaning (for example *accurate* / *accurately*). Word families with different meanings or word classes (*economy* / *economic*) are listed separately and are **not** removed from the counts.
- Near forms of app words (for example *emission* for the app's *emissions*) are listed below but not subtracted. Removing them too would take off up to 14 more.
- Only 65 of the 1,000 meanings are real, so roughly 935 words need a meaning, example and collocations written before they can go into the app. The PDF example sentences are all the template “The issue of X is increasingly discussed in &lt;section&gt;” and were ignored.

### Words per section

| Section | Words | Real meanings |
|---|---:|---:|
| Education | 50 | 9 |
| Environment | 50 | 1 |
| Technology | 49 | 0 |
| Health | 50 | 0 |
| Society | 49 | 0 |
| Government & Politics | 48 | 2 |
| Economy & Business | 48 | 0 |
| Crime & Law | 45 | 0 |
| Transport | 46 | 0 |
| Cities & Housing | 45 | 0 |
| Work & Career | 39 | 0 |
| Media & Communication | 46 | 0 |
| Culture & Arts | 41 | 0 |
| Travel & Tourism | 40 | 0 |
| Science & Research | 41 | 1 |
| Food & Agriculture | 39 | 0 |
| Family & Children | 36 | 0 |
| Globalisation & International Issues | 32 | 1 |
| IELTS Academic Core | 55 | 37 |
| High-Value General Vocabulary | 39 | 14 |
| Additional Academic Vocabulary | 112 | 0 |

## 1. Words already in lib/words.ts

**Exact matches (41 of the app's 64 words):** affluent, albeit, allocate, automation, biodiversity, breakthrough, chronic, commute, consequently, conservation, curriculum, enforce, entrepreneur, epidemic, extracurricular, fluctuate, furthermore, inequality, infrastructure, innovation, integrate, legislation, literacy, mitigate, nevertheless, obesity, productivity, proportion, recession, renewable, sedentary, surveillance, sustainable, tuition, unemployment, urbanisation, vocational, welfare, well-being, whereas, workforce.

**Near forms and related entries (14):**

| In the app | In the PDF | Note |
|---|---|---|
| emissions | emission | PDF also has “carbon emission” (Transport) |
| degradation | degrade |  |
| deplete | depletion |  |
| marginally | marginal |  |
| preventive | prevention |  |
| nutritious | nutrition | PDF also has “malnutrition” |
| commute | commuter | exact “commute” is also in the PDF |
| enforce | enforcement | exact “enforce” is also in the PDF |
| unemployment | unemployed | exact “unemployment” is also in the PDF |
| integrate | integration | exact “integrate” is also in the PDF |
| sustainable | sustainable development | also “sustainable tourism”; exact “sustainable” is in the PDF |
| urbanisation | urban | exact “urbanisation” is also in the PDF |
| peak | peak season | phrase built on the app word |
| digital divide | digital | related only; not the same term |

App words with **no match at all** in the PDF (15): compulsory, cutting-edge, in contrast, incentive, life expectancy, lucrative, obsolete, plateau, plummet, rote learning, steadily, surge, tertiary, thereby, to a large extent.

## 2. Duplicates and near-duplicates inside the PDF

No word appears twice with the same spelling.

**Same word or same meaning — keep one (9 pairs):**

| Keep | Drop | Why |
|---|---|---|
| decline | declining | noun/verb vs -ing form (both IELTS Academic Core / Additional) |
| adequate | adequately | adjective vs adverb |
| accurate | accurately | adjective vs adverb; “accuracy” is also listed |
| consistent | consistently | adjective vs adverb |
| considerable | considerably | adjective vs adverb |
| broadcast | broadcasting | verb/noun vs -ing noun |
| overcrowded | overcrowding | adjective vs noun for the same idea; “crowded” is also listed |
| transport | transportation | same meaning (Travel & Tourism vs Transport) |
| rail | railway | same meaning, both in Transport |

**Word families — different word class or meaning, probably keep both (70 groups).** Worth a look so the app doesn't teach near-identical cards back to back:

- educate / education / educational
- adapt / adaptation / adaptability
- research / researcher / research-based
- industrial / industrialisation
- scarce / scarcity
- urban / urbanisation
- digital / digitalisation
- emerge / emerging / emerging economy
- technology / technological
- advanced / advancement
- modern / modernise
- immune / immunity
- medical / medication
- nutrition / malnutrition
- culture / cultural / cultural exchange / cultural tourism
- diverse / diversity
- integrate / integration
- social / societal / socialisation / social media
- global / globalisation
- enforce / enforcement
- municipal / municipality
- consume / consumer / consumption
- employment / employee / employer / unemployed / unemployment
- commute / commuter
- driver / driving
- development / developing / developed / sustainable development
- profession / professional
- valid / validity
- agriculture / agricultural
- farmer / farming / organic farming / industrial farming
- parent / parenting / parental / single-parent
- economy / economic
- finance / financial
- crime / criminal / cybercrime
- offence / offender
- prosecute / prosecution
- violence / domestic violence
- journalism / journalist
- evaluate / evaluation
- investigate / investigation
- concentrate / concentration
- clarify / clarification
- reluctant / reluctance
- discriminate / discrimination
- cooperate / cooperation
- persist / persistent
- pursue / pursuit
- irrigate / irrigation
- migration / immigration
- motivate / motivation
- specialise / specialist
- prison / imprisonment
- supervisor / supervision
- afford / affordable / affordable housing
- accurate / accuracy
- creative / creativity
- artist / artistic / artwork
- theatre / theatrical
- exhibit / exhibition
- election / electorate
- law / lawyer / legal / illegal
- travel / traveller / travel agency
- tourism / tourist / eco-tourism / sustainable tourism / adventure tourism / cultural tourism
- population / overpopulation / population density
- housing / affordable housing / housing shortage
- community / community centre
- generation / generation gap
- traffic / traffic jam
- artificial / artificial intelligence
- crowded / overcrowded

**Entries that look cut from a longer phrase or are ambiguous on their own:**

- *united*: probably cut from “United Nations”; weak on its own
- *artificial*: listed separately from “artificial intelligence”
- *fossil*: usually “fossil fuels”
- *exhaust*: noun (car exhaust) or verb; needs a clear meaning
- *interest*: economics sense (interest rate) vs everyday sense
- *fine*: legal penalty vs everyday “fine”

## 3. Very basic words that may not suit IELTS practice (120)

These are everyday A1–B1 words that most IELTS candidates already know. They can still be useful as topic words in Speaking, but they add little as Know / Unsure / Don't know cards. This is a judgement call; review before removing.

- **Education:** student, pupil, knowledge, skill, lecture
- **Environment:** waste, flood, plastic, natural, solar, wind power
- **Technology:** internet, online, download, website, smartphone, software, data, update, device
- **Health:** doctor, disease, exercise, virus, stress, fitness, clinic, unhealthy
- **Economy & Business:** business, market, salary, profit, purchase
- **Crime & Law:** crime, police, prison, judge, lawyer, court, arrest, fine, guilty, illegal
- **Transport:** bus, taxi, bicycle, driver, driving, journey, parking, passenger, fuel, rail, railway, subway, station, traffic, traffic jam, accident, rush hour, speed limit, travel
- **Cities & Housing:** apartment, rent, street, town, village, crowded
- **Work & Career:** colleague, interview, full-time, part-time, task, schedule, experience, training
- **Media & Communication:** newspaper, television, reporter, information
- **Culture & Arts:** music, painting, artist, museum, cinema, theatre, novel, style, design, festival
- **Travel & Tourism:** airport, luggage, passport, beach, flight, hostel, tour, tourist, visitor, booking, vacation, guide, souvenir
- **Science & Research:** test, study
- **Food & Agriculture:** meat, vegetable, farmer, fresh, land, wheat
- **Family & Children:** family, parent, teenager, childhood
- **Globalisation & International Issues:** peace, foreign, border, worldwide
- **Additional Academic Vocabulary:** remove

## Words with a real meaning in the PDF (65)

- **Education:** academic, acquire, adapt, assess, attain, broaden, curriculum, evaluate, literacy
- **Environment:** sustainable
- **Government & Politics:** implement, allocate
- **Science & Research:** significant
- **Globalisation & International Issues:** disparity
- **IELTS Academic Core:** coherent, conventional, crucial, diminish, diverse, dramatic, eliminate, enhance, exceed, fluctuate, fundamental, generate, inevitable, indicate, infer, justify, maintain, notable, obtain, overall, predominant, proportion, relevant, subsequent, substantial, undermine, utilise, whereas, advocate, consequently, facilitate, furthermore, nevertheless, albeit, arguably, conversely, respectively
- **High-Value General Vocabulary:** compelling, contribute, controversial, derive, exacerbate, feasible, foster, mitigate, negligible, persist, plausible, retain, rigorous, transform
