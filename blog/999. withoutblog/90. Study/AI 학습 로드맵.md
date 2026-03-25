---
title: AI 공부 로드맵
date: 2026-03-16
tags:
  - AI
  - Machine Learning
  - Deep Learning
  - Study
difficulty: Intermediate
status: In Progress
---

# 🤖 AI 공부 로드맵

> "AI를 제대로 배우기 위한 체계적인 여정" - 기초부터 실전까지

---

## 📊 전체 로드맵 개요

```
초급 (3-4개월)
  ├─ 수학 기초 (선형대수, 확률통계)
  ├─ 프로그래밍 기초 (Python)
  └─ ML 기초 개념

중급 (3-4개월)
  ├─ 머신러닝 알고리즘
  ├─ 데이터 전처리
  └─ 실전 프로젝트

고급 (4-6개월)
  ├─ 딥러닝
  ├─ 자연어처리 (NLP)
  └─ 컴퓨터 비전 (CV)

전문가 (진행 중)
  ├─ 최신 논문 리뷰
  ├─ 연구 프로젝트
  └─ 특화 분야 심화
```

---

## 🎓 Phase 1: 초급 (3-4개월)

### 1️⃣ 수학 기초

**필요 이유**: AI의 모든 알고리즘은 수학 기반입니다.

#### 📚 학습 순서

- [ ] **선형대수 (Linear Algebra)**
  - 벡터, 행렬의 개념
  - 행렬 연산, 고유값(Eigenvalue)
  - 추천 자료: 3Blue1Brown "Essence of Linear Algebra"

- [ ] **미적분 (Calculus)**
  - 미분의 개념과 연쇄법칙
  - 편미분과 그래디언트
  - 추천 자료: 3Blue1Brown "Essence of Calculus"

- [ ] **확률과 통계 (Probability & Statistics)**
  - 확률의 기초 개념
  - 확률분포 (정규분포, 이항분포 등)
  - 베이즈 정리
  - 추천 자료: MIT OpenCourseWare "Introduction to Probability"

**학습 시간**: 3-4주
**체크 포인트**: 간단한 수학 문제 풀이, 개념 설명

---

### 2️⃣ Python 프로그래밍

**필요 이유**: AI 개발의 주요 언어입니다.

#### 📚 학습 순서

- [ ] **Python 기초**
  - 변수, 자료형, 제어문
  - 함수와 클래스
  - 추천 자료: Python 공식 튜토리얼

- [ ] **데이터 처리 라이브러리**
  - NumPy: 수치 계산
  - Pandas: 데이터 조작
  - Matplotlib, Seaborn: 시각화
  - 추천 자료: kaggle.com 튜토리얼

- [ ] **첫 프로젝트**
  - 타이타닉 데이터셋 분석
  - CSV 파일 로드, 데이터 시각화
  - 기초 통계 분석

**학습 시간**: 2-3주
**체크 포인트**: 간단한 데이터 분석 스크립트 작성

---

### 3️⃣ Machine Learning 기초 개념

**필요 이유**: AI의 원리를 이해해야 합니다.

#### 📚 핵심 개념

- [ ] **ML이 뭐인가?**
  - 지도학습 vs 비지도학습
  - 회귀 vs 분류
  - 오버피팅, 언더피팅

- [ ] **기본 알고리즘 이해**
  - 선형회귀 (Linear Regression)
  - 로지스틱회귀 (Logistic Regression)
  - 의사결정나무 (Decision Tree)
  - 추천 자료: Andrew Ng "Machine Learning Specialization" (처음 1-2주)

**학습 시간**: 2-3주
**체크 포인트**: 간단한 분류 문제 풀기

---

## 🚀 Phase 2: 중급 (3-4개월)

### 4️⃣ Machine Learning 알고리즘 심화

#### 📚 학습 순서

- [ ] **분류 알고리즘**
  - K-Nearest Neighbors (KNN)
  - Support Vector Machine (SVM)
  - 나이브 베이즈 (Naive Bayes)

- [ ] **앙상블 방법**
  - 랜덤포레스트 (Random Forest)
  - 그래디언트 부스팅 (Gradient Boosting)
  - XGBoost, LightGBM

- [ ] **비지도학습**
  - K-Means 클러스터링
  - 계층적 클러스터링
  - PCA (주성분분석)

**추천 자료**:
- Andrew Ng "Machine Learning Specialization"
- Kaggle 경진대회 커널 분석

**학습 시간**: 6-8주
**체크 포인트**: Kaggle 초급 경진대회 참여

---

### 5️⃣ 데이터 전처리와 EDA

#### 📚 핵심 스킬

- [ ] **탐색적 데이터 분석 (EDA)**
  - 결측치 처리
  - 이상치 탐지
  - 데이터 시각화

- [ ] **특성 공학 (Feature Engineering)**
  - 특성 생성
  - 특성 스케일링
  - 인코딩 (원핫, 라벨)

