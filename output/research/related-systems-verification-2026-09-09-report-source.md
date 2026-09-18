# FitStart Related and Existing Systems: Verification Report Source

**Research date:** 9 September 2026
**Purpose:** Verify the factual accuracy and relevance of the proposed Section 2.3 before inclusion in the FitStart thesis.

## Scope and method

The review checked the two research systems against their original peer-reviewed publications and checked the commercial systems against current official vendor pages. The FitStart comparison was then checked against the current frontend and server source files. Official product pages were treated as evidence of documented features only; they were not treated as independent proof of accuracy, usability, or effectiveness. Searches stopped after each named system's core features and the proposed comparison claims had been verified from a primary source.

## Direct findings

1. **P3-EX is accurately relevant but should not be called a generic prototype.** It is a research-developed clinical decision-support system that prioritizes cardiovascular risk factors and supports individualized FITT exercise prescriptions. It is clinical and prescriptive, unlike FitStart.
2. **Zhao et al. is accurately described as a personalized fitness recommender.** It uses dynamic player modeling, wearable tracking, personalized activity recommendations, and gamification. It was evaluated with 40 participants over 60 days. It does not interpret a completed body-composition report.
3. **The source device should be identified as FitMao-280, not FitMao-280H, if the report supplied for the study is the one labeled FitMao-280.** The official FitMao-280 page documents DSM-BIA, printed reports, personal records, historical viewing, change curves, and more than 40 reported data items.
4. **The earlier InBody comparison understated the product.** Current official documentation describes personalized insights, result-sheet breakdowns, historical comparison, custom diet and exercise plans, and a seven-question goal workflow used to create a diet guide.
5. **ACCUNIQ Connect is a very close comparison and must not be described as lacking questionnaire-based personalization.** The vendor documents QR transfer, result storage, graphs, a physical-activity preparation questionnaire, management goals, and calorie guidance based on health responses, measurement data, activity level, diet period, and control target.
6. **Evolt Active is also a close but broader system.** Its vendor describes body-scan interpretation, goal tracking, interactive questionnaires, a proprietary wellness score, macronutrient profiles, supplement suggestions, and training and nutrition planning.
7. **seca myAnalytics now explicitly includes optional AI Health Insights.** It provides parameter explanations, history and trends, and an optional personalized AI-generated initial assessment with recommendations. It should not be presented as a non-AI equivalent of FitStart.
8. **A universal originality claim is not defensible.** The appropriate conclusion is limited to the systems reviewed: their public documentation did not show the same complete combination of FitMao-specific input, member verification, deterministic metric-level prioritization, and a visible rule trace for a Main Focus and two additional Top Priorities.

## Recency warning

The two peer-reviewed research systems are outside a strict five-year window as of September 2026. Zhao et al. was published in 2020. Pescatello et al. was published online in 2020 and appeared in the 2021 journal issue. They remain directly relevant original system papers, but they should be retained only if the institution permits older foundational or uniquely relevant sources. The commercial product pages are current, but undated vendor pages should use an access date.

## FitStart implementation cross-check

The current source implements QR scanning, uploaded-image QR decoding, a member review step, deterministic scoring with baseline values and fixed adjustments, Main Focus, Top Priorities, Ask Why, Because You Told Us, full supporting measurements, PDF export, member saving, history, and comparison.

Two current interface strings conflict with the approved paper scope:

- The input screen still displays a separate **Take a Photo** option, even though the approved scope says QR scanning and image upload only.
- The interface still says **For this prototype**, even though FitStart should be described as a system rather than a prototype.

These interface mismatches do not invalidate the related-systems section, but they should be corrected before the final system evaluation or the paper and interface will describe different scopes.

## Verified primary sources

- Pescatello et al.: https://pubmed.ncbi.nlm.nih.gov/33718793/
- Zhao et al.: https://games.jmir.org/2020/4/e19968/
- FitMao-280: https://www.fitmao.com/web/body-composition-analyzer-fitmao-280?lang=en
- InBody App: https://inbodyusa.com/inbody-app/
- InBody goal and diet-guide workflow: https://lbwebfaq.inbodyusa.com/support/solutions/articles/69000804868-how-do-i-set-goals-and-create-diet-guide-from-the-inbody-app
- ACCUNIQ Connect: https://www.accuniq.com/en/product/product_software_ac.php
- Evolt Active: https://evolt.health/evolt-active
- seca myAnalytics: https://www.seca.com/en_nz/products/body-composition-analysis/myanalytics.html

## Recommended conclusion

The proposed set of systems is relevant and substantially stronger than the earlier InBody–Garmin–Withings-only comparison. It covers clinical rule-based decision support, contextual fitness personalization, the source FitMao device, and four close body-composition ecosystems. The section requires major wording corrections, however, because InBody and ACCUNIQ provide more personalization than the earlier draft acknowledged, and seca currently uses AI-based interpretation.
