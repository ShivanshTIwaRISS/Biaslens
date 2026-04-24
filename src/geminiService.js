import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const JSON_SCHEMA = `Return this exact JSON structure:
{
  "riskLevel": "Low" | "Medium" | "High",
  "biasScore": <integer 0-100, where 0 = perfectly fair, 100 = severely biased>,
  "detectedBiases": ["<array of bias category names found>"],
  "analysis": [
    {
      "biasType": "<Category of bias>",
      "quote": "<Exact problematic phrase/pattern from the input>",
      "explanation": "<Plain language explanation of why this is unfair or discriminatory>",
      "fixSuggestion": "<Specific, actionable recommendation to fix this issue>"
    }
  ],
  "rewrittenText": "<A complete, fully rewritten/corrected version of the input that removes all biases while preserving the core intent>",
  "confidence": <integer 0-100, your confidence in this analysis>
}

Rules:
- biasScore 0-20 → riskLevel "Low"
- biasScore 21-60 → riskLevel "Medium"
- biasScore 61-100 → riskLevel "High"
- If input is nonsensical or irrelevant, return biasScore 0, riskLevel "Low", empty detectedBiases, empty analysis, and rewrittenText as the original input.
- Be specific. Quote exact phrases/patterns. Never fabricate quotes not in the text.
- The rewrittenText must be complete and ready to use, not just a partial fix.
- Do NOT return markdown code blocks. Return raw JSON only.`;

const BIAS_CATEGORIES = `You detect the following categories of bias:
- Gender bias (assumptions or preferences based on gender)
- Age bias (discrimination based on age, e.g., "recent graduates", "energetic")
- Racial or ethnic bias (direct or proxy discrimination by race/ethnicity)
- Disability bias (excluding or disadvantaging people with disabilities)
- Socio-economic bias (favoring wealthy or penalizing low-income backgrounds)
- Location bias (zip code, neighborhood, rural/urban discrimination)
- Proxy discrimination (neutral-sounding criteria that correlate with protected characteristics)
- Exclusionary or subjective language (vague terms like "cultural fit", "professional appearance")
- Inconsistent standards (applying different criteria to similar groups)
- Unequal treatment (different rules for different groups)`;

const SYSTEM_PROMPTS = {
  policy: `You are an expert AI Fairness and Ethics Auditor with deep knowledge of discrimination law, algorithmic bias, and ethical AI. Your job is to analyze decision-making policies, guidelines, and rules for hidden biases and unfairness.

${BIAS_CATEGORIES}

You MUST return ONLY a valid JSON object. No markdown. No explanation outside JSON. Analyze carefully and be specific.

${JSON_SCHEMA}`,

  dataset: `You are an expert AI Fairness and Data Ethics Auditor. Your job is to analyze datasets (CSV/tabular data) for hidden biases, discriminatory patterns, and unfair feature distributions.

When analyzing dataset samples, look for:
1. **Protected attribute correlations** — Does a protected attribute (gender, race, age, disability) correlate with the outcome (hired, approved, etc.)?
2. **Proxy features** — Do seemingly neutral columns (zip_code, university_tier, referral_source) serve as proxies for protected characteristics?
3. **Class imbalance** — Is one demographic group disproportionately represented in positive vs negative outcomes?
4. **Feature selection bias** — Are columns included that shouldn't influence fair decisions (e.g., marital_status for a job, race for a loan)?
5. **Label bias** — Does the historical labeling pattern reflect past discrimination?
6. **Disparate impact** — Would decisions based on this data affect protected groups at significantly different rates?

${BIAS_CATEGORIES}

You MUST return ONLY a valid JSON object. No markdown. No explanation outside JSON.

${JSON_SCHEMA}

For datasets, in the "quote" field, cite the specific data pattern (e.g., "All 6 female applicants were rejected while 5/6 males were accepted"). In "rewrittenText", provide specific recommendations for dataset remediation (removing biased columns, resampling, relabeling, etc.) rather than rewriting the CSV itself.`,

  model: `You are an expert AI Fairness Auditor specializing in algorithmic decision auditing. Your job is to analyze the OUTPUTS of AI/ML models (decision logs, scoring results, prediction summaries) to detect disparate impact and discriminatory patterns.

When analyzing model decisions, look for:
1. **Disparate impact** — Are acceptance/rejection rates significantly different across demographic groups?
2. **Score disparities** — Are scores systematically lower for certain groups even with similar qualifications?
3. **Threshold bias** — Does the model appear to apply different effective thresholds to different groups?
4. **Feature weighting bias** — Does the model appear to over-weight proxy features (school prestige, zip code) that correlate with race or socio-economic status?
5. **Intersectional bias** — Is the bias worse for people at the intersection of multiple protected characteristics (e.g., older + female + minority)?
6. **Qualification paradox** — Are highly qualified members of one group scored lower than less qualified members of another?

${BIAS_CATEGORIES}

You MUST return ONLY a valid JSON object. No markdown. No explanation outside JSON.

${JSON_SCHEMA}

For model outputs, in the "quote" field, cite the specific decision pattern (e.g., "Candidate B: 34F, Black, 3.9 GPA → REJECTED (41) vs Candidate G: 25M, White, 3.4 GPA → ACCEPTED (81)"). In "rewrittenText", provide actionable recommendations for model remediation (retraining, feature removal, fairness constraints, regular auditing) rather than rewriting individual decisions.`
};