- [ ] **데이터 파이프라인**
  - Scikit-learn Pipeline
  - 데이터 검증

**학습 시간**: 4-6주
**체크 포인트**: 데이터셋 전처리 후 모델링

---

### 6️⃣ 첫 번째 실전 프로젝트

#### 🎯 프로젝트 제안

| 프로젝트 | 난이도 | 기술 | 소요시간 |
|---------|--------|------|---------|
| 주택 가격 예측 (회귀) | ⭐ | Linear Regression | 1-2주 |
| 고객 이탈 예측 (분류) | ⭐⭐ | Logistic, RF | 2-3주 |
| 아이리스 데이터 분류 | ⭐ | KNN, SVM | 1주 |
| 신용카드 사기 탐지 | ⭐⭐⭐ | Ensemble | 3-4주 |

**체크 포인트**: 모델 평가 지표 계산 (정확도, 정밀도, 재현율, F1)

---

## 🧠 Phase 3: 고급 (4-6개월)

### 7️⃣ Deep Learning 기초

#### 📚 학습 순서

- [ ] **신경망의 원리**
  - 뉴런과 활성함수
  - 순전파(Forward Pass), 역전파(Backpropagation)
  - 경사하강법 (Gradient Descent)

- [ ] **Keras/TensorFlow**
  - Sequential 모델
  - Functional API
  - 모델 훈련과 평가

- [ ] **기본 아키텍처**
  - 완전연결층 (Dense)
  - 합성곱 신경망 (CNN) 기초
  - 순환신경망 (RNN) 기초

**추천 자료**:
- Andrew Ng "Deep Learning Specialization"
- Fast.ai "Practical Deep Learning"
- 오제호 저 "딥러닝"

**학습 시간**: 6-8주
**체크 포인트**: MNIST 손글씨 인식 프로젝트

---

### 8️⃣ 컴퓨터 비전 (CV)

#### 📚 학습 순서

- [ ] **합성곱 신경망 (CNN)**
  - 컨볼루션, 풀링 연산
  - 유명 아키텍처: VGG, ResNet, Inception

- [ ] **사전학습 모델 (Transfer Learning)**
  - ImageNet 모델 활용
  - Fine-tuning
  - 추천: torchvision, tf.keras.applications

- [ ] **고급 CV 작업**
  - 객체 탐지 (Object Detection): YOLO, Faster R-CNN
  - 이미지 분할 (Segmentation): U-Net
  - 얼굴 인식, 포즈 추정

**학습 시간**: 4-6주
**체크 포인트**: 고양이 vs 개 분류 프로젝트

---

### 9️⃣ 자연어처리 (NLP)

#### 📚 학습 순서

- [ ] **텍스트 전처리**
  - 토큰화, 정규화
  - 불용어 제거
  - Word Embedding: Word2Vec, GloVe

- [ ] **순환신경망 (RNN)**
  - LSTM, GRU
  - 시계열 데이터 처리

- [ ] **변환기 (Transformer)**
  - Attention 메커니즘
  - BERT, GPT 기초
  - Hugging Face Transformers 라이브러리

- [ ] **NLP 응용**
  - 감정분석 (Sentiment Analysis)
  - 텍스트 분류
  - 기계번역
  - 질의응답 시스템

**학습 시간**: 6-8주
**체크 포인트**: 영화 리뷰 감정분석 프로젝트

---

### 🔟 중급 프로젝트 (2-3개)

#### 🎯 프로젝트 제안

**1. 이미지 분류 프로젝트**
- CIFAR-10 데이터셋 분류
- 전이학습 활용
- 정확도 90% 이상

**2. 감정분석 프로젝트**
- 영화 리뷰 또는 트위터 데이터
- BERT 활용
- 배포 (Flask, Streamlit)

**3. 시계열 예측**
- 주식 가격, 날씨, 트래픽 예측
- LSTM/GRU
- 실시간 데이터 처리

---

## 🔬 Phase 4: 전문가 (진행 중)

### 1️⃣1️⃣ 고급 주제

#### 📚 선택 분야 (하나 이상 선택)

- [ ] **강화학습 (Reinforcement Learning)**
  - Q-Learning, Policy Gradient
  - 게임 AI, 로봇 제어

- [ ] **생성모델 (Generative Models)**
  - GAN (Generative Adversarial Networks)
  - VAE (Variational Autoencoder)
  - Diffusion Models

- [ ] **멀티모달 AI**
  - Vision + Language: CLIP, ViT
  - 멀티모달 학습

- [ ] **AI 윤리 및 설명가능성**
  - Explainable AI (XAI)
  - 편향성 탐지
  - AI 윤리

---

### 1️⃣2️⃣ 최신 연구 따라잡기

#### 📚 방법

- [ ] **학술 논문 읽기**
  - arXiv.org 구독
  - 주간 추천 논문 읽기
  - 논문 리뷰 블로그 작성

