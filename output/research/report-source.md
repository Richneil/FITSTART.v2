# FitStart Chapter 2 Deep-Research Source Report

**Audience:** FitStart thesis authors and advisers  
**Date:** 8 September 2026  
**Source document:** `C:/Users/Richneil Ocampo/Downloads/FITSTART.pdf`  
**Scope:** Chapter 2 (pp. 21–30), reference list (pp. 33–38), and cross-chapter citation integrity where it affects the shared bibliography.

## Research question

Are Chapter 2's literature review, published-work summaries, related-system comparison, synthesis, and references accurate, sufficiently supported, current, and aligned with the implemented FitStart system?

## Executive answer

Chapter 2 requires **major targeted revision**, not complete replacement. Its four-part structure and central problem—helping non-expert gym members understand and prioritize body-composition results—are defensible. However, the present synthesis overstates what several sources establish, the commercial comparison is already outdated or incomplete, the paper's broad novelty claim is not supported by a reproducible search, and the proposed expert-agreement statistic is not yet matched to the study design.

The most serious evidence problems are:

1. Sobreiro et al. and Sperandei et al. establish high fitness-centre dropout and associated predictors, but they do not study assessment-result interpretation or show that an early experience with fitness data causes later engagement.
2. Current official InBody, Withings, and FitMao materials describe personalized insights, goal-linked guidance, body-composition interpretation, or exercise/nutrition recommendations. FitStart can still claim a narrower distinction—transparent deterministic metric ranking with a traceable member-facing explanation—but not an unqualified absence of interpretation or personalization in the market.
3. Pescatello et al. and Papadopoulos et al. support rule-based decision-support architecture, not FitStart's particular scores, thresholds, or weights. Those require a documented evidence or expert-elicitation trail and validation.
4. Cohen's kappa is inappropriate if more than two professionals rank several metrics. The method must match the number of raters and data type; Kendall's W is suited to multiple rankings, while Fleiss-type kappa applies to multiple nominal classifications.
5. Chapter 1 contains multiple stale numeric citations that now point to unrelated entries in the common reference list. This makes the paper unreliable even though Chapter 2's numbering is mostly internally consistent.

## Scope and assumptions

- This is an evidence audit, not a formal systematic review. Searches targeted exact cited works, original publisher records, PubMed/PMC, official vendor documentation, and close replacement literature.
- Commercial-product claims are treated as vendor-reported functionality, not independent proof of effectiveness.
- A failure to locate a paper is not proof that none exists. Novelty conclusions must therefore be framed as applying to the studies and systems reviewed.
- Current implementation was checked against `src/data/parqTemplate.js`, `src/utils/scoreMetrics.js`, and `src/components/Results/ResultsView.jsx`.

## Claim-to-source ledger

| Claim under review | Evidence | Conclusion | Confidence |
|---|---|---|---|
| BIA estimates vary by device/method/conditions | Ward 2019; Holmes & Racette 2021 | Supported generally; does not validate FitMao specifically | High |
| Numeric health-result presentation affects understanding | van der Mee et al. 2024; Turchioe et al. 2019 | Supported as transferable patient-facing evidence, not direct FitMao evidence | High |
| Personalization is more effective than generic information | Neville et al. 2009; Ghanvatkar et al. 2019; Zhao et al. 2020 | Overbroad. Neville found inconclusive evidence; Zhao is a small 60-day fitness recommender study | High |
| Szymanski et al. proved specific explanation practices improve comprehension | Szymanski et al. 2022 | Overstated. Small qualitative study (n=11); it revealed preferences and common misunderstandings | High |
| Rule-based literature validates weighted explainable scoring | Papadopoulos et al. 2022; Pescatello et al. 2021 | Architecture supported; FitStart's actual weights/thresholds are not validated by these sources | High |
| Early experience with fitness data affects retention | Sobreiro et al. 2021; Sperandei et al. 2016 | Unsupported; neither study tests fitness-data interpretation or causal retention effects | High |
| No commercial product offers relevant personalization/interpretation | InBody, Withings, Garmin, FitMao official pages | Contradicted in broad form; multiple products now offer overlapping functions | High for documented features, medium for comparative novelty |
| FitStart's exact combination remains distinct | Selected system documentation | Defensible only as a qualified statement about transparent deterministic metric ranking and traceable explanations among reviewed systems | Medium |
| Cohen's kappa is the correct expert-validation statistic | McHugh 2012 | Only if exactly two raters assign nominal categories; likely wrong for several raters ranking metrics | High |
| Current system collects experience and broad activities/interests | FitStart source code | Not accurate. It collects safety, goals, one activity style, schedule/lifestyle, nutrition/hydration, barriers, and guidance preference | High |
| Current user-facing result includes First Steps/Quick Wins/Explore For You | FitStart source code/UI | Not implemented in the displayed results. Backend still computes quickWins/firstSteps, but ResultsView does not render them; no Explore For You module was found | High |

## Reference audit summary

- **Keep with minor or no change:** [1], [2], [4], [5], [7], [8], [9], [11], [14], [17], [20], [23], [24]. Their prose use still needs the limitations stated in the final report.
- **Keep but substantially rewrite the claim:** [3], [6], [10], [12], [16], [21], [25], [26], [27].
- **Remove unless the corresponding construct is actually measured:** [15] Technology Acceptance Model.
- **Correct bibliographic form:** [18] SUS chapter; [19] add DOI; [25] separate InBody App from InBody+; [27] update title/product name.
- **Replace or make clearly peripheral:** [22] Vani et al. It is an ICU predictive-AI paper that does not test comprehension, usability, trust, or body-composition interpretation.

## High-priority additional sources

1. Ling et al. 2011, DSM-BIA vs DXA: https://doi.org/10.1016/j.clnu.2011.04.001
2. Turchioe et al. 2019, patient-facing health-data visualizations: https://doi.org/10.1055/s-0039-1697592
3. Zikmund-Fisher et al. 2014, numeracy/literacy and out-of-range test results: https://doi.org/10.2196/jmir.3241
4. Warburton et al. 2021, official PAR-Q+: https://doi.org/10.14288/hfjc.v14i1.351
5. Lewis 2018, SUS interpretation/psychometrics: https://doi.org/10.1080/10447318.2018.1455307
6. Wright et al. 2018, preventing rule-based decision-support malfunctions: https://doi.org/10.1016/j.ijmedinf.2018.08.001
7. Lugones-Sanchez et al. 2020, EVIDENT 3 mHealth/body-composition trial: https://doi.org/10.2196/21771

## Limitations

- The commercial audit covers the systems selected by the paper plus the current official pages found for those systems; it is not an exhaustive market study.
- Product features may vary by region, subscription, device, and app version.
- No peer-reviewed validation study specific to FitMao-280H was found in targeted searches. This should be presented as an evidence gap, not as proof that none exists.
- Recommendations about statistics remain conditional on the final number of experts, task design, and response scale.

## Recommended conclusion

Major revision is required before adviser/panel submission. The thesis does not need a new topic or a total Chapter 2 rewrite. It needs narrower claims, source-accurate summaries, a current competitor matrix, explicit system alignment, a defensible rule/weight validation trail, and an agreement analysis matched to the expert task.

