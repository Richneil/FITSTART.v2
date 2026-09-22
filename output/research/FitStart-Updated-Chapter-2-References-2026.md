# Updated Chapter 2 References for FitStart

**Prepared for:** FitStart thesis authors and advisers
**Review date:** 8 September 2026
**Coverage:** Recommended replacements and additions for references [15]–[27]

## Research method and limits

The review used targeted searches for the supplied titles and newer replacements, followed by bibliographic and content verification through PubMed/PMC, official publisher records from Springer Nature, Elsevier, Taylor & Francis, Emerald, JMIR, and MDPI, the ISO standards catalogue, and current first-party product documentation. Preference was given to systematic reviews, methodological papers, standards, and original publisher records. Product pages were used only to verify current features. Research stopped when each required evidence area had at least one recent, directly applicable source and further results were either duplicates or less closely aligned with FitStart. This is a targeted evidence review rather than a registered systematic review, so absence from the selected results must not be treated as proof that no comparable system exists.

## Direct conclusion

The reference list should be revised. Several supplied references are recent but methodologically unrelated to FitStart, while some older references remain necessary because they are original sources. The strongest revised set is built around:

- contextual personalization in eHealth and fitness;
- transparent rule-based decision support;
- health literacy and understandable presentation of numerical results;
- user-facing explanations;
- usability and professional-agreement evaluation;
- QR-code capture; and
- current commercial body-composition systems.

Except for Brooke's original System Usability Scale chapter, the recommended academic and standards sources below were published from 2022 to 2026. Brooke should be retained as an explicitly identified foundational source rather than presented as recent literature.

## Replacement decisions

| Existing reference | Decision | Recommended action |
|---|---|---|
| [15] Rahimi et al., 2018 | Replace conditionally | Use the 2024 TAM review only if technology acceptance is actually measured. Otherwise, remove TAM from Chapter 2. |
| [16] Papadopoulos et al., 2022 | Keep | Strong support for rule-based architecture, knowledge representation, and evaluation. It does not validate FitStart's particular weights. |
| [17] Reading Turchioe and Mangal, 2024 | Keep | Strong and current support for health literacy, numeracy, graph literacy, plain language, and user testing. |
| [18] Brooke, 1996 | Keep and correct | This is the original SUS source. Add Hertzum's 2026 meta-analysis to show current evidence and the limits of SUS. |
| [19] McHugh, 2012 | Replace or supplement | Use a recent reliability guide and select the statistic only after defining the number of professionals and whether their judgments are nominal, ordinal, numeric, or ranked. |
| [20] Rosenbacke et al., 2024 | Optional | Current but clinician- and AI-focused. Use only to show that explanations can increase, reduce, or fail to change trust. |
| [21] Abbas et al., 2025 | Remove from the core review | It is current but focused on clinical AI, SHAP, LIME, Grad-CAM, and predictive systems. It does not support FitStart's deterministic method. |
| [22] Vani et al., 2025 | Remove | It is a deep-learning ICU prediction study using MIMIC-III and SHAP, not a fitness-assessment interpretation study. |
| [23] Sobreiro et al., 2021 | Remove unless retention is studied | It predicts fitness-centre dropout from attendance and membership records. It does not study assessment interpretation. |
| [24] Sperandei et al., 2016 | Remove | It is outside the five-year window and concerns attrition, not interpretation or prioritization. |
| [25] InBody App | Keep under Related Systems | Use only as official evidence of product features, not proof of effectiveness. |
| [26] Garmin Connect+ | Replace or make optional | It is current but mainly a wearable and training dashboard. TANITA App Universe is a closer body-composition comparison. |
| [27] Withings/Health Mate | Update | Change the product name to Withings App and use the current page title and 2025 update date. |

## Recommended recent scholarly sources

The numbering below is provisional. Renumber the complete thesis only after the final list is approved.

### Technology acceptance — include only if measured