- [ ] **컨퍼런스 참여**
  - NeurIPS, ICML, ICCV, ACL
  - YouTube로 강연 시청
  - 논문 리뷰 그룹

- [ ] **오픈소스 기여**
  - PyTorch, TensorFlow, Hugging Face
  - 버그 수정, 기능 추가

---

### 1️⃣3️⃣ 고급 프로젝트 (1-2개)

#### 🎯 프로젝트 아이디어

**1. 자신만의 모델 구축**
- 새로운 아키텍처 제안
- 기존 모델 개선
- 논문 재구현

**2. 실제 문제 해결**
- 회사/조직의 실제 데이터로 프로젝트
- 배포 및 모니터링
- 성능 개선

**3. 연구 프로젝트**
- 새로운 아이디어 검증
- 논문 작성 및 제출
- 컨퍼런스 발표

---

## 📚 추천 학습 자료

### 온라인 강좌

| 플랫폼 | 강좌명 | 난이도 | 언어 |
|--------|--------|--------|------|
| Coursera | Machine Learning (Andrew Ng) | 초급 | 영어 |
| Coursera | Deep Learning Specialization | 중급 | 영어 |
| Fast.ai | Practical Deep Learning | 중급 | 영어 |
| Udacity | AI for Everyone | 초급 | 한글 |
| 네이버부스트캠프 | AI 종합반 | 중급-고급 | 한글 |

### 책

- "밑바닥부터 시작하는 딥러닝" - 사이토 고키
- "Deep Learning" - Goodfellow, Bengio, Courville
- "Machine Learning Yearning" - Andrew Ng (무료)
- "Hands-On Machine Learning" - Aurélien Géron

### 블로그/커뮤니티

- Distill.pub - 인터랙티브 ML 설명
- 한글 AI 블로그들
- Kaggle - 데이터셋, 커널, 경진대회
- GitHub - 오픈소스 프로젝트

---

## ✅ 성공 기준

### 초급 완료 기준
- [ ] Python으로 간단한 ML 모델 구축 가능
- [ ] Kaggle 초급 경진대회 참여
- [ ] 기본 알고리즘의 원리 이해

### 중급 완료 기준
- [ ] 데이터 전처리부터 모델링까지 전 과정 수행
- [ ] Kaggle 중급 경진대회 상위 10% 진입
- [ ] 3개 이상의 프로젝트 완료 및 배포

### 고급 완료 기준
- [ ] CNN, RNN, Transformer 직접 구현 가능
- [ ] 논문의 핵심 내용 이해 및 구현
- [ ] 실제 문제에 DL 적용 경험
- [ ] GitHub 포트폴리오 구축

---

## 🎯 주간 학습 계획 템플릿

```
주간 목표: [목표 설정]
난이도: [⭐-⭐⭐⭐]

월요일: 개념 학습 (2시간)
화요일: 개념 학습 (2시간)
수요일: 코딩 실습 (3시간)
목요일: 프로젝트 (3시간)
금요일: 프로젝트 (3시간)
토요일: 블로그 작성/복습 (2시간)
일요일: 휴식/리뷰 (1시간)

주간 총 시간: 16시간
```

---

## 💡 학습 팁

> [!tip] 효율적인 학습을 위한 조언
>
> 1. **프로젝트 기반 학습** - 이론만 배우지 말고 반드시 구현하세요
> 2. **꾸준함이 최고** - 주 10-15시간씩 꾸준히 하는 게 단시간 집중보다 낫습니다
> 3. **블로그 작성** - 배운 내용을 글로 정리하면 이해가 깊어집니다
> 4. **커뮤니티 참여** - 다른 학습자와 공유하고 피드백받으세요
> 5. **수학은 포기하지 마세요** - 처음엔 어렵지만 나중에 큰 자산이 됩니다

---

## 📊 진도 추적

### Phase 1: 초급
- [ ] 수학 기초 (진도: __)
- [ ] Python 프로그래밍 (진도: __)
- [ ] ML 기초 (진도: __)

### Phase 2: 중급
- [ ] ML 알고리즘 (진도: __)
- [ ] 데이터 전처리 (진도: __)
- [ ] 첫 프로젝트 (진도: __)

### Phase 3: 고급
- [ ] Deep Learning (진도: __)
- [ ] Computer Vision (진도: __)
- [ ] NLP (진도: __)

### Phase 4: 전문가
- [ ] 고급 주제 (진도: __)
- [ ] 논문 리뷰 (진도: __)
- [ ] 고급 프로젝트 (진도: __)

---

## 🚀 다음 단계

1. **이 로드맵을 세부 파일로 분리** → `90. Study/` 폴더 구조 활용
2. **각 Phase별 학습 자료 수집** → 링크 정리
3. **주간 계획 작성** → 실제 학습 시작
4. **진도 추적** → 정기적 업데이트

> 성공적인 AI 학습을 응원합니다! 🚀

