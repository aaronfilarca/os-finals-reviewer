# Applied AI final: source notes

Reviewed 15 October 2026 (Asia/Manila). Original practice questions will be inferred from public-to-the-student exam pointers, not actual exam items. Topic weights beyond the announced question-type counts are editorial estimates.

## ANNOUNCEMENT (primary source)
Title: [IMPORTANT] EECE101 & AIE10 Departmental Final Exam Schedule, Blackboard Test Settings, BYOD & Topic Pointers
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/announcements/announcement-detail?courseId=_163732_1&announcementId=_898571_1
Exam: Friday 16 October 2026, 10:00–12:00 Asia/Manila. 120 minutes. No backtracking. Two attempts within window, highest score. 50 questions: Part A 20 single-answer MCQs (15 concepts, 5 situations); Part B 5 select-all; Part C 15 true/false; Part D 10 fill blanks. AI prohibited during assessment. Bring charged laptop, updated/tested Respondus LockDown Browser, power cable, student ID; arrive 09:45. No claim that the exam itself has 200 questions.

Module 1: subgroup-aware missing-value imputation versus dropping rows; StandardScaler zero mean/unit variance before KNN/K-Means; one-hot encoding and feature alignment; data dictionaries/provenance; preventing global dataset leakage.

Module 2: stratified hold-out; CV mean and standard deviation; prediction moment; all fitted transformations strictly inside training folds; DummyClassifier baseline; imbalance limitations of accuracy; balanced accuracy; macro-F1; PR versus ROC; threshold selection for asymmetric costs; supervised versus unsupervised analysis; clusters are not ground-truth labels; K-Means geometry/inertia elbow/silhouette; PCA 2D as visual aid; Pipeline; GridSearchCV step__parameter syntax such as model__C; predict_proba; One-Standard-Error rule; joblib full preprocessing+model artifacts; schema validation; reference prediction sanity tests; covariate drift monitoring.

Module 3: nonlinear ReLU/sigmoid and avoiding linear collapse; CNN output dimensions, weight sharing, MaxPooling, zero-padding same versus valid; transfer learning/frozen early edge and texture features; Global Average Pooling spatial reduction and fewer head parameters; responsible AI verification/documentation/disclosure/human accountability.

Named scenarios: sensor network leakage, defect-detection threshold asymmetric cost, border preservation via CNN padding, MLOps input-schema failure. Named select-all themes: leakage prevention, imbalance metrics, artifact contents, clustering interpretation, live drift.

## LESSON4
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981093_1?view=content&state=view
Title: Lesson 4: Machine Learning Foundations, Baselines, Splits, and Validation (Module 2)
Read learning guide. Tasks framed by observation unit, target, prediction moment and success criterion. Establish dummy/naive baseline. Appropriate reproducible stratified hold-out, check class proportions. Pipeline preprocessing inside CV folds. Compare mean, variability, time, assumptions and baseline improvement. Exclude target during clustering fit. Select K with multiple evidence sources; PCA visualization is not proof. Select supervised workflow before looking at test, evaluate once. Disclose AI purpose/suggestions/verification/corrections/final human decision in AI-assisted notebook work. Guided Wine dataset, independent Banknote dataset.

## LESSON5
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981103_1?view=content&state=view
Title: Lesson 5: Model Evaluation, Thresholds, Error Analysis, and Tuning (Module 2)
Read learning guide. Metrics from decision context and error costs; define positive class before interpreting confusion matrix. Precision, recall, specificity, F1, ROC-AUC, average precision; prevalence and denominators matter. Tune complete pipelines only on training evidence; choose operating threshold on validation with trade-off table and neighboring candidates. Freeze model and threshold before one-time test. Explain uncertainty and limitations; no post-test tuning. AI-generated metric code must be checked for class orientation, curve input, threshold logic. This lesson also covers regression but final announcement does not foreground regression; prioritize the stated final pointers instead. Guided Breast Cancer Wisconsin and educational Heart Disease exercise (no diagnostic claims).

## LESSON6
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981113_1?view=content&state=view
Title: Lesson 6: Model Selection, Persistence, and Lightweight MLOps (Module 2)
Read learning guide. Interpret GridSearchCV beyond best mean score: nearby configurations, variability, complexity and cost. Record data version, split, code, environment, scorer, folds, seeds, search and selected parameters. Save full preprocessing-plus-model pipeline under a versioned name; reload and compare fixed reference predictions/probabilities. Input contract states columns/types/ranges/categories, missing/unknown handling, output semantics and limits. Distinguish schema, data/covariate, concept and performance signals. Monitoring thresholds trigger investigation, not automatic retraining. AI assistance must have verification and final accountable human decisions.