**[A1]** G. Tetik, S. Türkeli, S. Pinar, and M. Tarım, “Health information systems with technology acceptance model approach: A systematic review,” *International Journal of Medical Informatics*, vol. 190, Art. no. 105556, 2024, doi: [10.1016/j.ijmedinf.2024.105556](https://doi.org/10.1016/j.ijmedinf.2024.105556).

**Appropriate use:** Support a TAM-based evaluation of perceived usefulness, perceived ease of use, or intention to use. Do not use it as general evidence that FitStart is usable.

### Rule-based decision support

**[A2]** P. Papadopoulos, M. Soflano, Y. Chaudy, W. Adejo, and T. M. Connolly, “A systematic review of technologies and standards used in the development of rule-based clinical decision support systems,” *Health and Technology*, vol. 12, pp. 713–727, 2022, doi: [10.1007/s12553-022-00672-9](https://doi.org/10.1007/s12553-022-00672-9).

**Appropriate use:** Support structured records, knowledge bases, deterministic IF–THEN rules, and rule-engine architecture. The review found weak evaluation in much of the CDSS literature, so it should not be cited as proof that FitStart's exact weights are correct.

### Health literacy and presentation of assessment results

**[A3]** M. Reading Turchioe and S. Mangal, “Health literacy, numeracy, graph literacy, and digital literacy: An overview of definitions, evaluation methods, and best practices,” *European Journal of Cardiovascular Nursing*, vol. 23, no. 4, pp. 423–428, 2024, doi: [10.1093/eurjcn/zvad085](https://doi.org/10.1093/eurjcn/zvad085).

**Appropriate use:** Support plain language, familiar wording, careful visualization, universal literacy precautions, and testing electronic information with intended users.

**[A4]** F. A. M. van der Mee, F. Schaper, J. Jansen, J. A. P. Bons, S. J. R. Meex, and J. W. L. Cals, “Enhancing patient understanding of laboratory test results: Systematic review of presentation formats and their impact on perception, decision, action, and memory,” *Journal of Medical Internet Research*, vol. 26, Art. no. e53993, 2024, doi: [10.2196/53993](https://doi.org/10.2196/53993).

**Appropriate use:** This is a strong analogue for FitStart. It supports the claim that presentation format affects how non-experts process numerical test results. It does not directly study FitMao or body composition.

**[A5]** S.-H. Kim, “A systematic review on visualizations for self-generated health data for daily activities,” *International Journal of Environmental Research and Public Health*, vol. 19, no. 18, Art. no. 11166, 2022, doi: [10.3390/ijerph191811166](https://doi.org/10.3390/ijerph191811166).

**Appropriate use:** Support the design and evaluation of understandable, non-clinical personal-health visualizations and the need to consider users' visualization literacy.

### Personalization and fitness context

**[A6]** I. ten Klooster, H. Kip, L. van Gemert-Pijnen, R. Crutzen, and S. Kelders, “A systematic review on eHealth technology personalization approaches,” *iScience*, vol. 27, no. 9, Art. no. 110771, 2024, doi: [10.1016/j.isci.2024.110771](https://doi.org/10.1016/j.isci.2024.110771).

**Appropriate use:** Strong support for collecting characteristics such as behavior, demographics, preferences, context, and questionnaire responses and computationally matching them to system adaptations. The review covered 412 reports and identified multiple personalization approaches; it does not validate FitStart's individual rules.

**[A7]** P. Venkatachalam and S. Ray, “How do context-aware artificial intelligence algorithms used in fitness recommender systems? A literature review and research agenda,” *International Journal of Information Management Data Insights*, vol. 2, no. 2, Art. no. 100139, 2022, doi: [10.1016/j.jjimei.2022.100139](https://doi.org/10.1016/j.jjimei.2022.100139).

**Appropriate use:** Support the role of goals, preferences, user category, ability, location, time, activity conditions, and other contextual information in fitness systems. Use it as related fitness-personalization literature, not as evidence that FitStart is an AI system.

### User-facing explanation and transparency

**[A8]** S. Laato, M. Tiainen, A. K. M. Najmul Islam, and M. Mäntymäki, “How to explain AI systems to end users: A systematic literature review and research agenda,” *Internet Research*, vol. 32, no. 7, pp. 1–31, 2022, doi: [10.1108/INTR-08-2021-0600](https://doi.org/10.1108/INTR-08-2021-0600).

**Appropriate use:** Support on-demand explanations, concentrating on important system functions, and tailoring explanation detail to non-technical users. The principles are transferable to FitStart, but the reviewed systems are primarily AI-based.

**[A9]** A. K. M. B. Haque, A. K. M. N. Islam, and P. Mikalef, “Explainable artificial intelligence from a user perspective: A synthesis of prior literature and problematizing avenues for future research,” *Technological Forecasting and Social Change*, vol. 186, Art. no. 122120, 2023, doi: [10.1016/j.techfore.2022.122120](https://doi.org/10.1016/j.techfore.2022.122120).

**Appropriate use:** Support the evaluation of explanation format, completeness, accuracy, currency, understandability, transparency, and usability from the end user's perspective. Again, FitStart should still be described as deterministic and rule-based, not as machine learning or XAI.

**[A10]** R. Rosenbacke, Å. Melhus, M. McKee, and D. Stuckler, “How explainable artificial intelligence can increase or decrease clinicians' trust in AI applications in health care: Systematic review,” *JMIR AI*, vol. 3, Art. no. e53207, 2024, doi: [10.2196/53207](https://doi.org/10.2196/53207).

**Appropriate use:** Use only as a caution: explanations do not automatically create appropriate trust. The review included only 10 empirical studies and focused on clinicians, so it cannot directly establish what newly registered gym members will understand.

### Usability evaluation

**Foundational source that should remain:**

**[A11]** J. Brooke, “SUS: A ‘quick and dirty’ usability scale,” in *Usability Evaluation in Industry*, P. W. Jordan, B. Thomas, B. A. Weerdmeester, and I. L. McClelland, Eds. London, U.K.: Taylor & Francis, 1996, pp. 189–194.

**Recent supporting source:**

**[A12]** M. Hertzum, “System Usability Scale: A meta-analysis of how SUS relates to workload, task time, and error rate,” *International Journal of Human–Computer Interaction*, early access, Feb. 2026, doi: [10.1080/10447318.2026.2625260](https://doi.org/10.1080/10447318.2026.2625260).

**Appropriate use:** Cite Brooke for the original instrument and Hertzum for current evidence. Hertzum's meta-analysis of 105 studies found that SUS supplies information beyond task time and error rate. Therefore, FitStart should measure task success, interpretation accuracy, or comprehension separately rather than treating SUS as a complete evaluation.

### Professional-agreement evaluation

**[A13]** M. Alavi, E. Biros, and M. Cleary, “A primer of inter-rater reliability in clinical measurement studies: Pros and pitfalls,” *Journal of Clinical Nursing*, vol. 31, nos. 23–24, pp. e39–e42, 2022, doi: [10.1111/jocn.16514](https://doi.org/10.1111/jocn.16514).

**[A14]** A. Benomar, E. Zarour, L. Létourneau-Guillon, and J. Raymond, “Measuring interrater reliability,” *Radiology*, vol. 309, no. 3, Art. no. e230492, 2023, doi: [10.1148/radiol.230492](https://doi.org/10.1148/radiol.230492).

**Appropriate use:** Use these to justify choosing an agreement statistic based on the response type and number of evaluators. Cohen's kappa is not automatically correct. For example, multiple professionals ranking the same FitStart metrics require a rank-agreement method; multiple categorical selections require a multi-rater categorical method. Raw agreement and confidence intervals should also be reported.

## Technical standard for FitStart's QR input

**[A15]** ISO/IEC 18004:2024, *Information Technology—Automatic Identification and Data Capture Techniques—QR Code Bar Code Symbology Specification*, 4th ed., Aug. 2024. [Online]. Available: [ISO](https://www.iso.org/standard/83389.html).

**Appropriate use:** Support the technical basis of decoding FitMao QR codes through live QR scanning and uploaded images containing a QR code. The standard specifies QR encoding, symbol formats, error correction, quality requirements, and reference decoding. It does not establish that FitStart correctly extracts every FitMao report; that requires separate functional testing using representative QR images.

## Current related-system sources

These references belong under **Related and Existing Systems**, not under peer-reviewed related literature.

**[S1]** InBody USA, “InBody App.” [Online]. Available: [https://inbodyusa.com/inbody-app/](https://inbodyusa.com/inbody-app/). [Accessed: Sep. 8, 2026].

The current page documents result-sheet breakdowns, test-history comparison, trends, personalized insights, and diet or exercise features. This means FitStart should not claim that competing systems only display raw measurements.

**[S2]** TANITA Europe, “TANITA App Universe.” [Online]. Available: [https://tanita.eu/tanita-app-universe](https://tanita.eu/tanita-app-universe). [Accessed: Sep. 8, 2026].

This is a stronger comparator than Garmin. TANITA documents body-composition capture, interpretation, saving, analysis, goal tracking, QR sharing, member access, and branded PDF reports. FitStart's distinction therefore needs to focus on its explicit deterministic ranking and member-facing scoring trace—not simply storage, comparison, QR access, or PDF export.

**[S3]** Withings, “Why is Withings app the most advanced health management app?,” Feb. 4, 2021, updated Oct. 13, 2025. [Online]. Available: [Withings](https://www.withings.com/us/en/blog/heart/why-is-health-mate-the-most-advanced-health-management-app). [Accessed: Sep. 8, 2026].

The current page describes body-composition measurements, long-term storage, reports, goals, tailored insights, and result interpretation. Refer to the product as **Withings App**, not Health Mate.

**Optional only:** Garmin Connect+ may remain in a broader system comparison, but it is primarily a wearable, training, nutrition, and performance-analysis platform. It is not as close to FitStart as InBody, TANITA, or Withings.

## Recommended Chapter 2 evidence structure

1. **Body-composition assessment and BIA limitations:** Establish that measurements are estimates and that FitStart interprets the provided values without medically validating or correcting them.
2. **Understanding numerical assessment information:** Use [A3]–[A5] to explain why raw values and numerous metrics can be difficult for non-experts.
3. **Contextual personalization:** Use [A6] and [A7] to explain how goals, preferences, behavior, lifestyle, and other contextual variables can influence system adaptations.
4. **Transparent rule-based processing:** Use [A2] to support the architecture, while documenting and separately validating every FitStart rule and weight.
5. **User-facing explanations:** Use [A8]–[A10] to support concise, on-demand, non-technical explanations and to avoid claiming that explanations automatically produce trust or understanding.
6. **System evaluation:** Use [A11]–[A14], while measuring usability, comprehension, perceived relevance, usefulness, and expert agreement as separate outcomes.
7. **QR-based assessment input:** Use [A15] for the QR standard and report FitStart-specific scanning and uploaded-image test results in Chapter 3 or 4.
8. **Existing systems:** Compare FitStart with [S1]–[S3] using current official documentation, clearly identifying these materials as vendor sources.

## Claims to avoid

- “No existing system interprets body-composition data.” Current InBody, TANITA, and Withings materials contradict this broad statement.
- “Personalization has been proven to make FitStart more effective.” The cited personalization literature does not evaluate FitStart.
- “Rule-based systems prove that FitStart's priorities are correct.” Architecture evidence and rule validity are different issues.
- “SUS measures usefulness and comprehension.” SUS measures perceived usability.
- “Explanations automatically increase trust.” Recent evidence shows mixed effects.
- “QR scanning guarantees correct FitMao data.” The QR standard defines the symbology; FitStart still needs extraction and verification tests.
- “FitStart is the first system to combine these features.” A narrative review cannot establish a universal first-of-its-kind claim.

## Defensible research-gap wording

> The reviewed literature and commercial systems demonstrate different approaches to body-composition tracking, personal-health visualization, contextual personalization, and decision support. However, within the studies and publicly available systems reviewed, the researchers did not identify the same combination implemented by FitStart: QR- or uploaded-image capture of FitMao assessment data, member verification of the captured measurements, deterministic metric-level prioritization using assessment values and questionnaire context, and a user-facing trace explaining how specific inputs affected the Main Focus and Top Priorities. This conclusion is limited to the literature and systems examined and does not claim that no comparable system exists elsewhere.

## Final recommendation

Use [A2]–[A9] as the main Chapter 2 foundation. Retain Brooke and add Hertzum for the usability method. Select either [A13] or [A14] after the professional-rating design is finalized. Add [A15] because QR scanning and uploaded QR images are central FitStart inputs. Use [S1]–[S3] only for the commercial feature comparison.

The revised list is recent and better aligned with FitStart, but recency should not replace methodological fit. A 2025 clinical deep-learning paper is less useful than a 2022 systematic review that directly addresses context-aware fitness systems or user-facing explanations.
