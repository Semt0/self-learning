# MIT 6.S184: Introduction to Flow Matching and Diffusion Models

- **Website**: <https://diffusion.csail.mit.edu/2026/>
- **Term**: IAP 2026
- **Instructors**: Peter Holderrieth, Ezra Erives
- **Prerequisites**: Linear algebra, multivariate calculus, basic probability theory; Python + PyTorch
- **Status**: Completed
- **Course review**: [[course-retrospective-and-project-showcase|课程复盘与项目展示]]

## Course Description

Diffusion and flow models are the cutting edge generative AI methods for images, videos, and many other data types. This course offers a comprehensive introduction to the core mathematical concepts (SDEs, Fokker–Planck equation) and a step-by-step build of a latent diffusion model from scratch.

## Resources

- [Course notes (PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf)
- [Course notes (arXiv:2506.02070)](https://arxiv.org/abs/2506.02070)
- [Lab notebooks (GitHub)](https://github.com/eje24/iap-diffusion-labs/tree/2026)
- [Class source code (GitHub)](https://github.com/eje24/iap-diffusion-class/)

## Lectures

| # | Topic | Date | Slides | Recording | Notes |
|---|-------|------|--------|-----------|-------|
| 1 | Flow and Diffusion Models | 2026-01-20 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf) | [video](https://www.youtube.com/watch?v=9eJQQVrUUoI) | [[lec-01-flow-and-diffusion-models\|notes]] |
| 2 | Flow Matching | 2026-01-22 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) | [video](https://www.youtube.com/watch?v=PNkMKWW8Khw) | [[lec-02-flow-matching\|notes]] |
| 3-A | Score Functions and Score Matching | 2026-01-23 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [video](https://www.youtube.com/watch?v=ngC3QnYSVNM) | [[lec-03a-score-functions-and-score-matching\|notes]] |
| 3-B | Classifier-free Guidance | 2026-01-23 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [video](https://www.youtube.com/watch?v=8oWZ1bHwyRI) | [[lec-03b-classifier-free-guidance\|notes]] |
| 4 | Latent Spaces and Neural Network Architectures | 2026-01-28 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) | [video](https://www.youtube.com/watch?v=g0MB1CCBmsI) | [[lec-04-latent-spaces-and-neural-network-architectures\|notes]] |
| 5 | Discrete Diffusion Models | 2026-01-30 | [slides](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf) | [video](https://www.youtube.com/watch?v=d0kmyEJN2hI) | [[lec-05-discrete-diffusion-models\|notes]] |

## Labs

| # | Topic | Related Lectures | Work | Status |
|---|-------|------------------|------|--------|
| 1 | Working with ODEs and SDEs | Lec 1 | [README](./hw/lab01/README.md) · [notebook](./hw/lab01/lab_one.ipynb) | ✅ Completed |
| 2 | Flow Matching and Score Matching | Lec 2, Lec 3-A | [README](./hw/lab02/README.md) · [notebook](./hw/lab02/lab_two.ipynb) | ✅ Completed |
| 3 | Conditional Image Generation, DiT and VAEs | Lec 3-B, Lec 4, Lec 5 | [README](./hw/lab03/README.md) · [notebook](./hw/lab03/lab_three.ipynb) | ✅ Completed |

## Progress

- [x] Complete all five lectures and six lecture notes.
- [x] Complete Lab 1: numerical simulation of ODEs and SDEs.
- [x] Complete Lab 2: flow matching and score matching.
- [x] Complete Lab 3: conditional image generation and diffusion architectures.
- [x] Write the [[course-retrospective-and-project-showcase|course retrospective and project showcase]].

## Directory Layout

```text
mit-6.s184-iap26/
├── README.md                                   # course overview and progress
├── course-retrospective-and-project-showcase.md
├── notes/                                      # lecture notes
├── hw/                                         # completed labs
└── assets/                                     # images and attachments
```
