import { fal } from "@fal-ai/client";
import { FRONT_VIEW_PROMPT, BACK_VIEW_PROMPT, CLOSEUP_VIEW_PROMPT, LOCATION_VIEW_PROMPT } from "./prompt";

export type AIModelId = "fal-ai/fashn/tryon/v1.5" | "fal-ai/idm-vton" | "fal-ai/nano-banana-pro/edit";
export type ViewMode = "front" | "back" | "closeup" | "location";

export interface GenerationParams {
  modelId: AIModelId;
  garmentImageUrl: string;
  modelImageUrl: string;
  seed?: number;
  quality?: "performance" | "balanced" | "quality";
  numSamples?: number;
  viewMode?: ViewMode;
  locationImageUrl?: string;
}

const getPromptForView = (viewMode: ViewMode): string => {
  switch (viewMode) {
    case "back":
      return BACK_VIEW_PROMPT;
    case "closeup":
      return CLOSEUP_VIEW_PROMPT;
    case "location":
      return LOCATION_VIEW_PROMPT;
    case "front":
    default:
      return FRONT_VIEW_PROMPT;
  }
};

const getDescriptionForView = (viewMode: ViewMode): string => {
  switch (viewMode) {
    case "back":
      return "Elegant professional bridal couture transfer onto model — STRICT BACK VIEW. Model facing away from camera. Centered symmetrical back composition. Show back of dress, corset back, train. Face must NOT be visible.";
    case "closeup":
      return "Elegant professional bridal couture transfer — EXTREME CLOSE-UP DETAIL. Macro photography of dress fabric, lace patterns, beadwork, embroidery. Tight crop on bodice/torso. 50mm macro lens style.";
    case "location":
      return "Elegant professional bridal couture transfer onto model — ON-LOCATION SHOOT. Place the dressed model naturally into the venue/location environment. Match lighting, perspective, and atmosphere of the location.";
    case "front":
    default:
      return "Elegant professional bridal couture transfer onto model";
  }
};

export const generateBridalImage = async (params: GenerationParams, onUpdate?: (update: any) => void) => {
  const { modelId, garmentImageUrl, modelImageUrl, seed, quality = "balanced", numSamples = 1, viewMode = "front", locationImageUrl } = params;

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
        description: getDescriptionForView(viewMode),
        num_inference_steps: 50,
        seed: seed
      },
      logs: true,
      onQueueUpdate: onUpdate
    });
  }

  // Nano Banana Pro — use view-specific prompt
  const imageUrls = [garmentImageUrl, modelImageUrl];
  if (viewMode === "location" && locationImageUrl) {
    imageUrls.push(locationImageUrl);
  }

  const input: any = {
    prompt: getPromptForView(viewMode),
    image_urls: imageUrls,
    num_images: numSamples,
    resolution: "2K",
    aspect_ratio: "auto",
    output_format: "png",
    seed: seed
  };
  return await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input,
    logs: true,
    onQueueUpdate: onUpdate
  });
};

export const uploadFile = async (file: File) => {
  return await fal.storage.upload(file);
};
