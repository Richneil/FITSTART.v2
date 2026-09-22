# FitStart SAW Scoring Update

## What changed
The previous raw additive point engine was replaced with **Simple Additive Weighting (SAW)** for Main Focus and Top Priority ranking. The FitMao parser, assessment flow, report upload, and result-page structure remain intact.

## Alternatives
The alternatives are the available FitMao metrics:
- Body Fat %
- Skeletal Muscle Mass
- Visceral Fat Level
- Body Water
- Basal Metabolic Rate (BMR)
- BMI

Only metrics actually present in the confirmed FitMao report are ranked.

## Criteria and current prototype weights
| Criterion | Weight |
| --- | ---: |
| Primary Goal | 0.25 |
| Secondary Goal | 0.05 |
| Activity Style | 0.15 |
| Training Availability | 0.10 |
| Daily Lifestyle | 0.05 |
| Nutrition Pattern | 0.10 |
| Hydration | 0.05 |
| Safety & History | 0.05 |
| FitMao Measurement | 0.20 |
| **Total** | **1.00** |

Each alternative receives a relevance rating from **0 to 4** under each criterion. Ratings are defined in `src/utils/scoreMetrics.js` and mirrored in `server/utils/scoreMetrics.js`.

> Thesis note: these are **prototype weights**. For the final thesis methodology, the criteria, ratings, and weights should be justified through the study's literature review and/or expert validation rather than presented as universally established clinical weights.

## SAW formula
All criteria are treated as benefit criteria because a larger rating means stronger relevance for prioritization.

Normalization:

`r_ij = x_ij / max_i(x_ij)`

Preference score:

`V_i = Σ(w_j × r_ij)`

Where:
- `x_ij` = raw 0–4 relevance rating of metric `i` under criterion `j`
- `r_ij` = normalized relevance rating
- `w_j` = criterion weight
- `V_i` = final SAW preference score

The ranking is:
- Highest `V_i` = Main Focus
- Next two highest `V_i` = Top Priorities
- Remaining metrics = Supporting/other priorities

## FitMao measurement criterion
Every confirmed metric receives a base **rating of 1 within the FitMao Measurement criterion** to represent that it is an available, usable report measurement. This is not the old base score; it is a criterion rating that is normalized inside SAW.

The prototype retains only the two measurement-condition rules that already existed in FitStart rather than inventing new clinical thresholds:
- Visceral Fat Level >= 10 → measurement relevance rating 3 for Visceral Fat
- Body Fat >= 25% → measurement relevance rating 2 for Body Fat

These thresholds should also be validated/documented in the final thesis methodology.

## Legacy results
Stored results created by the old point-based engine are detected when fetched. They are recalculated and re-saved using SAW, while preserving the stored change log.

## Validation performed
`npm test` passes 7/7 tests, including:
- client/server consistency
- no invented missing measurements
- SAW weights sum to 1.00
- old base scores are zero/removed
- final SAW score is within 0–1
- final score equals the sum of criterion contributions
- normalized values stay within 0–1

A full Vite build/lint could not be executed in the container because the uploaded ZIP's bundled `node_modules` lacks the required Linux native Rolldown/Oxlint bindings. On a normal local setup, delete `node_modules`, run `npm install` (or `npm ci`), then run `npm test` and `npm run build`.
