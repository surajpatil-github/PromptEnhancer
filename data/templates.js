module.exports = {
  system:
    "You are a prompt engineering expert. Your task is to enhance the given prompt using the specified technique. DO NOT include any explanations, headers, labels, or brackets. Provide ONLY the enhanced prompt text itself with no additional text or formatting.",
  system_multiple:
    "You are a prompt engineering expert. Your task is to enhance the given prompt by incorporating multiple prompt engineering techniques. DO NOT include any explanations, headers, labels, or brackets. Provide ONLY the enhanced prompt text itself with no additional text or formatting.",
  lang_eng: "Please provide the response in English only.",
  lang_default:
    "Please provide the response in the same language as the input prompt.",

  // Basic techniques
  clarity:
    "Enhance the clarity of this prompt by making it more specific and removing ambiguity: {prompt}",
  context:
    "Add relevant context to make this prompt more comprehensive: {prompt}",
  constraints:
    "Add specific constraints and requirements to this prompt: {prompt}",
  examples: "Add relevant examples to illustrate the expected output: {prompt}",

  // Advanced techniques
  chain_of_thought:
    "Modify this prompt to encourage step-by-step reasoning: {prompt}",
  few_shot:
    "Add a few examples of input-output pairs to guide the response: {prompt}",
  role_play:
    "Frame this prompt as a conversation with a specific expert role: {prompt}",

  // Simpler versions for multiple application
  clarity_simpler: "Make it more specific and remove ambiguity",
  context_simpler: "Add relevant context",
  constraints_simpler: "Add specific constraints",
  examples_simpler: "Add relevant examples",
  chain_of_thought_simpler: "Encourage step-by-step reasoning",
  few_shot_simpler: "Add input-output examples",
  role_play_simpler: "Frame as expert conversation",

  // Follow-up questions
  follow_up:
    "Based on the user's request '{prompt}', generate 3-5 relevant follow-up questions that would help clarify and enhance their request. Format the response as a JSON array of questions. Make the questions clear, specific, and focused on gathering important details.",
};
