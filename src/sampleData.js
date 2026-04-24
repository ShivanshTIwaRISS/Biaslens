// Sample demo scenarios for BiasLens

export const SAMPLES = [
  {
    id: 'hiring',
    label: '💼 Hiring Policy',
    category: 'policy',
    text: `Job Posting: Senior Software Engineer

We are looking for energetic, young professionals and recent graduates from top-tier universities (Ivy League or equivalent) to join our fast-paced startup culture.

Requirements:
- Must be a "cultural fit" with our dynamic, youthful team
- 0–3 years of experience preferred; we value fresh perspectives
- Must be physically able to work long hours and handle high-pressure environments
- Candidates must reside within 20 miles of our downtown headquarters
- Strong preference for candidates who have attended fraternity/sorority organizations
- Native English speakers preferred for "communication clarity"
- Applicants with gaps in their employment history need not apply

Compensation will be determined based on previous salary history.`
  },
  {
    id: 'loan',
    label: '🏦 Loan Approval Rule',
    category: 'policy',
    text: `Loan Approval Policy — Internal Underwriting Guidelines

Automatic rejection criteria:
- Applicants residing in zip codes 10001–10050 (historically high-risk neighborhoods) are automatically flagged for denial
- Applicants without a 4-year college degree from an accredited institution
- Applicants with non-traditional employment (gig workers, freelancers, self-employed under 5 years)
- Single mothers or applicants with more than 3 dependents
- Applicants whose last name suggests non-Western origin must provide additional documentation

Preferred applicants:
- Homeowners in affluent districts
- Applicants with legacy connections to our institution
- Married couples with a single household income above $120,000`
  },
  {
    id: 'medical',
    label: '🏥 Medical Triage Rule',
    category: 'policy',
    text: `Emergency Department Triage Priority Guidelines

Priority 1 (Immediate care):
- Patients with private health insurance or confirmed ability to pay
- Patients referred by private physicians or specialists
- English-speaking patients (to minimize interpreter delays)
- Employed, full-time professionals (higher social utility)

Priority 2 (Standard wait):
- Medicaid or Medicare patients
- Uninsured patients
- Elderly patients above age 75 (lower expected treatment outcome)
- Patients with physical or cognitive disabilities requiring additional assistance

Note: Homeless individuals or those with suspected substance abuse should be evaluated last, as they are more likely to misuse emergency resources.`
  },
  {
    id: 'csv-hiring',
    label: '📊 Hiring Dataset',
    category: 'dataset',
    text: `applicant_id,age,gender,race,university_tier,gpa,years_experience,zip_code,has_disability,referral_source,hired
1001,24,Male,White,Tier-1,3.8,2,10001,No,Employee Referral,Yes
1002,45,Female,Black,Tier-3,3.9,15,10045,No,Job Board,No
1003,23,Male,White,Tier-1,3.5,1,10002,No,Campus Recruit,Yes
1004,38,Female,Hispanic,Tier-2,3.7,10,10043,Yes,Job Board,No
1005,26,Male,Asian,Tier-1,3.6,3,10005,No,Employee Referral,Yes
1006,52,Female,Black,Tier-3,3.8,20,10048,No,Job Board,No
1007,27,Male,White,Tier-1,3.4,2,10003,No,Campus Recruit,Yes
1008,41,Female,Hispanic,Tier-2,3.9,12,10042,No,Job Board,No
1009,22,Male,White,Tier-1,3.7,1,10001,No,Employee Referral,Yes
1010,35,Female,Black,Tier-3,3.6,8,10046,Yes,Job Board,No
1011,29,Male,Asian,Tier-1,3.5,4,10004,No,Campus Recruit,Yes
1012,48,Female,White,Tier-2,3.8,18,10040,No,Job Board,No`
  },
  {
    id: 'csv-loan',
    label: '📊 Loan Dataset',
    category: 'dataset',
    text: `applicant_id,age,gender,marital_status,dependents,income,education,zip_code,credit_score,loan_amount,approved
L001,32,Male,Married,1,85000,Graduate,60601,720,25000,Yes
L002,28,Female,Single,0,62000,Graduate,60620,710,20000,No
L003,45,Male,Married,2,95000,Graduate,60611,680,35000,Yes
L004,34,Female,Single,3,58000,Non-Graduate,60628,700,15000,No
L005,29,Male,Married,0,72000,Graduate,60602,690,22000,Yes
L006,51,Female,Divorced,2,48000,Non-Graduate,60636,650,12000,No
L007,38,Male,Married,1,110000,Graduate,60614,750,40000,Yes
L008,26,Female,Single,1,55000,Graduate,60621,695,18000,No
L009,42,Male,Married,2,88000,Non-Graduate,60610,670,30000,Yes
L010,33,Female,Divorced,3,45000,Non-Graduate,60637,640,10000,No`
  },
  {
    id: 'model-output',
    label: '🤖 Model Decisions',
    category: 'model',
    text: `AI Resume Screening Model — Decision Log (Last 15 Candidates)

Candidate A: 26M, White, Stanford CS, 3.8 GPA, 2yr exp → ACCEPTED (Score: 92)
Candidate B: 34F, Black, Howard Univ, 3.9 GPA, 8yr exp → REJECTED (Score: 41)
Candidate C: 23M, Asian, MIT CS, 3.5 GPA, 1yr exp → ACCEPTED (Score: 88)
Candidate D: 45F, Hispanic, State Univ, 3.7 GPA, 15yr exp → REJECTED (Score: 38)
Candidate E: 28M, White, Carnegie Mellon, 3.6 GPA, 3yr exp → ACCEPTED (Score: 85)
Candidate F: 31F, Black, Spelman College, 3.8 GPA, 6yr exp → REJECTED (Score: 44)
Candidate G: 25M, White, UC Berkeley, 3.4 GPA, 2yr exp → ACCEPTED (Score: 81)
Candidate H: 40F, Asian, Community College, 3.9 GPA, 12yr exp → REJECTED (Score: 35)
Candidate I: 27M, White, Georgia Tech, 3.7 GPA, 3yr exp → ACCEPTED (Score: 87)
Candidate J: 29F, Hispanic, UT Austin, 3.6 GPA, 4yr exp → REJECTED (Score: 47)
Candidate K: 24M, Asian, Stanford, 3.3 GPA, 1yr exp → ACCEPTED (Score: 79)
Candidate L: 50M, Black, Online Degree, 3.5 GPA, 22yr exp → REJECTED (Score: 32)
Candidate M: 22M, White, Princeton, 3.2 GPA, 0yr exp → ACCEPTED (Score: 76)
Candidate N: 36F, Native American, Tribal College, 3.8 GPA, 10yr exp → REJECTED (Score: 39)
Candidate O: 44F, Black, HBCU, 3.7 GPA, 16yr exp → REJECTED (Score: 42)`
  }
];

