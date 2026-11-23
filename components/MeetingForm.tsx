"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type {
  MeetingFormAction,
  MeetingFormState,
  MeetingFormValues,
} from "@/lib/actions";
import { hasIntermediateHymn } from "@/lib/meeting-type";
import type { MeetingType, SacramentMeeting } from "@/lib/types";

interface MeetingFormProps {
  action: MeetingFormAction;
  meeting?: SacramentMeeting;
}

const emptyState: MeetingFormState = { message: "" };

const inputClassName =
  "mt-1 block w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

function FieldError({
  id,
  messages,
}: {
  id: string;
  messages?: string[];
}) {
  return (
    <p id={`${id}-error`} aria-live="polite" className="mt-1 min-h-5 text-sm text-red-700">
      {messages?.join(" ")}
    </p>
  );
}

export default function MeetingForm({ action, meeting }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, emptyState);
  const errors = state.errors;
  const values: MeetingFormValues | undefined = state.values;
  const [meetingType, setMeetingType] = useState<MeetingType>(
    meeting?.meetingType ?? "regular",
  );
  const initialSpeakers =
    meeting?.speakers
      .map((speaker) => `${speaker.type} | ${speaker.name} | ${speaker.topic}`)
      .join("\n") ?? "";

  return (
    <form
      key={values ? JSON.stringify(values) : "initial"}
      action={formAction}
      className="mt-8 space-y-6"
    >
      {state.message && (
        <p role="status" aria-live="polite" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="font-medium">Meeting date</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={values?.date ?? meeting?.date ?? ""}
            aria-invalid={Boolean(errors?.date?.length)}
            aria-describedby="date-error"
            className={inputClassName}
          />
          <FieldError id="date" messages={errors?.date} />
        </div>
        <div>
          <label htmlFor="meetingType" className="font-medium">Meeting type</label>
          <select
            id="meetingType"
            name="meetingType"
            value={meetingType}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "testimony" ||
                value === "regular" ||
                value === "stake" ||
                value === "general" ||
                value === "special"
              ) {
                setMeetingType(value);
              }
            }}
            aria-invalid={Boolean(errors?.meetingType?.length)}
            aria-describedby="meetingType-error"
            className={inputClassName}
          >
            <option value="testimony">Testimony</option>
            <option value="regular">Regular</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
            <option value="special">Special</option>
          </select>
          <FieldError id="meetingType" messages={errors?.meetingType} />
        </div>
        <div>
          <label htmlFor="presiding" className="font-medium">Presiding leader</label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            defaultValue={values?.presiding ?? meeting?.presiding ?? ""}
            aria-invalid={Boolean(errors?.presiding?.length)}
            aria-describedby="presiding-error"
            className={inputClassName}
          />
          <FieldError id="presiding" messages={errors?.presiding} />
        </div>
        <div>
          <label htmlFor="conducting" className="font-medium">Conducting leader</label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            defaultValue={values?.conducting ?? meeting?.conducting ?? ""}
            aria-invalid={Boolean(errors?.conducting?.length)}
            aria-describedby="conducting-error"
            className={inputClassName}
          />
          <FieldError id="conducting" messages={errors?.conducting} />
        </div>
      </div>

      <div>
        <label htmlFor="announcements" className="font-medium">Announcements</label>
        <textarea
          id="announcements"
          name="announcements"
          rows={3}
          defaultValue={
            values?.announcements ?? meeting?.announcements?.join("\n") ?? ""
          }
          aria-invalid={Boolean(errors?.announcements?.length)}
          aria-describedby="announcements-help announcements-error"
          className={inputClassName}
        />
        <p id="announcements-help" className="text-sm text-[var(--color-muted)]">Enter one announcement per line.</p>
        <FieldError id="announcements" messages={errors?.announcements} />
      </div>

      <fieldset className="rounded-xl border border-[var(--color-line)] p-4">
        <legend className="px-1 text-lg font-semibold">Opening hymn and prayer</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="openingHymnNumber" className="font-medium">Hymn number</label>
            <input
              id="openingHymnNumber"
              name="openingHymnNumber"
              type="number"
              min="1"
              defaultValue={
                values?.openingHymnNumber ?? meeting?.openingHymn.number ?? ""
              }
              aria-invalid={Boolean(errors?.openingHymnNumber?.length)}
              aria-describedby="openingHymnNumber-error"
              className={inputClassName}
            />
            <FieldError id="openingHymnNumber" messages={errors?.openingHymnNumber} />
          </div>
          <div>
            <label htmlFor="openingHymnTitle" className="font-medium">Hymn title</label>
            <input
              id="openingHymnTitle"
              name="openingHymnTitle"
              type="text"
              defaultValue={values?.openingHymnTitle ?? meeting?.openingHymn.title ?? ""}
              aria-invalid={Boolean(errors?.openingHymnTitle?.length)}
              aria-describedby="openingHymnTitle-error"
              className={inputClassName}
            />
            <FieldError id="openingHymnTitle" messages={errors?.openingHymnTitle} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="openingPrayer" className="font-medium">Opening prayer</label>
            <input
              id="openingPrayer"
              name="openingPrayer"
              type="text"
              defaultValue={values?.openingPrayer ?? meeting?.openingPrayer ?? ""}
              aria-invalid={Boolean(errors?.openingPrayer?.length)}
              aria-describedby="openingPrayer-error"
              className={inputClassName}
            />
            <FieldError id="openingPrayer" messages={errors?.openingPrayer} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="wardBusiness" className="font-medium">Ward business</label>
        <textarea
          id="wardBusiness"
          name="wardBusiness"
          rows={3}
          defaultValue={
            values?.wardBusiness ??
            meeting?.wardBusiness.map((item) => item.description).join("\n") ??
            ""
          }
          aria-invalid={Boolean(errors?.wardBusiness?.length)}
          aria-describedby="wardBusiness-help wardBusiness-error"
          className={inputClassName}
        />
        <p id="wardBusiness-help" className="text-sm text-[var(--color-muted)]">Enter one business item per line.</p>
        <FieldError id="wardBusiness" messages={errors?.wardBusiness} />
      </div>

      <div>
        <input
          id="stakeBusiness"
          name="stakeBusiness"
          type="checkbox"
          defaultChecked={values?.stakeBusiness ?? meeting?.stakeBusiness ?? false}
          aria-invalid={Boolean(errors?.stakeBusiness?.length)}
          aria-describedby="stakeBusiness-error"
          className="mr-2 size-4 accent-[var(--color-primary)]"
        />
        <label htmlFor="stakeBusiness" className="font-medium">Include stake business</label>
        <FieldError id="stakeBusiness" messages={errors?.stakeBusiness} />
      </div>

      <fieldset className="rounded-xl border border-[var(--color-line)] p-4">
        <legend className="px-1 text-lg font-semibold">Sacrament hymn</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="sacramentHymnNumber" className="font-medium">Hymn number</label>
            <input
              id="sacramentHymnNumber"
              name="sacramentHymnNumber"
              type="number"
              min="1"
              defaultValue={
                values?.sacramentHymnNumber ??
                meeting?.sacramentHymn.number ??
                ""
              }
              aria-invalid={Boolean(errors?.sacramentHymnNumber?.length)}
              aria-describedby="sacramentHymnNumber-error"
              className={inputClassName}
            />
            <FieldError id="sacramentHymnNumber" messages={errors?.sacramentHymnNumber} />
          </div>
          <div>
            <label htmlFor="sacramentHymnTitle" className="font-medium">Hymn title</label>
            <input
              id="sacramentHymnTitle"
              name="sacramentHymnTitle"
              type="text"
              defaultValue={
                values?.sacramentHymnTitle ?? meeting?.sacramentHymn.title ?? ""
              }
              aria-invalid={Boolean(errors?.sacramentHymnTitle?.length)}
              aria-describedby="sacramentHymnTitle-error"
              className={inputClassName}
            />
            <FieldError id="sacramentHymnTitle" messages={errors?.sacramentHymnTitle} />
          </div>
        </div>
      </fieldset>

      <fieldset
        hidden={!hasIntermediateHymn(meetingType)}
        disabled={!hasIntermediateHymn(meetingType)}
        className="rounded-xl border border-[var(--color-line)] p-4"
      >
        <legend className="px-1 text-lg font-semibold">Intermediate hymn</legend>
        <p className="mb-3 text-sm text-[var(--color-muted)]">
          This hymn is sung between speakers.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="intermediateHymnNumber" className="font-medium">Hymn number</label>
            <input
              id="intermediateHymnNumber"
              name="intermediateHymnNumber"
              type="number"
              min="1"
              defaultValue={
                values?.intermediateHymnNumber ?? meeting?.intermediateHymn?.number ?? ""
              }
              aria-invalid={Boolean(errors?.intermediateHymnNumber?.length)}
              aria-describedby="intermediateHymnNumber-error"
              className={inputClassName}
            />
            <FieldError id="intermediateHymnNumber" messages={errors?.intermediateHymnNumber} />
          </div>
          <div>
            <label htmlFor="intermediateHymnTitle" className="font-medium">Hymn title</label>
            <input
              id="intermediateHymnTitle"
              name="intermediateHymnTitle"
              type="text"
              defaultValue={
                values?.intermediateHymnTitle ?? meeting?.intermediateHymn?.title ?? ""
              }
              aria-invalid={Boolean(errors?.intermediateHymnTitle?.length)}
              aria-describedby="intermediateHymnTitle-error"
              className={inputClassName}
            />
            <FieldError id="intermediateHymnTitle" messages={errors?.intermediateHymnTitle} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="speakers" className="font-medium">Speakers and musical numbers</label>
        <textarea
          id="speakers"
          name="speakers"
          rows={4}
          defaultValue={values?.speakers ?? initialSpeakers}
          aria-invalid={Boolean(errors?.speakers?.length)}
          aria-describedby="speakers-help speakers-error"
          className={inputClassName}
        />
        <p id="speakers-help" className="text-sm text-[var(--color-muted)]">
          Enter one per line as “speaker | name | topic” or “musical-number | name | topic”.
        </p>
        <FieldError id="speakers" messages={errors?.speakers} />
      </div>

      <fieldset className="rounded-xl border border-[var(--color-line)] p-4">
        <legend className="px-1 text-lg font-semibold">Closing hymn and prayer</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="closingHymnNumber" className="font-medium">Hymn number</label>
            <input
              id="closingHymnNumber"
              name="closingHymnNumber"
              type="number"
              min="1"
              defaultValue={
                values?.closingHymnNumber ?? meeting?.closingHymn.number ?? ""
              }
              aria-invalid={Boolean(errors?.closingHymnNumber?.length)}
              aria-describedby="closingHymnNumber-error"
              className={inputClassName}
            />
            <FieldError id="closingHymnNumber" messages={errors?.closingHymnNumber} />
          </div>
          <div>
            <label htmlFor="closingHymnTitle" className="font-medium">Hymn title</label>
            <input
              id="closingHymnTitle"
              name="closingHymnTitle"
              type="text"
              defaultValue={
                values?.closingHymnTitle ?? meeting?.closingHymn.title ?? ""
              }
              aria-invalid={Boolean(errors?.closingHymnTitle?.length)}
              aria-describedby="closingHymnTitle-error"
              className={inputClassName}
            />
            <FieldError id="closingHymnTitle" messages={errors?.closingHymnTitle} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="closingPrayer" className="font-medium">Closing prayer</label>
            <input
              id="closingPrayer"
              name="closingPrayer"
              type="text"
              defaultValue={values?.closingPrayer ?? meeting?.closingPrayer ?? ""}
              aria-invalid={Boolean(errors?.closingPrayer?.length)}
              aria-describedby="closingPrayer-error"
              className={inputClassName}
            />
            <FieldError id="closingPrayer" messages={errors?.closingPrayer} />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Saving…" : meeting ? "Save changes" : "Create meeting"}
        </button>
        <Link
          href="/meetings"
          className="rounded-full px-4 py-2.5 font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
