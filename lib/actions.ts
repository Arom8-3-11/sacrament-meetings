"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  addMeeting,
  deleteMeeting as deleteMeetingRecord,
  isValidIsoDate,
  updateMeeting as updateMeetingRecord,
  type MeetingInput,
} from "@/lib/meetings-db";
import { hasIntermediateHymn } from "@/lib/meeting-type";
import type { SpeakerItem } from "@/lib/types";

const meetingTypes = ["testimony", "regular", "stake", "general", "special"] as const;

const speakerLinesSchema = z
  .string()
  .superRefine((value, context) => {
    const lines = value.split(/\r?\n/).filter((line) => line.trim());

    lines.forEach((line, index) => {
      const [type, name, topic, ...extra] = line.split("|").map((part) => part.trim());
      if (
        extra.length > 0 ||
        (type !== "speaker" && type !== "musical-number") ||
        !name ||
        !topic
      ) {
        context.addIssue({
          code: "custom",
          message: `Line ${index + 1} must be "speaker | name | topic" or "musical-number | name | topic".`,
        });
      }
    });
  })
  .transform((value): SpeakerItem[] =>
    value
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => {
        const [type, name, ...topicParts] = line.split("|").map((part) => part.trim());
        return {
          type: type === "musical-number" ? "musical-number" : "speaker",
          name,
          topic: topicParts.join(" | "),
        };
      }),
  );

const hymnNumberSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d*$/, "Enter a hymn number greater than zero.")
  .transform(Number)
  .pipe(z.number().int().positive());

const MeetingFormSchema = z.object({
  date: z.string().refine(isValidIsoDate, "Enter a valid date."),
  meetingType: z.enum(meetingTypes),
  presiding: z.string().trim().min(1, "Enter the name of the presiding leader."),
  conducting: z.string().trim().min(1, "Enter the name of the conducting leader."),
  announcements: z.string().transform((value) =>
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  ),
  openingHymnNumber: hymnNumberSchema,
  openingHymnTitle: z.string().trim().min(1, "Enter the opening hymn title."),
  openingPrayer: z.string().trim().min(1, "Enter the opening prayer assignment."),
  wardBusiness: z.string().transform((value) =>
    value
      .split(/\r?\n/)
      .map((description) => description.trim())
      .filter(Boolean)
      .map((description) => ({ description })),
  ),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumberSchema,
  sacramentHymnTitle: z.string().trim().min(1, "Enter the sacrament hymn title."),
  intermediateHymnNumber: z.string().trim(),
  intermediateHymnTitle: z.string().trim(),
  speakers: speakerLinesSchema,
  closingHymnNumber: hymnNumberSchema,
  closingHymnTitle: z.string().trim().min(1, "Enter the closing hymn title."),
  closingPrayer: z.string().trim().min(1, "Enter the closing prayer assignment."),
}).superRefine((value, context) => {
  if (!hasIntermediateHymn(value.meetingType)) {
    return;
  }

  if (!hymnNumberSchema.safeParse(value.intermediateHymnNumber).success) {
    context.addIssue({
      code: "custom",
      path: ["intermediateHymnNumber"],
      message: "Enter an intermediate hymn number greater than zero.",
    });
  }
  if (!value.intermediateHymnTitle) {
    context.addIssue({
      code: "custom",
      path: ["intermediateHymnTitle"],
      message: "Enter the intermediate hymn title.",
    });
  }
});

type FormField = keyof z.input<typeof MeetingFormSchema>;
type TextFormField = Exclude<FormField, "stakeBusiness">;

export type MeetingFormValues = Record<TextFormField, string> & {
  stakeBusiness: boolean;
};

export type MeetingFormState = {
  message: string;
  errors?: Partial<Record<FormField, string[]>>;
  values?: MeetingFormValues;
};

export type MeetingFormAction = (
  previousState: MeetingFormState,
  formData: FormData,
) => Promise<MeetingFormState>;

function getTextValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readMeetingForm(formData: FormData) {
  return {
    date: getTextValue(formData, "date"),
    meetingType: getTextValue(formData, "meetingType"),
    presiding: getTextValue(formData, "presiding"),
    conducting: getTextValue(formData, "conducting"),
    announcements: getTextValue(formData, "announcements"),
    openingHymnNumber: getTextValue(formData, "openingHymnNumber"),
    openingHymnTitle: getTextValue(formData, "openingHymnTitle"),
    openingPrayer: getTextValue(formData, "openingPrayer"),
    wardBusiness: getTextValue(formData, "wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "on",
    sacramentHymnNumber: getTextValue(formData, "sacramentHymnNumber"),
    sacramentHymnTitle: getTextValue(formData, "sacramentHymnTitle"),
    intermediateHymnNumber: getTextValue(formData, "intermediateHymnNumber"),
    intermediateHymnTitle: getTextValue(formData, "intermediateHymnTitle"),
    speakers: getTextValue(formData, "speakers"),
    closingHymnNumber: getTextValue(formData, "closingHymnNumber"),
    closingHymnTitle: getTextValue(formData, "closingHymnTitle"),
    closingPrayer: getTextValue(formData, "closingPrayer"),
  };
}

function toMeetingInput(
  parsed: z.output<typeof MeetingFormSchema>,
): MeetingInput {
  return {
    date: parsed.date,
    meetingType: parsed.meetingType,
    presiding: parsed.presiding,
    conducting: parsed.conducting,
    announcements: parsed.announcements,
    openingHymn: {
      number: parsed.openingHymnNumber,
      title: parsed.openingHymnTitle,
    },
    openingPrayer: parsed.openingPrayer,
    wardBusiness: parsed.wardBusiness,
    stakeBusiness: parsed.stakeBusiness,
    sacramentHymn: {
      number: parsed.sacramentHymnNumber,
      title: parsed.sacramentHymnTitle,
    },
    intermediateHymn: hasIntermediateHymn(parsed.meetingType)
      ? {
          number: Number(parsed.intermediateHymnNumber),
          title: parsed.intermediateHymnTitle,
        }
      : null,
    speakers: parsed.speakers,
    closingHymn: {
      number: parsed.closingHymnNumber,
      title: parsed.closingHymnTitle,
    },
    closingPrayer: parsed.closingPrayer,
  };
}

export async function createMeeting(
  previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  void previousState;
  const validation = MeetingFormSchema.safeParse(readMeetingForm(formData));

  if (!validation.success) {
    return {
      message: "Please correct the errors below and try again.",
      errors: validation.error.flatten().fieldErrors,
      values: readMeetingForm(formData),
    };
  }

  try {
    await addMeeting(toMeetingInput(validation.data));
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw new Error("Unable to create the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  void previousState;
  const parsedId = z.number().int().positive().safeParse(id);
  if (!parsedId.success) {
    throw new Error("The meeting ID is invalid.");
  }

  const validation = MeetingFormSchema.safeParse(readMeetingForm(formData));

  if (!validation.success) {
    return {
      message: "Please correct the errors below and try again.",
      errors: validation.error.flatten().fieldErrors,
      values: readMeetingForm(formData),
    };
  }

  try {
    await updateMeetingRecord(parsedId.data, toMeetingInput(validation.data));
  } catch (error) {
    console.error(`Failed to update meeting ${parsedId.data}:`, error);
    throw new Error("Unable to update the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${parsedId.data}`);
  redirect("/meetings");
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const rawId = formData.get("id");
  const parsedId = z.string().regex(/^[1-9]\d*$/).safeParse(rawId);

  if (!parsedId.success || !Number.isSafeInteger(Number(parsedId.data))) {
    throw new Error("The meeting ID is invalid.");
  }

  const id = Number(parsedId.data);
  try {
    await deleteMeetingRecord(id);
  } catch (error) {
    console.error(`Failed to delete meeting ${id}:`, error);
    throw new Error("Unable to delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
}
