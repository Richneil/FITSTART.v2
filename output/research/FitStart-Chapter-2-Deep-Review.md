# Deep Review of FitStart Chapter 2 and References

**Reviewed document:** FITSTART.pdf  
**Review date:** 8 September 2026  
**Coverage:** Chapter 2, pp. 21–30; References, pp. 33–38; and citation problems elsewhere that affect the same reference list

## Overall verdict

**Major revision is needed, but Chapter 2 does not need to be discarded.**

The chapter has a sensible structure and a researchable central idea. The problem is not the topic; it is the strength and precision of the evidence. Several summaries are broader than the cited studies allow, two dropout studies are used for a relationship they did not investigate, the comparison with commercial systems is no longer current enough to support the stated marketplace gap, and the proposed expert-agreement statistic may be wrong for the actual validation task.

The safest and strongest position for FitStart is this:

> Among the academic and commercial systems reviewed, FitStart is distinguished by its transparent, deterministic ranking of body-composition metrics and its member-facing explanation of how selected assessment values and survey responses affected each priority.

Avoid claiming that no other current system interprets body-composition data, uses personal context, or provides personalized guidance. Current official documentation from FitMao, InBody, Garmin, and Withings shows overlapping functions.

## What is already strong

- Chapter 2 follows a clear sequence: foundational literature, published studies, existing systems, and synthesis.
- The chapter correctly separates measurement from interpretation. BIA is useful, but its outputs are estimates whose meaning depends on device, population, equation, protocol, and measurement conditions. Ward's review supports the need for standardization and careful interpretation ([PubMed record](https://pubmed.ncbi.nlm.nih.gov/30297760/)).
- The use of health literacy, numeracy, graph literacy, and plain-language presentation is relevant to a non-expert audience.
- The discussion of personalized user models is relevant. Ghanvatkar et al. found that physical-activity interventions model users through activity profiles, demographics, medical data, behavior-change variables, and context ([JMIR article](https://mhealth.jmir.org/2019/1/e11098/)).
- The chapter correctly treats explainability as a design problem rather than a guaranteed benefit. Rosenbacke et al. found that explanations can increase, reduce, or fail to change clinicians' trust depending on their quality and context ([JMIR AI review](https://ai.jmir.org/2024/1/e53207)).
- The visual layout of Chapter 2 and the references is readable and consistent. The main presentation weakness is excessive spacing and one-topic-per-paragraph treatment, which makes the review longer without adding critical synthesis.

## Major revisions required

### 1. Remove the unsupported retention claim

The most serious sentence is in Section 2.4:

> “Studies on gym dropout and activity attrition [23], [24] confirm that a member's early experience with their fitness data has lasting effects on continued engagement.”

That conclusion is not in either study.

- Sobreiro et al. analyzed records from 5,209 members of one Portuguese fitness centre. The strongest predictors concerned non-attendance, membership duration, and billing history—not interpretation of body-composition results ([original article](https://www.mdpi.com/1660-4601/18/19/10465)).
- Sperandei et al. followed 5,240 fitness-centre members and examined attrition in relation to age, previous activity, BMI, and motivation. It also did not test assessment-result explanations or early fitness-data experience ([PubMed record](https://pubmed.ncbi.nlm.nih.gov/26874647/)).

Use these studies only to establish that attrition is common and is related to member and attendance characteristics. A supported replacement is:

> Fitness-centre attrition is common and is associated with factors such as attendance patterns, membership duration, demographic characteristics, previous activity, BMI, and member motivations [23], [24]. These studies show the importance of early member support, but they do not determine whether personalized interpretation of assessment results improves retention.

If retention is not an outcome in the FitStart evaluation, it may be better to remove these two studies from the central synthesis entirely.

### 2. Narrow the research and marketplace gap

The phrases “currently unfilled position,” “unaddressed by the reviewed academic literature,” and “unaddressed by the current commercial marketplace” are too absolute for a narrative review of five systems.

Current official sources show material overlap:

- FitMao's 280H page lists personal health records, change curves, cloud services, and software-provided body-morphology analysis, nutrition recommendations, and exercise prescriptions ([FitMao 280H](https://www.fitmao.com/web/body-composition-analyzer-fitmao-280h?lang=en)). These are vendor claims rather than independent validation, but Chapter 2 cannot describe FitMao as merely displaying raw values without acknowledging them.
- The current InBody App page describes result-sheet breakdowns, test-history comparisons, personalized insights, body goals, and custom diet/exercise plans ([InBody App](https://inbodyusa.com/inbody-app/)).
- Garmin Connect+ offers more than 140 chart templates, customizable comparisons, AI-generated insights, nutrition tracking, and compatible smart-scale body-composition data. It is mainly a longitudinal wearable/training service, but it is not only for athletes ([Garmin performance dashboard](https://www.garmin.com/en-US/blog/fitness/what-is-the-garmin-connect-performance-dashboard/)).
- Withings BodyPath links body composition, activity, sleep, and nutrition habits to a weight goal, highlights contributing factors, and provides AI-enhanced guidance. It is restricted to certain devices, app versions, and Withings+ subscribers, but it is closer to FitStart than the chapter states ([Withings BodyPath](https://support.withings.com/hc/en-us/articles/47323926667153-Withings-App-Health-Tab-BodyPath)).

The defensible gap is not “personalized body-composition interpretation does not exist.” It is the lack, among the selected systems reviewed, of a **documented deterministic scoring trace that ranks individual assessment metrics and explains the member-specific reason for each ranking**.

Recommended wording:

> The reviewed systems provide body-composition tracking, goal setting, visualization, personalized insights, or activity guidance in different forms. However, the official materials reviewed did not document the same combination used by FitStart: a transparent deterministic scoring mechanism that ranks individual body-composition metrics and shows how specific assessment values and member responses contributed to each priority. This conclusion is limited to the selected systems and publicly available documentation reviewed in this study.

### 3. Correct the InBody and Withings descriptions

The InBody paragraph combines features from different products. “FitScore” and “DailyLog” are associated with InBody+ materials, while reference [25] points to the InBody App. Discuss the two apps separately with separate sources, or keep only InBody App and remove features not shown in that source.

Also update “Withings Health Mate” to **Withings App**. Withings confirms that the app was formerly called Health Mate ([current Withings App page](https://www.withings.com/in/en/withings-app)). Reference [27]'s title also appears inaccurate for the page being cited.

### 4. Align Chapter 2 with the implemented FitStart system

The present system code collects:

- seven safety/readiness answers;
- a primary and optional secondary fitness goal;
- one main activity style;
- training availability, preferred session duration, and daily activity style;
- nutrition pattern and water intake; and
- a main barrier and guidance preference.

It does **not** contain a separate fitness-experience question or a broad activities-and-interests profile. Replace “goals, experience, activities, lifestyle, and barriers” with the actual fields above.

The user-facing results screen displays the Main Focus, Top Priorities, per-metric “Ask Why” breakdowns, a “Because You Told Us” explanation, complete assessment metrics, and export/save functions. It does not display **Quick Wins**, **First Steps**, or **Explore For You**. The scoring utility still calculates quick-wins and first-steps objects internally, but the results interface does not render them. A hidden data object should not be described as an implemented user feature.

This mismatch appears elsewhere in the document's definitions and objectives, so Chapter 2 should be corrected together with Chapters 1 and 3.

### 5. Separate architectural support from validation of the scoring rules

References [3] and [16] show that structured personal data can be processed using rule-based decision support:

- Pescatello et al. developed P3-EX, which prioritizes, personalizes, and prescribes exercise for patients with multiple cardiovascular risk factors ([PubMed record](https://pubmed.ncbi.nlm.nih.gov/33718793/)).
- Papadopoulos et al. reviewed architectures, knowledge representations, technologies, and standards used in rule-based clinical decision-support systems ([Springer article](https://doi.org/10.1007/s12553-022-00672-9)).

Neither source validates FitStart's base scores, additions, thresholds, or tie-breaking rules. Chapter 2 should clearly say that these sources support the **choice of rule-based architecture**, while FitStart's actual rules require their own evidence and validation.

For every rule, document:

- the input condition;
- the metric affected;
- the score change;
- the scientific or expert basis;
- the expected interpretation;
- test cases and edge cases; and
- the fitness professionals who reviewed or approved it.

Without this trail, “documented weights” means documented in code, not scientifically justified.

### 6. Fix the planned expert-agreement analysis

Reference [19] correctly explains kappa, but the statistic must match the data.

- Cohen's kappa: two raters, nominal categories.
- Weighted kappa: two raters, ordered categories.
- Fleiss-type kappa: more than two raters assigning nominal categories.
- Kendall's W: multiple judges ranking the same set of metrics.

If fitness professionals rank all FitStart metrics, use Kendall's W or another rank-agreement analysis, not ordinary Cohen's kappa. If each expert only selects one Main Focus, use a multi-rater nominal agreement method. Report raw agreement and confidence intervals as well. McHugh's paper itself notes that Cohen's kappa was developed for two raters and has interpretation limits ([full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3900052/)).

This is partly a Chapter 3 issue, but Chapter 2 currently presents kappa as if it were already the correct method.

### 7. Correct the common reference numbering before submission

Chapter 2's numeric citations are mostly internally consistent, but Chapter 1 still contains citations that now point to unrelated sources in the final list. Examples from pp. 6–8 include:

- DSM-BIA versus DXA is cited as [3], but [3] is Pescatello's exercise-prescription system.
- General BIA sensitivity is cited as [4], but [4] is Zhao's fitness recommender.
- Personalization and motivation are cited as [6], but [6] is the WHO physical-activity guideline.
- Explanation design is cited as [7], but [7] is Ward's BIA paper.
- PAR-Q+ is cited as [8], but [8] is the laboratory-result presentation review.
- FitMao history/change curves are cited as [2], but the vendor source is [13].

These are critical citation errors. A reference manager or a full citation-number audit is required after all revisions. Do not renumber references manually in separate sections.

## Section-by-section review

### Section 2.1: Literature Review

**Fitness Assessment [1]: Keep.** The ACSM manual is authoritative for standardized assessment procedures. The statement that measurements are not self-explanatory needs a health-communication source such as [8] or [17], because the manual does not directly establish lay-user comprehension difficulty.

**Body Composition Data [2]: Keep with qualification.** Holmes and Racette accurately describe body-composition methods and their clinical/nutritional utility. Their audience is clinical practice; do not present the paper as direct evidence about newly registered gym members.

**Physical Activity Guidelines [6]: Revise.** Bull et al. support physical activity's health value and the WHO recommendations. They do not establish that fitness centres support new members through assessment tools. Delete that clause or cite gym-setting research.

**Bioelectrical Impedance Analysis [7]: Keep.** The summary is broadly accurate. Add that general BIA evidence cannot validate FitMao specifically. No peer-reviewed FitMao-280H validation study was found in the targeted search.

**Health Literacy and Numeracy [8], [17]: Keep and strengthen.** Van der Mee et al. reviewed 18 studies and found that presentation format affects how people process numeric laboratory results; horizontal line bars, color blocks, reference ranges, and personalized goal ranges were often helpful ([JMIR review](https://www.jmir.org/2024/1/e53993/)). Add Turchioe et al.'s patient-facing visualization review, which found that number lines and bar graphs were often better understood than line graphs and that color could improve comprehension and confidence ([PubMed record](https://pubmed.ncbi.nlm.nih.gov/31597182/)). These are strong analogues, but explicitly acknowledge that neither concerns FitMao.

**Self-Determination Theory [9]: Keep with nuance.** It supports the roles of autonomy, competence, and motivation in exercise adoption and maintenance. Do not imply that all goal types have identical effects; the review found mixed evidence for some body-related motives.

**Explainability [14], [20]–[22]: Reduce and refocus.** FitStart is deterministic, not a predictive AI system. One conceptual XAI source and one empirical explanation-design source are enough. Keep [14] as a broad transparency framework and [20] as a warning that explanations do not automatically create appropriate trust. Reference [22] is especially distant from the problem: it uses ICU data and deep learning, and it does not test user trust, comprehension, usability, or body-composition interpretation.

**Technology Acceptance Model [15]: Remove unless actually measured.** TAM concerns perceived usefulness, perceived ease of use, and intention to adopt technology. It is not the same as usability. If the study uses only SUS and comprehension/relevance questions, TAM is not the theoretical basis for those measures.

**Rule-Based Decision Support [16]: Keep, but rewrite.** It supports IF–THEN rules, knowledge representation, and system architecture. It does not show that weighted rules are inherently explainable or validate FitStart's weights.

**System Usability Scale [18] and Kappa [19]: Move to Chapter 3.** They are evaluation methods, not core literature explaining the research problem. If kept in Chapter 2, connect them directly to the planned outcomes and state their limits.

### Section 2.2: Review of Published Works

This section mostly gives one-paragraph descriptions. Improve it by reporting the study design, sample, method, key result, limitation, and exact relevance to FitStart.

**Pescatello et al. [3]: Keep.** It is a close architectural analogue, but it is a development report in cardiovascular risk management, not validation of body-composition interpretation.

**Zhao et al. [4]: Keep.** State that the study had 40 participants over 60 days and concerned wearable-supported activity recommendations. It supports feasibility of personalization, not FitStart's interpretation task ([JMIR article](https://games.jmir.org/2020/4/e19968/)).

**Ghanvatkar et al. [5]: Keep.** Strong for the idea of a contextual user model, but it is a scoping review and did not quality-assess the included studies.

**Neville et al. [10]: Rewrite.** The current text says tailored approaches can be more effective than generic information. The review concluded that evidence was inconclusive and long-term sustainability/generalizability were uncertain. Present the mixed result, or supplement it with a later review.

**De Croon et al. [11]: Keep.** Useful overview of 73 implemented and evaluated health recommender systems for lay users. It supports the broader landscape, not the novelty of FitStart's ranking mechanism ([JMIR review](https://www.jmir.org/2021/6/e18035)).

**Szymanski et al. [12]: Rewrite.** This was a qualitative study with 11 users of a chronic-pain app, not an objective comprehension experiment. It found that 10 of 11 users initially misinterpreted feature-importance bars. Use it to justify cautious, plain-language explanation design, not to claim proven comprehension improvement ([official paper](https://ceur-ws.org/Vol-3124/paper1.pdf)).

**Rosenbacke et al. [20]: Keep with population limit.** Its evidence concerns practicing clinicians using AI, not lay gym members.

**Abbas et al. [21]: Correct the technical summary.** The paper includes 62 studies, but it did not perform a conventional effect-size meta-analysis; it used descriptive/narrative synthesis. SHAP and LIME are model-agnostic, while Grad-CAM is model-specific. Call it a systematic review with descriptive synthesis in your narration ([Healthcare article](https://www.mdpi.com/2227-9032/13/17/2154)).

**Vani et al. [22]: Replace or clearly label as a distant contrast.** It proposes a predictive ICU monitoring model using MIMIC-III data. It does not show that trust improved in real users and does not study body composition. A closer optional replacement is the EVIDENT 3 randomized trial, which evaluated an mHealth intervention with self-monitoring, tailored feedback, and body-composition outcomes ([JMIR article](https://mhealth.jmir.org/2020/11/e21771/)). It still does not directly test report comprehension, so describe it accurately.

**Sobreiro [23] and Sperandei [24]: Keep only as context or remove.** Neither supports the current causal claim about early interpretation and engagement.

### Section 2.3: Related and Existing Systems

This section needs the largest rewrite.

Add a comparison table with columns such as:

| System | Data source | Personal context | Interpretation/guidance | Metric ranking | Explanation trace | Intended use | Evidence type |
|---|---|---|---|---|---|---|---|
| FitMao 280H | FitMao BIA | Vendor-dependent | Vendor claims morphology, nutrition, exercise outputs | Not publicly documented | Not publicly documented | Assessment/device ecosystem | Official vendor page |
| InBody App | InBody tests and wearables | Goals and app inputs | Personalized insights, result breakdown, plans | Not publicly documented as FitStart-style ranking | Not publicly documented | Body-composition management | Official vendor page |
| Garmin Connect+ | Wearables and compatible scale | Goals/history/activity | AI insights and longitudinal analysis | No first-assessment metric ranking documented | AI rationale not documented on cited page | Ongoing fitness/wellness tracking | Official vendor page |
| Withings App/BodyPath | Withings devices and logs | Weight goal, activity, sleep, nutrition | Goal-linked contributing factors and guidance | Goal/path focused | Some factor explanation; deterministic trace not documented | Longitudinal health/weight management | Official support page |
| FitStart | FitMao report + member survey | Safety, goals, activity style, schedule/lifestyle, nutrition/hydration, barriers/preferences | Main Focus and Top Priorities | Yes | Yes, through score breakdown and “Because You Told Us” | Initial educational interpretation | Implemented system + study evaluation |

Important: “No independent evaluation was identified” should be limited to the specific commercial features and search performed. Do not imply that the entire product has never been independently studied without a reproducible search.

### Section 2.4: Synthesis

Rewrite the synthesis around what the evidence actually establishes:

1. Body-composition reports contain several estimates that require measurement context and cautious interpretation.
2. Patient-facing numeric health information is not automatically understood; presentation format and literacy affect comprehension.
3. Digital fitness and health systems can use contextual profiles to tailor information or activities, but effects, populations, and methods vary.
4. Rule-based systems offer a transparent implementation approach, but the domain rules and weights must be separately justified and validated.
5. Existing commercial systems overlap with FitStart in tracking, goals, insights, and guidance. The narrower differentiator is FitStart's explicit deterministic metric ranking and traceable explanation for an initial FitMao result.

## Reference-by-reference decision

| Ref. | Decision | Accuracy and required action |
|---:|---|---|
| [1] | Keep | Real and appropriate. Add editors/ISBN if required by the school's IEEE guide. Use [8]/[17] for lay comprehension. |
| [2] | Keep | Real and correctly identified. Make clear it concerns nutrition/clinical practice, not new gym members directly. Add DOI `10.3390/nu13082493`. |
| [3] | Keep/rewrite | Real. DOI is `10.1016/j.mayocpiqo.2020.08.005`. Supports architecture, not FitStart's exact scoring. |
| [4] | Keep | Real and relevant to fitness personalization. Add sample (n=40) and 60-day duration. DOI `10.2196/19968`. |
| [5] | Keep | Real and relevant. State that it is a scoping review without quality appraisal. DOI `10.2196/11098`. |
| [6] | Keep/rewrite | Real, but does not support the fitness-centre/assessment-tool clause. DOI `10.1136/bjsports-2020-102955`. |
| [7] | Keep | Strong general BIA caveat. Does not validate FitMao. DOI `10.1038/s41430-018-0335-3`. |
| [8] | Keep | Strong analogue for numeric-result presentation. DOI `10.2196/53993`. |
| [9] | Keep/qualify | Real. Avoid suggesting all motives have equal effects. DOI `10.1186/1479-5868-9-78`. |
| [10] | Rewrite/supplement | Real, but its conclusion was inconclusive. Do not state clear superiority of tailoring. DOI `10.1186/1479-5868-6-30`. |
| [11] | Keep | Real systematic review. DOI `10.2196/18035`. |
| [12] | Rewrite | Real workshop paper, n=11 qualitative users. It identified misunderstandings and design preferences, not objective comprehension improvement. |
| [13] | Keep as vendor source | Real official page. Label accuracy and recommendation claims as vendor-reported; no peer-reviewed FitMao-280H validation was located. |
| [14] | Keep as indirect theory | Real. AI-centered, so use only for general transparency/evaluation principles. DOI `10.1016/j.jbi.2020.103655`. |
| [15] | Remove unless TAM measured | Real, but acceptance is not the same as usability. DOI `10.1055/s-0038-1668091`. |
| [16] | Keep/rewrite | Real. Supports rule architecture and knowledge representation, not weighted-rule validity. DOI `10.1007/s12553-022-00672-9`. |
| [17] | Keep | Real and relevant to literacy-aware design. DOI `10.1093/eurjcn/zvad085`. |
| [18] | Correct | Malformed. `189–194` is a page range, not volume/issue. Correct book-chapter citation provided below. |
| [19] | Keep/change method | Real. Add DOI `10.11613/BM.2012.031`. Use only after the rater task and data type are defined. |
| [20] | Keep/qualify | Real. Clinician/AI evidence, not lay-user evidence. DOI `10.2196/53207`. |
| [21] | Rewrite | Real, but not a conventional effect-size meta-analysis. Grad-CAM is model-specific. DOI `10.3390/healthcare13172154`. |
| [22] | Replace or minimize | Real but distant; no user trust/comprehension/usability evaluation and no body-composition interpretation. DOI `10.1038/s41598-025-15867-z`. |
| [23] | Keep only as dropout context | Real. Does not support assessment interpretation affecting engagement. DOI `10.3390/ijerph181910465`. |
| [24] | Keep only as dropout context | Real. Does not support assessment interpretation affecting engagement. DOI `10.1016/j.jsams.2015.12.522`. |
| [25] | Rewrite/split | Official page is real. Separate InBody App from InBody+ and remove product-conflated claims. |
| [26] | Rewrite | Official source supports 140+ charts and personalized insights. Do not describe it as only for athletes. Add 14 May 2026 publication date. |
| [27] | Update | Change Health Mate to Withings App; correct the web-page title and incorporate current BodyPath features or cite them separately. |

## Corrected example for reference [18]

> [18] J. Brooke, “SUS: A ‘quick and dirty’ usability scale,” in *Usability Evaluation in Industry*, P. W. Jordan, B. Thomas, B. A. Weerdmeester, and I. L. McClelland, Eds. London, U.K.: Taylor & Francis, 1996, pp. 189–194.

Add a modern SUS interpretation source if scores will be interpreted:

> J. R. Lewis, “The System Usability Scale: Past, present, and future,” *International Journal of Human–Computer Interaction*, vol. 34, no. 7, pp. 577–590, 2018, doi: 10.1080/10447318.2018.1455307.

## Recommended additions

Use only sources that support a necessary claim; do not add references merely to increase the count.

1. **Direct DSM-BIA validity:** C. H. Y. Ling et al., “Accuracy of direct segmental multi-frequency bioimpedance analysis in the assessment of total body and segmental body composition in middle-aged adult population,” *Clinical Nutrition*, 30(5), 610–615, 2011, doi: [10.1016/j.clnu.2011.04.001](https://doi.org/10.1016/j.clnu.2011.04.001). This is the study apparently intended by Chapter 1's current DSM-BIA/DXA sentence. It validates DSM-BIA generally, not FitMao.
2. **Patient-facing health-data visualization:** M. Reading Turchioe et al., “A systematic review of patient-facing visualizations of personal health data,” *Applied Clinical Informatics*, 10(4), 751–770, 2019, doi: [10.1055/s-0039-1697592](https://doi.org/10.1055/s-0039-1697592).
3. **Numeracy and test-result interpretation:** B. J. Zikmund-Fisher, N. L. Exe, and H. O. Witteman, “Numeracy and literacy independently predict patients' ability to identify out-of-range test results,” *Journal of Medical Internet Research*, 16(8), e187, 2014, doi: [10.2196/jmir.3241](https://doi.org/10.2196/jmir.3241).
4. **Official PAR-Q+:** D. E. R. Warburton et al., “The 2021 Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and electronic Physical Activity Readiness Medical Examination (ePARmed-X+),” *Health & Fitness Journal of Canada*, 14(1), 83–87, 2021, doi: [10.14288/hfjc.v14i1.351](https://doi.org/10.14288/hfjc.v14i1.351). The current paper cites the wrong reference number for PAR-Q+.
5. **Rule governance and validation:** A rule-based system needs evidence that its logic was reviewed and tested. Wright et al.'s Delphi study on preventing rule-based decision-support malfunctions is a useful methodological analogue: doi: [10.1016/j.ijmedinf.2018.08.001](https://doi.org/10.1016/j.ijmedinf.2018.08.001).

## Suggested revised Chapter 2 structure

1. **Body-composition assessment and BIA limitations**  
   Measurement scope, estimation limits, standardized conditions, and lack of FitMao-specific independent validation.
2. **Understanding numerical personal health information**  
   Health literacy, numeracy, graph literacy, result presentation, and plain-language explanation.
3. **Personalization and contextual user models**  
   What context has been used, how personalization has been evaluated, and limitations of the evidence.
4. **Transparent rule-based decision support**  
   Architecture, traceability, rule validation, and why the approach is educational rather than clinical.
5. **Related studies**  
   Compare design, sample, method, result, limitation, and relevance in a table instead of isolated summaries.
6. **Existing systems**  
   Current feature matrix using dated official documentation; distinguish vendor claims from independent evidence.
7. **Synthesis and bounded research gap**  
   State only what the reviewed evidence establishes and define FitStart's narrow differentiator.

Move TAM, SUS, kappa/Kendall's W, sample design, and evaluation procedures to Chapter 3 unless your institution specifically requires theoretical and measurement foundations in Chapter 2.

## Priority action plan

### Must fix before the next formal review

1. Delete or correct the causal retention statement based on [23] and [24].
2. Rewrite the commercial comparison using current FitMao, InBody, Garmin, and Withings documentation.
3. Replace the universal novelty claim with a bounded “among the systems reviewed” claim.
4. Correct all stale numeric citations across Chapter 1 and Chapter 2.
5. Align system descriptions with the current survey and displayed outputs; remove Quick Wins, First Steps, and Explore For You unless implemented and evaluated.
6. Define the expert task, rater count, and correct agreement statistic.
7. Add an evidence/expert-validation trail for every FitStart rule and weight.

### Strong improvements

8. Add a study-comparison table and a system-feature matrix.
9. Rewrite each study summary to include design, sample, finding, limitation, and relevance.
10. Reduce the AI/XAI material and strengthen direct literature on patient-facing numerical results and visualizations.
11. Correct IEEE formatting and add DOI or stable URLs wherever available.
12. Remove TAM unless technology acceptance is separately measured.

## Final assessment

The thesis topic remains viable. The evidence supports the problem that numerical assessment results require context and careful presentation, and it supports the feasibility of contextual personalization and transparent rule-based processing. What the current evidence does **not** support is the claim that FitStart alone occupies a completely unfilled academic and commercial space, or that personalized interpretation will improve member retention.

After the revisions above, Chapter 2 can make a strong, defensible contribution: FitStart is an educational system that applies transparent, deterministic, member-context rules to rank selected FitMao metrics and explain the basis of those priorities. That is specific enough to evaluate and narrow enough to defend.

