import { fal } from "./falClient";
import { FRONT_VIEW_PROMPT, BACK_VIEW_PROMPT, CLOSEUP_VIEW_PROMPT, LOCATION_VIEW_PROMPT, OUTDOOR_BACKGROUND_PROMPT } from "./prompt";

export type AIModelId = "fal-ai/fashn/tryon/v1.5" | "fal-ai/idm-vton" | "fal-ai/nano-banana-pro/edit";
export type ViewMode = "front" | "back" | "closeup" | "location" | "location-closeup";

export interface GenerationParams {
  modelId: AIModelId;
  garmentImageUrl: string;
  modelImageUrl: string;
  seed?: number;
  quality?: "performance" | "balanced" | "quality";
  numSamples?: number;
  viewMode?: ViewMode;
  locationImageUrl?: string;
  height?: string;
  weight?: string;
}

const getPromptForView = (viewMode: ViewMode): string => {
  switch (viewMode) {
    case "back":
      return BACK_VIEW_PROMPT;
    case "closeup":
      return CLOSEUP_VIEW_PROMPT;
    case "location":
      return LOCATION_VIEW_PROMPT;
    case "location-closeup":
      return OUTDOOR_BACKGROUND_PROMPT;
    case "front":
    default:
      return FRONT_VIEW_PROMPT;
  }
};

const getDescriptionForView = (viewMode: ViewMode): string => {
  switch (viewMode) {
    case "back":
      return "The gown design, silhouette, lace embroidery, corset structure, and satin overskirt must remain identical to the reference dress. Elegant professional bridal couture transfer onto model — STRICT BACK VIEW. Model facing away from camera. Centered symmetrical back composition. Show back of dress, corset back, train. Face must NOT be visible.";
    case "closeup":
      return "The gown design, silhouette, lace embroidery, corset structure, and satin overskirt must remain identical to the reference dress. Elegant professional bridal couture transfer — EXTREME CLOSE-UP DETAIL. Macro photography of dress fabric, lace patterns, beadwork, embroidery. Tight crop on bodice/torso. 50mm macro lens style.";
    case "location":
      return "The gown design, silhouette, lace embroidery, corset structure, and satin overskirt must remain identical to the reference dress. Elegant professional bridal couture transfer onto model — ON-LOCATION SHOOT. Place the dressed model naturally into the venue/location environment. Match lighting, perspective, and atmosphere of the location.";
    case "location-closeup":
      return "The gown design, silhouette, lace embroidery, corset structure, and satin overskirt must remain identical to the reference dress. Create an outdoor luxury fashion photography background for waist-up bridal portrait. No people. Historic European castle with botanical garden. Cinematic depth of field.";
    case "front":
    default:
      return "The gown design, silhouette, lace embroidery, corset structure, and satin overskirt must remain identical to the reference dress. Elegant professional bridal couture transfer onto model";
  }
};

const buildBodyContext = (height?: string, weight?: string): string => {
  if (!height && !weight) return "";

  const h = parseFloat(height || "0");
  const w = parseFloat(weight || "0");

  let description = "\n\n------------------------------------------------\nCUSTOMER BODY MEASUREMENTS\n------------------------------------------------\n";

  if (h > 0) {
    const heightCategory = h < 158 ? "petite short stature" : h < 168 ? "average height" : h < 178 ? "tall" : "very tall";
    description += `Height: ${h}cm (${heightCategory})\n`;
  }

  if (w > 0 && h > 0) {
    const bmi = w / ((h / 100) ** 2);
    let bodyType: string;
    let silhouetteNote: string;
    if (bmi < 18.5) {
      bodyType = "slim, slender figure";
      silhouetteNote = "narrow waist and slim hips, lean proportions";
    } else if (bmi < 22) {
      bodyType = "slim to average figure";
      silhouetteNote = "balanced waist-to-hip ratio, natural proportions";
    } else if (bmi < 25) {
      bodyType = "average figure";
      silhouetteNote = "moderate curves, natural feminine proportions";
    } else if (bmi < 28) {
      bodyType = "slightly curvy figure";
      silhouetteNote = "fuller hips, defined waist with soft curves";
    } else if (bmi < 32) {
      bodyType = "curvy full figure";
      silhouetteNote = "generous curves, fuller bust and hips, corset should accommodate fuller torso";
    } else {
      bodyType = "plus-size full figure";
      silhouetteNote = "full curvy proportions, the dress draping must reflect fuller body volume";
    }
    description += `Weight: ${w}kg | BMI: ${bmi.toFixed(1)} | Body type: ${bodyType}\n`;
    description += `Silhouette note: ${silhouetteNote}\n`;
  } else if (w > 0) {
    description += `Weight: ${w}kg\n`;
  }

  description += `\nCRITICAL: The model's body proportions in the generated image MUST accurately reflect the above measurements. The dress must fit and drape according to these real body proportions. Do NOT use a generic model body — adapt to the specified measurements.\n------------------------------------------------`;

  return description;
};

export const generateBridalImage = async (params: GenerationParams, onUpdate?: (update: any) => void) => {
  const { modelId, garmentImageUrl, modelImageUrl, seed, quality = "balanced", numSamples = 1, viewMode = "front", locationImageUrl, height, weight } = params;

  const bodyContext = buildBodyContext(height, weight);

  if (modelId === "fal-ai/fashn/tryon/v1.5") {
    return await fal.subscribe("fal-ai/fashn/tryon/v1.5", {
      input: {
        model_image: modelImageUrl,
        garment_image: garmentImageUrl,
        category: "one-pieces",
        mode: quality,
        garment_photo_type: "model",
        num_samples: numSamples,
        seed: seed,
        output_format: "png"
      },
      logs: true,
      onQueueUpdate: onUpdate
    });
  }

  if (modelId === "fal-ai/idm-vton") {
    return await fal.subscribe("fal-ai/idm-vton", {
      input: {
        human_image_url: modelImageUrl,
        garment_image_url: garmentImageUrl,
        description: getDescriptionForView(viewMode) + bodyContext,
        num_inference_steps: 50,
        seed: seed
      },
      logs: true,
      onQueueUpdate: onUpdate
    });
  }

  // Nano Banana Pro Edit — use view-specific prompt with input images
  const imageUrls = [garmentImageUrl, modelImageUrl];
  if ((viewMode === "location" || viewMode === "location-closeup") && locationImageUrl) {
    imageUrls.push(locationImageUrl);
  }

  return await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input: {
      prompt: getPromptForView(viewMode) + bodyContext,
      image_urls: imageUrls,
      num_images: numSamples,
      resolution: "2K",
      aspect_ratio: "auto",
      output_format: "png",
    } as any,
    logs: true,
    onQueueUpdate: onUpdate
  });
};

export const uploadFile = async (file: File) => {
  return await fal.storage.upload(file);
};