## STUDYGUIDE2
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_7064584_1?view=content&state=view
Title: Module 2 Quiz 2 Comprehensive Study Guide: Applied Machine Learning & MLOps
Read entire guide. Reinforces all Module 2 final pointers: stratification, CV variability, prediction moment, fold-local transforms, DummyClassifier most_frequent, imbalance metrics, PR curves, threshold tradeoffs, K-Means elbow/silhouette/size and PCA caveats, pipeline double underscores, one-standard-error parsimony rule, whole-pipeline joblib dump/load, schema and reference predictions, live input distributions/null counts/variance.
Accuracy notes for authors: guide sample has scoring='macro_f1', but correct built-in sklearn scorer is 'f1_macro' (official sklearn Model Evaluation docs). Use correct code. Guide says lowering threshold decreases precision/increases recall; precise questions should say recall cannot decrease on fixed scores, precision often decreases but is not mathematically guaranteed. Its sample scaling-leakage example alone cannot prove all production performance drop is caused by leakage; use diagnostic language rather than sole-cause claim.

## SKLEARN (technical verification)
URL: https://scikit-learn.org/stable/modules/model_evaluation.html
Title: scikit-learn model evaluation and scoring
Built-in scorer name f1_macro. For positive class probabilities check estimator.classes_ before choosing predict_proba column. This source is supporting technical documentation, not evidence of extra final topics.

## KERAS_CONV (technical verification)
URL: https://keras.io/api/layers/convolution_layers/convolution2d/
Title: Keras Conv2D layer
Same padding preserves spatial size when strides=1; valid uses no padding. Filter count determines output channels. Dilation=1 spatial output floor((N+2P-K)/S)+1 for symmetric padding.

## KERAS_GAP (technical verification)
URL: https://keras.io/api/layers/pooling_layers/global_average_pooling2d/
Title: Keras GlobalAveragePooling2D layer
Default keepdims=False produces (batch,channels), averaging each channel over both spatial dimensions.

## LESSON2
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6806084_1?view=content&state=view
Title: [Learning Resource] Lesson 2 Guide — Data Cleaning, Transformation, EDA, and Feature Engineering (Module 1)
Read guide. High-level sequence for conceptual study, guided notebook and independent evidence/interpretation. Required reading is data preprocessing and starting scikit-learn. Explain decisions and limitations; when AI permitted, record tool, requests, advice, verification and final human decision. This guide itself does not give detailed imputation formulas; ANNOUNCEMENT remains the detailed Module 1 exam-topic source.

## LESSON8
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981134_1?view=content&state=view
Title: Lesson 8: Convolutional Neural Networks, Model Reuse, and Inference (Module 3)
Read guide. Represent images as channels-last tensors; preserve preprocessing consistency; trace convolution/pooling/output shapes/parameter counts; controlled architecture comparison; visual error analysis; save/load equivalence and confidence-aware inference. Architecture selection uses validation, class-level performance, complexity and timing. Verify AI-generated shapes/code/metrics/interpretations. Lessons7–8 use Keras3 with PyTorch backend; lesson9 moves to native PyTorch/TorchVision. ANNOUNCEMENT is the detailed activation/transfer/GAP pointer source.

## LESSON7
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981124_1?view=content&state=view
Title: Lesson 7: Neural Networks, Optimization, and Training-Curve Analysis
Read guide. Roles of neuron/layer/activation/loss/gradient/optimizer; audit multiclass MLP shapes/parameter counts; interpret epoch-specific training/validation evidence; controlled optimization experiment; protect validation and test roles; reproducibility and verification of code/shapes/metrics/interpretation. Final announcement foregrounds nonlinear activations and linear collapse; use that narrower scope when weighting practice.

## LESSON9
URL: https://mapua.blackboard.com/ultra/courses/_163732_1/document/_6981144_1?view=content&state=view
Title: Lesson 9: Transfer Learning Project Clinic, Model Comparison, and Responsible Deployment
Read guide. Transfer learning with ResNet50/MobileNetV3; compare validation/final-test/complexity/timing evidence; verify artifacts and inference responses; monitor with human-review conditions; preserve accountable human decisions, disclosure, evidence and limitations. No full lecture slide decks or actual final accessed.
