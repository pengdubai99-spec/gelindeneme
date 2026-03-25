import { fal } from "./falClient";
import { FRONT_VIEW_PROMPT, BACK_VIEW_PROMPT, CLOSEUP_VIEW_PROMPT, LOCATION_VIEW_PROMPT, OUTDOOR_BACKGROUND_PROMPT } from "./prompt";

export type AIModelId = "fal-ai/fashn/tryon/v1.5" | "fal-ai/idm-vton" | "fal-ai/nano-banana-pro/edit";
export type ViewMode = "front" | "back" | "closeup" | "location" | "location-closeup";
export type BodyShape = "apple" | "pear" | "hourglass" | "rectangle" | "inverted-triangle";
export type BoneStructure = "small" | "medium" | "large";

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
  bodyShape?: BodyShape | "";
  boneStructure?: BoneStructure | "";
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

const BODY_SHAPE_DESCRIPTIONS: Record<BodyShape, { name: string; detail: string }> = {
  apple: {
    name: "apple body shape",
    detail: "weight concentrated in the midsection and belly area, wider waist, rounder abdomen, slimmer legs and hips relative to the midsection. The dress must accommodate a prominent belly and wider waist — fabric should drape over the rounded midsection naturally without pulling.",
  },
  pear: {
    name: "pear body shape",
    detail: "narrower shoulders and bust, significantly wider hips and thighs, fuller lower body. The skirt must accommodate wider hips and thighs while the bodice fits a narrower upper body.",
  },
  hourglass: {
    name: "hourglass body shape",
    detail: "balanced bust and hips with a distinctly narrow waist, pronounced curves both above and below the waist. The corset naturally cinches the narrow waist, skirt flows over full hips.",
  },
  rectangle: {
    name: "rectangle body shape",
    detail: "similar width at shoulders, waist, and hips with minimal curves. Straight silhouette without pronounced waist definition. The dress drapes more uniformly without strong waist cinching.",
  },
  "inverted-triangle": {
    name: "inverted triangle body shape",
    detail: "broad shoulders and wide upper body, narrower hips and waist. The upper bodice must accommodate broader shoulders while the skirt fits slimmer hips.",
  },
};

const BONE_STRUCTURE_DESCRIPTIONS: Record<BoneStructure, string> = {
  small: "small delicate bone frame — narrower joints, slender wrists and ankles, lighter skeletal build",
  medium: "medium bone frame — average joint width, proportionate skeletal build",
  large: "large heavy bone frame — wide joints, broad wrists and shoulders, heavier skeletal structure that creates a naturally bigger appearance even at lower weight",
};

const buildBodyContext = (height?: string, weight?: string, bodyShape?: BodyShape | "", boneStructure?: BoneStructure | ""): string => {
  const hasData = height || weight || bodyShape || boneStructure;
  if (!hasData) return "";

  const h = parseFloat(height || "0");
  const w = parseFloat(weight || "0");

  let description = "\n\n------------------------------------------------\nCUSTOMER BODY PROFILE — CRITICAL ACCURACY REQUIRED\n------------------------------------------------\n";

  if (h > 0) {
    const heightCategory = h < 158 ? "petite/short stature" : h < 168 ? "average height" : h < 178 ? "tall" : "very tall";
    description += `Height: ${h}cm (${heightCategory})\n`;
  }

  if (w > 0 && h > 0) {
    const bmi = w / ((h / 100) ** 2);
    let sizeClass: string;
    if (bmi < 18.5) sizeClass = "underweight/slim";
    else if (bmi < 22) sizeClass = "slim to average";
    else if (bmi < 25) sizeClass = "average weight";
    else if (bmi < 28) sizeClass = "slightly overweight";
    else if (bmi < 32) sizeClass = "overweight";
    else sizeClass = "significantly overweight/plus-size";
    description += `Weight: ${w}kg | BMI: ${bmi.toFixed(1)} (${sizeClass})\n`;
  } else if (w > 0) {
    description += `Weight: ${w}kg\n`;
  }

  if (bodyShape && BODY_SHAPE_DESCRIPTIONS[bodyShape]) {
    const s = BODY_SHAPE_DESCRIPTIONS[bodyShape];
    description += `\nBody shape: ${s.name}\nShape detail: ${s.detail}\n`;
  }

  if (boneStructure && BONE_STRUCTURE_DESCRIPTIONS[boneStructure]) {
    description += `\nBone structure: ${BONE_STRUCTURE_DESCRIPTIONS[boneStructure]}\n`;
  }

  description += `\nCRITICAL INSTRUCTION: The model body in the generated image MUST accurately reflect ALL of the above measurements and characteristics. Do NOT substitute a generic slim fashion model body. The dress fit, drape, fabric tension, and silhouette must physically match this customer's real body profile. Every body detail above is mandatory.\n------------------------------------------------`;

  return description;
};

export const generateBridalImage = async (params: GenerationParams, onUpdate?: (update: any) => void) => {
  const { modelId, garmentImageUrl, modelImageUrl, seed, quality = "balanced", numSamples = 1, viewMode = "front", locationImageUrl, height, weight, bodyShape, boneStructure } = params;

  const bodyContext = buildBodyContext(height, weight, bodyShape, boneStructure);

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
