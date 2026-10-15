# Applied AI Final Practice Reviewer

Original AI-generated practice questions inferred from the EECE101/AIE10 final announcement, course learning guides and the Module 2 comprehensive study guide. These are study predictions; they are not actual or guaranteed exam questions.

## Open the reviewer

Open `index.html` in a browser. All assets are local, so no installation or internet is required for the quiz itself. Choose one of four 50-question practice sets or study the full 200-question bank. Filter by module, shuffle, reveal explanations, or retry missed questions. Blank answers use explicit accepted aliases and whitespace normalization. Capitalization is ignored for terminology; exact-code blanks marked `caseSensitive: true` preserve it. Progress is saved in this browser.

`questions.json` is the main machine-readable deliverable. `questions.js` contains the same bank for offline browser loading. The interface is adapted from https://github.com/aaronfilarca/os-finals-reviewer and stored separately from the Operating Systems reviewer. The GitHub Pages section is [Applied AI Finals Practice](https://aaronfilarca.github.io/os-finals-reviewer/applied-ai/).

## Announcement analysis

The actual final is **50 questions**, Friday **16 October 2026, 10:00 AM–12:00 PM (Asia/Manila)**. It permits two attempts within the window, records the highest grade, lasts 120 minutes, presents one question at a time and prohibits backtracking. The practice reviewer provides study feedback and free navigation; it does not reproduce Blackboard's timed examination controls.

Each practice set mirrors the announced structure:

| Section | Per set | Entire bank |
|---|---:|---:|
| Conceptual single-answer MCQ | 15 | 60 |
| Situational single-answer MCQ | 5 | 20 |
| Select all that apply | 5 | 20 |
| True/false | 15 | 60 |
| Fill in the blank | 10 | 40 |
| **Total** | **50** | **200** |

The announcement covers Modules 1–3, Lessons 1–9. It gives question-type counts but **does not publish module weights**. The bank's editorial allocation is 40 Module 1, 100 Module 2 and 60 Module 3 questions, reflecting the density of the published pointers. No numerical likelihood of individual questions is claimed.

### Highest-priority review areas

- **Validation and leakage:** fold-local preprocessing, prediction-time availability, stratification, group/time leakage, mean and variability of cross-validation evidence.
- **Metrics and decisions:** dummy baselines, accuracy under imbalance, balanced accuracy, macro-F1, PR curves, positive-class interpretation and validation-based threshold choice for asymmetric costs.
- **Pipelines and MLOps:** `model__C`, `predict_proba`, one-standard-error selection, complete saved pipeline, input schema, reference outputs and drift investigation.
- **Neural networks and CNNs:** nonlinear activations, output dimensions, padding, pooling, weight sharing, frozen pretrained features and global average pooling.
- **Preprocessing and responsible practice:** subgroup imputation, scaling, aligned one-hot features, provenance, verification, disclosure and human accountability.

The course's Module 2 guide contains a sample scorer typo: use `scoring='f1_macro'`, as documented by [scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html#scoring-string-names). Threshold explanations here also distinguish common precision trends from mathematical guarantees. CNN calculations state stride, padding and dilation assumptions, consistent with [Keras Conv2D](https://keras.io/api/layers/convolution_layers/convolution2d/).

## Sources and scope

The JSON includes a source catalog and source IDs for every question. `source-notes.md` records which course pages were actually read. Sources include the final announcement, Lesson 2/4/5/6/7/8/9 learning guides, and the entire Module 2 comprehensive study guide. Lecture videos, full slide decks and the actual final were not accessed. Course links require your Blackboard login.

The announcement says the final is AI-prohibited. This is a preparation aid for study before the assessment.

Exam-day details from the announcement: bring a charged laptop and charger, a valid student ID, and an updated and tested Respondus LockDown Browser; arrive at the assigned room by **9:45 AM**. The proctor provides Wi-Fi and exam access details.

## JSON schema

Schema version 2 preserves the original UI's `modules`, `questions`, choice IDs, `correctChoiceIds`, `selectionCount`, `answerText` and explanations. Added fields include `mocks`, `sources`, `examBlueprint`, per-question `mockId`, `type`, `topic` and `sourceIds`. Types are `mcq`, `scenario_mcq`, `multi_select`, `true_false` and `fill_blank`. Blank questions have empty choice arrays, `selectionCount: 0` and an `acceptedAnswers` array. Numbers 1–200 and IDs `aai-q001`–`aai-q200` are unique across the bank.
