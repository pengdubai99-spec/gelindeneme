import { fal } from "@fal-ai/client";

export interface VideoGenerationParams {
  imageUrl: string;
  duration?: number;
}

// ULTRA VOGUE FASHION CAMERA SYSTEM – VIDEO VERSION
// Locked master prompt for all video generations
export const VIDEO_LOCKED_PROMPT = `ULTRA VOGUE FASHION CAMERA SYSTEM – VIDEO

The output must be a luxury high-fashion editorial video, visually matching the style of a Vogue or Harper's Bazaar fashion campaign film.

Professional fashion cinematography aesthetics.

The input image must be used as the starting frame of the video.

The system should animate the scene while preserving the exact identity of the model, garment, and hairstyle.

INPUT REFERENCES

Image 1
Couture dress reference (GARMENT LOCK)

Image 2
Female model reference with ballerina bun (MODEL LOCK)

The uploaded image becomes the first frame of the video.

GLOBAL RULE

STRICT REFERENCE-BASED VIDEO GENERATION.

The dress, model identity, and hairstyle must remain identical to the reference images throughout the entire video.

Only camera movement, natural motion, and environment dynamics may change.

GARMENT LOCK

Treat the dress as a locked couture fashion product.

Preserve exactly:

• embroidery pattern
• beadwork placement
• dress silhouette
• neckline structure
• sleeve design
• fabric texture
• seam lines

The dress must not change or morph during the video.

Fabric may show natural movement caused by wind.

No redesign allowed.

MODEL LOCK

Use the same model from Image 2.

Preserve exactly:

• facial structure
• eyes
• lips
• skin tone
• body proportions

The model identity must remain 100% consistent across all frames.

HAIR LOCK

Hair must remain exactly the same as Image 2.

Preserve:

• ballerina bun
• hair color
• bun shape
• hair volume

No hairstyle change.

Hair may have very subtle natural movement from outdoor breeze.

ENVIRONMENT LOCK – OUTDOOR

This scene MUST take place outdoors.

The model is standing in a magnificent botanical garden in front of a historic white European palace.

Environment details:

• large elegant white palace architecture
• grand botanical garden
• manicured symmetrical hedges
• blooming flowers and roses
• classical stone sculptures
• elegant garden pathways
• tall trees surrounding the garden

The palace must remain visible behind the garden.

The scene must clearly appear outdoor and expansive.

CINEMATIC MOTION

Create subtle fashion campaign motion.

Possible natural movements:

• gentle breeze moving the dress fabric
• subtle movement in flowers and tree leaves
• soft natural sunlight shifting across the fabric
• slight movement of the model's posture
• slow breathing and natural micro-expressions

The motion should feel elegant, slow, and cinematic.

CAMERA MOVEMENT

Professional fashion cinematography.

Shot on an 85mm fashion portrait lens.

Camera motion:

• slow cinematic push-in
• gentle lateral dolly movement
• subtle handheld stabilization like luxury fashion film

Maintain:

• shallow cinematic depth of field
• strong subject separation from background
• elegant editorial framing

The camera must always prioritize the couture dress details.

LIGHTING

Professional outdoor fashion lighting.

• natural daylight
• golden hour softness
• soft shadows
• elegant highlight rolloff on skin and fabric

Embroidery and beadwork must sparkle subtly in sunlight.

Lighting must feel natural and cinematic.

MODEL DIRECTION

High fashion editorial performance.

• confident editorial posture
• subtle body angle shifts
• calm luxury expression
• cool fashion gaze toward camera or slightly off-camera

Movement must remain minimal and sophisticated.

VIDEO STYLE

Luxury fashion campaign film.

• cinematic editorial photography style
• Vogue runway campaign aesthetic
• high-end magazine video look

Prioritize couture fabric detail and texture.

Embroidery and beadwork must remain extremely sharp and highly detailed.

CAMERA SYSTEM

Ultra Vogue fashion cinematography.

• shallow depth of field
• natural background blur
• luxury editorial framing
• professional fashion campaign composition

VIDEO QUALITY

Ultra photorealistic
8K fashion campaign quality
hyper detailed couture fabric
cinematic luxury advertising aesthetic

NEGATIVE

No indoor scene
No studio environment
No palace interior
No ballroom
No walls or ceilings
No dress redesign
No hairstyle change
No face change
No identity drift
No fabric pattern change

The scene must remain a wide outdoor palace garden environment with cinematic landscape depth.`;

export const generateVideoFromImage = async (
  params: VideoGenerationParams,
  onUpdate?: (msg: string) => void
): Promise<string> => {
  const { imageUrl, duration = 8 } = params;

  const result = await fal.subscribe("fal-ai/veo3", {
    input: {
      prompt: VIDEO_LOCKED_PROMPT,
      image_url: imageUrl,
      duration: duration,
      aspect_ratio: "9:16",
    } as any,
    logs: true,
    onQueueUpdate: (update: any) => {
      if (update.status === "IN_PROGRESS" && onUpdate) {
        const lastLog = update.logs?.[update.logs.length - 1]?.message;
        if (lastLog) onUpdate(lastLog);
      }
    },
  });

  // fal.ai video response structure
  const data = (result as any).data;
  if (data?.video?.url) return data.video.url;
  if (data?.video_url) return data.video_url;
  if (data?.url) return data.url;

  throw new Error("Video URL bulunamadı. API yanıtını kontrol edin.");
};
