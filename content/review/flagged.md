# Flagged words

Words from batches 5–9 that were still uncertain after Claude's second read, and the decision on each (2026-10-09). All words in `content/words-master.csv` are `approved`.

## Changed

| Word | Batch | Reason | Decision |
|---|---:|---|---|
| downtown | 06 | Mainly American English | Replaced with **city centre** |
| real estate | 06 | Mainly American English | Removed |
| roadway | 06 | Mainly American English and rare in IELTS answers | Removed |
| carpool | 06 | American English; listed as a verb, but its collocations used it as a noun | Replaced with **car sharing** (phrase) |
| caregiver | 08 | British English usually says “carer” | Replaced with **carer** |
| package | 07 | Vague on its own; the real travel term is “package holiday” | Replaced with **package holiday** |
| aviation | 05 | The example made an imprecise pollution claim | Example rewritten without the claim |
| agriculture | 08 | The example quoted an approximate statistic | Example rewritten without the statistic |
| processed | 08 | The example stated a sensitive health link | Neutral example (salt and sugar in processed food) |
| misinformation | 07 | The example mentioned vaccines | Example about social media in general |
| emerging economy | 09 | The collocations were weak in the singular | Kept; the example and collocations now use “emerging economies” |
| sensational | 07 | Has two opposite senses | Kept; the definition now gives the media sense only |

## Kept as they are

| Word | Batch | Reason |
|---|---:|---|
| innocent | 05 | “Found innocent” was replaced with “presumed innocent”, because courts actually find people “not guilty”. |
| criterion | 08 | The plural “criteria” is far more common, but the example has to use the singular because of the validator and quiz. |
| phenomenon | 08 | Same issue as “criterion”: the plural “phenomena” cannot be used in the example. |
| objective | 08 | Listed as an adjective, but the noun (“an aim”) is just as common in IELTS writing. |
| elderly | 08 | Some style guides now prefer “older people”; the word is still standard in IELTS materials. |
| developing / developed | 09 | Standard IELTS terms, but some organisations now prefer “low-income” / “high-income” countries. |
| immigration | 09 | Sensitive topic; the example is neutral (collocation “immigration control”). |
| human rights | 09 | The headword is plural, so the common singular “a human right” cannot be used in the example. |
| (quiz forms) | 05–09 | Not a single word: 72 examples use a plural or other form, which `components/Quiz.tsx` blanks only partly (“sources” → “_____s”). 8 are not blanked at all: subsidy, strategy, penalty, amenity, facility, vacancy, emerging economy (y → ies) and investigate (“investigating”). The app code has not been changed. |

## Figures removed from examples (all batches)

Every example was checked for numbers, percentages, statistics and dates. These 32 were rewritten without figures, keeping the same point where possible:

dramatic, respectively, feasible, reveal, accompany, comprise, consecutive, identical, random, applicable, arbitrary, duration, diploma, programming, malnutrition, protest, industry, legal, cybercrime, verdict, vehicle, commuter, terminal, metropolitan, estate, resign, viral, artwork, discovery, sample, estimate, multilateral.

Together with **agriculture** above, no example now contains a figure. The collocations for **respectively** still include “by 10% and 15% respectively”, because only examples were in scope.