// Hardcoded fallback result for demo resilience (used if API fails during presentation)
export const FALLBACK_RESULT = {
  riskLevel: 'High',
  biasScore: 87,
  detectedBiases: [
    'Age Bias',
    'Socio-economic Bias',
    'Location Bias',
    'Exclusionary Language',
    'Proxy Discrimination'
  ],
  analysis: [
    {
      biasType: 'Age Bias',
      quote: 'energetic, young professionals and recent graduates',
      explanation: 'This language explicitly targets young people, which is illegal age discrimination under the Age Discrimination in Employment Act (ADEA). It excludes experienced professionals and implies older candidates are unwelcome.',
      fixSuggestion: 'Replace with "motivated professionals with relevant skills and experience." Focus on qualifications, not age indicators.'
    },
    {
      biasType: 'Socio-economic Bias',
      quote: 'top-tier universities (Ivy League or equivalent)',
      explanation: 'Ivy League attendance correlates strongly with family wealth and race. This criterion screens out equally qualified candidates who attended state or community colleges, creating proxy discrimination against lower-income applicants.',
      fixSuggestion: 'Replace with "a degree in Computer Science or related field, or equivalent practical experience." This opens the role to self-taught engineers and bootcamp graduates.'
    },
    {
      biasType: 'Location Bias',
      quote: 'must reside within 20 miles of our downtown headquarters',
      explanation: 'Geographic restrictions disproportionately exclude lower-income candidates who cannot afford housing near expensive city centers, and may correlate with racial segregation patterns in housing.',
      fixSuggestion: 'Remove geographic restriction or offer relocation assistance. Consider hybrid/remote options to attract diverse talent.'
    },
    {
      biasType: 'Exclusionary Language',
      quote: 'cultural fit with our dynamic, youthful team',
      explanation: '"Cultural fit" is a highly subjective term that has been shown to perpetuate homogeneity and allows unconscious bias in hiring decisions. It often excludes people of different races, ages, or backgrounds.',
      fixSuggestion: 'Replace with "culture add" — describe specific values or working styles (e.g., "collaborative, curious, and direct communicators") rather than vague cultural fit.'
    },
    {
      biasType: 'Proxy Discrimination',
      quote: 'Applicants with gaps in their employment history need not apply',
      explanation: 'Employment gaps disproportionately affect women (due to caregiving), people with disabilities, and those who experienced economic hardship. This blanket exclusion is a form of indirect discrimination.',
      fixSuggestion: 'Remove this criterion entirely. Assess candidates on their current skills and portfolio, not their employment continuity.'
    }
  ],
  rewrittenText: `Job Posting: Senior Software Engineer

We are looking for motivated and skilled software engineers to join our collaborative team. We welcome applications from people of all backgrounds, experiences, and career paths.

Requirements:
- Demonstrated proficiency in software engineering through work experience, open-source contributions, or a portfolio of projects
- Strong problem-solving skills and ability to work effectively with a team
- Experience building scalable, maintainable software systems
- Clear and effective communication skills

We offer:
- Flexible/hybrid work arrangements
- Competitive compensation based on skills and market data (not prior salary history)
- Relocation assistance if needed

We are an equal opportunity employer committed to building a diverse and inclusive team. We encourage applications from candidates of all ages, backgrounds, education levels, and career trajectories.`,
  confidence: 94
};