const USER_PROMPTS = {
  policy: (text) => `Please analyze the following policy/rule for bias and fairness issues:\n\n---\n${text}\n---`,
  dataset: (text) => `Please analyze the following dataset sample for bias and fairness issues. Examine the column headers, data distributions, and the relationship between demographic features and the outcome column:\n\n---\n${text}\n---`,
  model: (text) => `Please analyze the following AI model decision log for disparate impact and discriminatory patterns. Look at acceptance/rejection rates and scores across demographic groups:\n\n---\n${text}\n---`
};

export async function analyzeForBias(inputText, apiKey, mode = 'policy') {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key is required. Please enter your Google Gemini API key.');
  }

  if (!inputText || inputText.trim().length < 10) {
    throw new Error('Please enter more text to analyze (at least 10 characters).');
  }

  const cleanKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanKey);
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.policy;
  const userPrompt = (USER_PROMPTS[mode] || USER_PROMPTS.policy)(inputText.trim());

  // Helper function to try a specific model
  const attemptModel = async (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        // Only use JSON response type for models that definitely support it
        ...(modelName.includes('1.5') || modelName.includes('2.0') || modelName.includes('gemini-exp') ? { responseMimeType: 'application/json' } : {})
      }
    });

    const result = await model.generateContent(userPrompt);
    const rawText = result.response.text();

    if (!rawText) throw new Error('Empty response');

    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.biasScore !== 'number' || !parsed.riskLevel) {
      throw new Error('Invalid JSON format returned.');
    }
    return parsed;
  };

  try {
    // 1. Fast path: try the standard model first
    try {
      return await attemptModel('gemini-1.5-flash');
    } catch (err) {
      // If it's explicitly an API key error, halt immediately
      if (err.message && err.message.includes('API key not valid')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      console.warn('Standard model failed, attempting dynamic model discovery...', err.message);
    }

    // 2. Dynamic Discovery Path: If the standard model fails (e.g. 404), fetch the list of explicitly available models
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
    
    if (!modelsResponse.ok) {
      throw new Error(`Failed to discover models (Status ${modelsResponse.status})`);
    }

    const modelsData = await modelsResponse.json();
    
    // Filter for models that support text generation (generateContent)
    const availableModels = (modelsData.models || [])
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name.replace('models/', ''))
      .filter(name => name.includes('gemini')); // Ensure it's a gemini model

    if (availableModels.length === 0) {
      throw new Error('Your API key does not have access to any text generation models.');
    }

    console.log("Dynamically discovered models:", availableModels);

    // Sort to prioritize the best models
    const sortedModels = availableModels.sort((a, b) => {
      const score = (name) => {
        if (name.includes('2.0-flash')) return 100;
        if (name.includes('1.5-flash')) return 90;
        if (name.includes('1.5-pro')) return 80;
        if (name.includes('flash')) return 70;
        if (name.includes('pro')) return 60;
        return 0;
      };
      return score(b) - score(a);
    });

    // Try the top 3 discovered models
    let lastError = null;
    for (const modelName of sortedModels.slice(0, 3)) {
      try {
        console.log(`Dynamically attempting model: ${modelName}`);
        return await attemptModel(modelName);
      } catch (err) {
        console.warn(`Discovered model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error('All dynamically discovered models failed.');

  } catch (err) {
    console.error("Gemini API Error:", err);
    
    // Catch massive JSON 429 quota errors and make them readable for the UI
    if (err.message && err.message.includes('429') && err.message.includes('quota')) {
      throw new Error(
        "Google API Quota Exceeded: Your API key's free tier limit is 0. " +
        "This usually happens if your Google account is in a region that requires a billing account for API access (like parts of Europe), or you've hit your daily limit. " +
        "Try using a different Google account or enable billing at aistudio.google.com."
      );
    }
    
    // Catch API key invalid errors cleanly
    if (err.message && err.message.includes('API key not valid')) {
      throw new Error('Invalid API key. Please double check your Google Gemini API key.');
    }
    
    throw new Error(err.message || 'Failed to analyze text. Please try again.');
  }
}
